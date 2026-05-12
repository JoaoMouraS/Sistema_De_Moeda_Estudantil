package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Aluno;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;

@Singleton // Indica que esta classe é um componente gerenciado pelo Micronaut
public class AlunoDAO {

    private final EntityManager entityManager;

    // O Micronaut injeta o ORM (EntityManager) aqui
    public AlunoDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    public Aluno salvar(Aluno aluno) {
        entityManager.persist(aluno); // O ORM gera o INSERT
        return aluno;
    }

    @Transactional
    public List<Aluno> listarTodos() {
        // O ORM gera o SELECT
        return entityManager.createQuery("SELECT a FROM Aluno a", Aluno.class).getResultList();
    }
    
    @Transactional
    public boolean existePorCpf(String cpf) {
        Long count = entityManager.createQuery("SELECT COUNT(a) FROM Aluno a WHERE a.cpf = :cpf", Long.class)
                .setParameter("cpf", cpf)
                .getSingleResult();
        return count > 0;
    }
}