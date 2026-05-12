package com.puc.moedaestudantil.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
// Define a estratégia de herança: tabelas separadas que se unem pelo ID
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    // Construtor vazio obrigatório para o Hibernate
    public Usuario() {
    }

    // Método para validar senha (útil para o futuro sistema de login)
    public boolean autenticar(String senha) {
        // No futuro, você usará uma biblioteca de hash (ex: BCrypt)
        return this.senhaHash.equals(senha);
    }

    // ----------------------------------------------------
    // GETTERS E SETTERS
    // ----------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
}