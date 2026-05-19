package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.StudentProfileResponse;
import com.puc.moedaestudantil.dto.TransacaoResponseDTO;
import com.puc.moedaestudantil.dto.UpdateStudentProfileRequest;
import com.puc.moedaestudantil.security.AuthenticatedUser;
import com.puc.moedaestudantil.service.StudentService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import java.util.List;

@Controller("/api/students")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class StudentProfileController {

    @Inject
    private StudentService studentService;

    @Get("/{id}/profile")
    public HttpResponse<StudentProfileResponse> getProfile(@PathVariable Long id, Authentication authentication) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, id);
        return studentService.getStudentProfile(id)
            .map(HttpResponse::ok)
            .orElseGet(HttpResponse::notFound);
    }

    @Put("/{id}/profile")
    public HttpResponse<StudentProfileResponse> updateProfile(
        @PathVariable Long id,
        @Body @Valid UpdateStudentProfileRequest request,
        Authentication authentication
    ) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, id);
        return studentService.updateStudentProfile(id, request)
            .map(HttpResponse::ok)
            .orElseGet(HttpResponse::notFound);
    }

    @Get("/{id}/extrato")
    public HttpResponse<List<TransacaoResponseDTO>> getStudentExtract(@PathVariable Long id, Authentication authentication) {
        AuthenticatedUser.requireOwnerOrAdmin(authentication, id);
        return HttpResponse.ok(studentService.getStudentTransactions(id));
    }
}
