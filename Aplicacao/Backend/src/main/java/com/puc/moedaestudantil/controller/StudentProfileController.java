package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.StudentProfileResponse;
import com.puc.moedaestudantil.dto.TransacaoResponseDTO;
import com.puc.moedaestudantil.dto.UpdateStudentProfileRequest;
import com.puc.moedaestudantil.service.StudentService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.List;

/**
 * StudentProfileController - Controller REST para gerenciar o perfil do aluno
 * 
 * Endpoints:
 * - GET  /api/students/{id}/profile  - Buscar dados do perfil
 * - PUT  /api/students/{id}/profile  - Atualizar dados do perfil
 * 
 * Injeção de Dependência: O Micronaut injeta automaticamente StudentService
 */
@Controller("/api/students")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class StudentProfileController {
    
    @Inject
    private StudentService studentService;
    
    /**
     * GET /api/students/{id}/profile
     * 
     * Busca os dados atuais do perfil do aluno
     * 
     * @param id ID do aluno
     * @return StudentProfileResponse com os dados do perfil ou 404 se não encontrado
     */
    @Get("/{id}/profile")
    public HttpResponse<StudentProfileResponse> getProfile(@PathVariable Long id) {
        return studentService.getStudentProfile(id)
            .map(HttpResponse::ok)
            .orElseGet(() -> HttpResponse.notFound());
    }
    
    /**
     * PUT /api/students/{id}/profile
     * 
     * Atualiza os dados do perfil do aluno
     * As validações são aplicadas automaticamente pelo Micronaut
     * baseadas nas anotações no DTO UpdateStudentProfileRequest
     * 
     * @param id ID do aluno
     * @param request Dados para atualização (com validações)
     * @return StudentProfileResponse atualizado ou 404 se aluno não encontrado
     */
    @Put("/{id}/profile")
    public HttpResponse<Object> updateProfile(
        @PathVariable Long id,
        @Body @Valid UpdateStudentProfileRequest request
    ) {
        try {
            return studentService.updateStudentProfile(id, request)
                .map(profile -> HttpResponse.<Object>ok(profile))
                .orElseGet(() -> HttpResponse.<Object>notFound());
        } catch (IllegalArgumentException ex) {
            return HttpResponse.badRequest(Map.of("mensagem", ex.getMessage()));
        }
    }

    @Get("/{id}/extrato")
    public HttpResponse<List<TransacaoResponseDTO>> getStudentExtract(@PathVariable Long id) {
        return HttpResponse.ok(studentService.getStudentTransactions(id));
    }
}
