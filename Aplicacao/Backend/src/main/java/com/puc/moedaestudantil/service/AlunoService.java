package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.repository.AlunoDAO;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import java.util.List;

@Singleton
public class AlunoService {

    @Inject
    private AlunoDAO alunoDAO;

    public Aluno salvar(Aluno aluno) {
        if (alunoDAO.existePorCpf(aluno.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }
        return alunoDAO.salvar(aluno);
    }

    public List<Aluno> listarTodos() {
        return alunoDAO.listarTodos();
    }
}