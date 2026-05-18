package com.puc.moedaestudantil.dto;

import io.micronaut.serde.annotation.Serdeable;

/**
 * StudentProfileResponse - DTO para exibição dos dados do perfil do aluno
 * Utilizada no endpoint GET /api/students/{id}/profile
 */
@Serdeable
public record StudentProfileResponse(
    Long id,
    String nome,
    String email,
    String cpf,
    String rg,
    String endereco,
    String curso,
    Long instituicaoId,
    String instituicaoNome,
    Long saldoMoedas
) {
}
