package com.puc.moedaestudantil.dto;

import io.micronaut.serde.annotation.Serdeable;

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
    Integer saldoMoedas
) {
}
