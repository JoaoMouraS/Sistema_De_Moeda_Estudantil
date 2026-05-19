package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.DistribuirMoedasRequestDTO;
import com.puc.moedaestudantil.dto.ExtratoResponseDTO;
import com.puc.moedaestudantil.dto.TransacaoResponseDTO;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.model.Professor;
import com.puc.moedaestudantil.model.Transacao;
import com.puc.moedaestudantil.model.TipoTransacao;
import com.puc.moedaestudantil.repository.AlunoDAO;
import com.puc.moedaestudantil.repository.ProfessorDAO;
import com.puc.moedaestudantil.repository.TransacaoDAO;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Singleton
public class ProfessorService {

    @Inject
    private ProfessorDAO professorDAO;

    @Inject
    private AlunoDAO alunoDAO;

    @Inject
    private TransacaoDAO transacaoDAO;

    public List<Professor> listarTodos() {
        return professorDAO.listarTodos();
    }

    public Professor buscarPorId(Long id) {
        return professorDAO.buscarPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado: id=" + id));
    }

    public ExtratoResponseDTO obterExtrato(Long professorId) {
        Professor professor = buscarPorId(professorId);
        List<TransacaoResponseDTO> transacoes = transacaoDAO.listarPorProfessor(professorId).stream()
                .map(TransacaoResponseDTO::fromEntity)
                .toList();
        return new ExtratoResponseDTO(professor.getSaldoMoedas(), transacoes);
    }

    @Transactional
    public TransacaoResponseDTO distribuirMoedas(Long professorId, DistribuirMoedasRequestDTO dto) {
        Professor professor = professorDAO.buscarPorId(professorId)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado: id=" + professorId));

        Aluno aluno = alunoDAO.buscarPorId(dto.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado: id=" + dto.getAlunoId()));

        int quantidade = dto.getQuantidade();
        if (professor.getSaldoMoedas() < quantidade) {
            throw new IllegalArgumentException(
                "Saldo insuficiente: você tem " + professor.getSaldoMoedas()
                    + " moedas e tentou enviar " + quantidade + ".");
        }

        professor.setSaldoMoedas(professor.getSaldoMoedas() - quantidade);
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + quantidade);

        professorDAO.atualizar(professor);
        alunoDAO.atualizar(aluno);

        Transacao transacao = new Transacao();
        transacao.setTipo(TipoTransacao.ENVIO_MOEDA);
        transacao.setQuantidadeMoedas(quantidade);
        transacao.setDataHora(LocalDateTime.now());
        transacao.setMensagem(dto.getMensagem());
        transacao.setProfessor(professor);
        transacao.setAluno(aluno);

        transacaoDAO.salvar(transacao);
        return TransacaoResponseDTO.fromEntity(transacao);
    }
}
