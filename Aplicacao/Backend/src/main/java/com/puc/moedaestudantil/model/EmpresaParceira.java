package com.puc.moedaestudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class EmpresaParceira extends Usuario {

    @Column(nullable = false, unique = true, length = 14)
    private String cnpj;

    @Column(nullable = false)
    private String nomeFantasia;

    public EmpresaParceira() {}

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
}