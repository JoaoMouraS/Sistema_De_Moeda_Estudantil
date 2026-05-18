package com.puc.moedaestudantil.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

@Entity
@Table(name = "administrador")
@Serdeable
public class Administrador extends Usuario {

    @Column(nullable = false)
    private String nome;

    public Administrador() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}