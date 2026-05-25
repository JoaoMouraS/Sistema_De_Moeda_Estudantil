package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.request.VantagemRequest;
import com.puc.moedaestudantil.dto.response.VantagemResponse;
import com.puc.moedaestudantil.security.AuthenticatedUser;
import com.puc.moedaestudantil.service.VantagemService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

@Tag(name = "Vantagens")
@Controller("/api/vantagens")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class VantagemController {

    private final VantagemService vantagemService;

    public VantagemController(VantagemService vantagemService) {
        this.vantagemService = vantagemService;
    }

    @Operation(summary = "Cadastra uma vantagem (empresa autenticada)")
    @ApiResponse(responseCode = "201", description = "Vantagem criada")
    @Post
    @Secured(AuthenticatedUser.ROLE_EMPRESA)
    public HttpResponse<VantagemResponse> cadastrar(@Body @Valid VantagemRequest request,
                                                    Authentication authentication) {
        Long empresaId = AuthenticatedUser.getUserId(authentication);
        return HttpResponse.created(vantagemService.cadastrar(empresaId, request));
    }

    @Operation(summary = "Lista todas as vantagens ativas (catalogo do aluno)")
    @Get
    public List<VantagemResponse> listar() {
        return vantagemService.listarTodas();
    }

    @Operation(summary = "Lista vantagens de uma empresa (a propria empresa ou admin)")
    @Get("/empresa/{empresaId}")
    public List<VantagemResponse> listarPorEmpresa(Long empresaId, Authentication authentication) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, empresaId);
        return vantagemService.listarPorEmpresa(empresaId);
    }

    @Operation(summary = "Detalhes de uma vantagem")
    @Get("/{id}")
    public VantagemResponse buscar(Long id) {
        return vantagemService.buscarPorId(id);
    }

    @Operation(summary = "Atualiza uma vantagem (apenas a empresa dona ou admin)")
    @Put("/{id}")
    @Secured({AuthenticatedUser.ROLE_EMPRESA, AuthenticatedUser.ROLE_ADMIN})
    public VantagemResponse atualizar(Long id,
                                      @Body @Valid VantagemRequest request,
                                      Authentication authentication) {
        Long empresaSolicitanteId = AuthenticatedUser.getUserId(authentication);
        boolean isAdmin = AuthenticatedUser.isAdmin(authentication);
        return vantagemService.atualizar(id, empresaSolicitanteId, isAdmin, request);
    }

    @Operation(summary = "Exclui (soft-delete) uma vantagem (apenas a empresa dona ou admin)")
    @ApiResponse(responseCode = "204", description = "Vantagem removida")
    @Delete("/{id}")
    @Secured({AuthenticatedUser.ROLE_EMPRESA, AuthenticatedUser.ROLE_ADMIN})
    public HttpResponse<Void> deletar(Long id, Authentication authentication) {
        Long empresaSolicitanteId = AuthenticatedUser.getUserId(authentication);
        boolean isAdmin = AuthenticatedUser.isAdmin(authentication);
        vantagemService.deletar(id, empresaSolicitanteId, isAdmin);
        return HttpResponse.noContent();
    }
}
