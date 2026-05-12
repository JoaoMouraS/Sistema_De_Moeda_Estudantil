package com.puc.moedaestudantil.repository;

import java.util.List;

import com.puc.moedaestudantil.model.EmpresaParceira;

import jakarta.inject.Singleton;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Singleton
public class EmpresaParceiraDAO {

    private final EntityManager entityManager;

    public EmpresaParceiraDAO(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    public EmpresaParceira salvar(EmpresaParceira empresa) {
        entityManager.persist(empresa);
        return empresa;
    }

    @Transactional
    public List<EmpresaParceira> listarTodas() {
        return entityManager.createQuery("SELECT e FROM EmpresaParceira e", EmpresaParceira.class).getResultList();
    }
}