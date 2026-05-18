package com.puc.moedaestudantil.dto;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * UpdateStudentProfileRequest - DTO para atualização do perfil do aluno
 * Utilizada no endpoint PUT /api/students/{id}/profile
 * 
 * Validações:
 * - nome: obrigatório, entre 3 e 150 caracteres
 * - email: obrigatório, formato válido de email
 * - endereco: opcional
 * - senha: opcional (não enviada se vazia)
 */
@Serdeable
public record UpdateStudentProfileRequest(
    @NotBlank(message = "Nome não pode estar em branco")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    String nome,
    
    @NotBlank(message = "Email não pode estar em branco")
    @Email(message = "Email deve ser válido")
    String email,
    
    String endereco,
    
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    String senha
) {
}
