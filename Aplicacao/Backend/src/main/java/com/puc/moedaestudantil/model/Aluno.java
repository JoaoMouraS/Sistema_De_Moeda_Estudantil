package com.puc.moedaestudantil.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Aluno extends Usuario {

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String rg;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Column(nullable = false)
    private String curso;

    @Column(nullable = false)
    private Integer saldoMoedas = 0;

    // Construtor vazio (Obrigatório para o Hibernate funcionar)
    public Aluno() {
    }

    // ----------------------------------------------------
    // GETTERS E SETTERS (Isto resolve o seu erro)
    // ----------------------------------------------------

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public Integer getSaldoMoedas() {
        return saldoMoedas;
    }

    public void setSaldoMoedas(Integer saldoMoedas) {
        this.saldoMoedas = saldoMoedas;
    }
}