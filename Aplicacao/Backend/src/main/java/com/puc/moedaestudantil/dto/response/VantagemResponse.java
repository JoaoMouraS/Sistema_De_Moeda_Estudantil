package com.puc.moedaestudantil.dto.response;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record VantagemResponse(
    Long id,
    String nome,
    String descricao,
    Integer custoMoedas,
    String fotoUrl,
    Long empresaId,
    String empresaNomeFantasia
) {}
