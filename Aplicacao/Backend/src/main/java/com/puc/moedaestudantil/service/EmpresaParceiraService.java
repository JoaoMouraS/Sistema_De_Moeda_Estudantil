package com.puc.moedaestudantil.service;

import java.util.List;

import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.repository.EmpresaParceiraDAO;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;

@Singleton
public class EmpresaParceiraService {

    @Inject
    private EmpresaParceiraDAO empresaDAO;

    public EmpresaParceira cadastrar(EmpresaParceira empresa) {
        // Aqui entraria a lógica para verificar se o CNPJ já existe, por exemplo.
        return empresaDAO.salvar(empresa);
    }

    public List<EmpresaParceira> listarTodas() {
        return empresaDAO.listarTodas();
    }
}