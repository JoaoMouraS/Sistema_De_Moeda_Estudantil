package com.puc.moedaestudantil.dto.request;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Serdeable
public record VantagemRequest(
    @NotBlank @Size(max = 255) String nome,
    @Nullable @Size(max = 5000) String descricao,
    @NotNull @Min(value = 1, message = "custoMoedas deve ser maior que zero") Integer custoMoedas,
    @Nullable @Size(max = 500) String fotoUrl
) {}
