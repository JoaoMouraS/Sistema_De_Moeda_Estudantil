package com.puc.moedaestudantil.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

@Serdeable
public record ExtratoResponseDTO(
    Integer saldoAtual,
    List<TransacaoResponseDTO> transacoes
) {
}
