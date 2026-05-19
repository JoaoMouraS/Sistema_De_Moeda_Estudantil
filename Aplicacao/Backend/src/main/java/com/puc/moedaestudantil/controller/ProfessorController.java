package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.DistribuirMoedasRequestDTO;
import com.puc.moedaestudantil.dto.ExtratoResponseDTO;
import com.puc.moedaestudantil.dto.ProfessorResponseDTO;
import com.puc.moedaestudantil.dto.TransacaoResponseDTO;
import com.puc.moedaestudantil.security.AuthenticatedUser;
import com.puc.moedaestudantil.service.ProfessorService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import java.util.List;

@Controller("/api/professores")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class ProfessorController {

    @Inject
    private ProfessorService professorService;

    @Get
    @Secured(AuthenticatedUser.ROLE_ADMIN)
    public HttpResponse<List<ProfessorResponseDTO>> listar() {
        List<ProfessorResponseDTO> dtos = professorService.listarTodos().stream()
                .map(ProfessorResponseDTO::fromEntity)
                .toList();
        return HttpResponse.ok(dtos);
    }

    @Get("/me")
    @Secured(AuthenticatedUser.ROLE_PROFESSOR)
    public HttpResponse<ProfessorResponseDTO> obterMeuPerfil(Authentication authentication) {
        Long id = AuthenticatedUser.getUserId(authentication);
        return HttpResponse.ok(ProfessorResponseDTO.fromEntity(professorService.buscarPorId(id)));
    }

    @Get("/{id}")
    public HttpResponse<ProfessorResponseDTO> buscar(Long id, Authentication authentication) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, id);
        return HttpResponse.ok(ProfessorResponseDTO.fromEntity(professorService.buscarPorId(id)));
    }

    @Get("/{id}/extrato")
    public HttpResponse<ExtratoResponseDTO> obterExtrato(Long id, Authentication authentication) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, id);
        return HttpResponse.ok(professorService.obterExtrato(id));
    }

    @Post("/{id}/distribuir")
    @Secured(AuthenticatedUser.ROLE_PROFESSOR)
    public HttpResponse<TransacaoResponseDTO> distribuirMoedas(
            Long id,
            @Body @Valid DistribuirMoedasRequestDTO dto,
            Authentication authentication) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, id);
        return HttpResponse.created(professorService.distribuirMoedas(id, dto));
    }
}
