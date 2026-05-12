package com.puc.moedaestudantil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import io.micronaut.runtime.Micronaut;

public class Application {

    public static void main(String[] args) {
        // Configurações do seu banco
        String dbName = "moedaestudantil";
        String url = "jdbc:postgresql://localhost:5432/";
        String user = "postgres";
        String password = "postgres"; // Coloque sua senha real aqui

        try (Connection connection = DriverManager.getConnection(url + "postgres", user, password);
             Statement statement = connection.createStatement()) {

            // 2. Verifica se o banco de dados já existe
            ResultSet resultSet = statement.executeQuery("SELECT 1 FROM pg_database WHERE datname = '" + dbName + "'");
            
            if (!resultSet.next()) {
                System.out.println("🚀 Banco de dados '" + dbName + "' não encontrado. Criando automaticamente...");
                statement.executeUpdate("CREATE DATABASE " + dbName);
                System.out.println("✅ Banco de dados '" + dbName + "' criado com sucesso!");
            } else {
                System.out.println("ℹ️ Banco de dados '" + dbName + "' já existe. Conectando...");
            }

        } catch (Exception e) {
            System.err.println("❌ Erro ao tentar verificar/criar o banco de dados: " + e.getMessage());
        }

        // 3. Inicia o Micronaut normalmente
        Micronaut.run(Application.class, args);
    }
}