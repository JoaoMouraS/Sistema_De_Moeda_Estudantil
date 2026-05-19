package com.puc.moedaestudantil.dto;

import com.puc.moedaestudantil.model.Professor;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record ProfessorResponseDTO(
    Long id,
    String nome,
    String email,
    String cpf,
    String departamento,
    Long instituicaoId,
    String instituicaoNome,
    Integer saldoMoedas
) {
    public static ProfessorResponseDTO fromEntity(Professor professor) {
        return new ProfessorResponseDTO(
            professor.getId(),
            professor.getNome(),
            professor.getEmail(),
            professor.getCpf(),
            professor.getDepartamento(),
            professor.getInstituicao() != null ? professor.getInstituicao().getId() : null,
            professor.getInstituicao() != null ? professor.getInstituicao().getNome() : null,
            professor.getSaldoMoedas()
        );
    }
}
