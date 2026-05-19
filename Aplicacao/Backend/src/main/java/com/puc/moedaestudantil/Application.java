package com.puc.moedaestudantil;

import io.micronaut.runtime.Micronaut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.regex.Pattern;

public class Application {

    private static final Logger LOG = LoggerFactory.getLogger(Application.class);

    private static final Pattern DB_NAME_SAFE = Pattern.compile("^[a-zA-Z0-9_]+$");

    public static void main(String[] args) {
        bootstrapDatabase(
                System.getenv().getOrDefault("DB_NAME", "moedaestudantil"),
                System.getenv().getOrDefault("DB_HOST", "localhost"),
                System.getenv().getOrDefault("DB_PORT", "5432"),
                System.getenv().getOrDefault("DB_USER", "postgres"),
                System.getenv().getOrDefault("DB_PASSWORD", "postgres")
        );
        Micronaut.run(Application.class, args);
    }

    private static void bootstrapDatabase(String dbName, String host, String port, String user, String password) {
        // CREATE DATABASE não aceita parâmetros JDBC, então o nome é validado contra um whitelist regex
        // antes de ser interpolado na query. Sem essa checagem, a query DDL seria vulnerável a injeção.
        if (!DB_NAME_SAFE.matcher(dbName).matches()) {
            LOG.error("Nome de banco inválido: {}. Abortando criação automática.", dbName);
            return;
        }
        String adminUrl = "jdbc:postgresql://" + host + ":" + port + "/postgres";

        try (Connection connection = DriverManager.getConnection(adminUrl, user, password);
             PreparedStatement check = connection.prepareStatement("SELECT 1 FROM pg_database WHERE datname = ?")) {

            check.setString(1, dbName);
            try (ResultSet rs = check.executeQuery()) {
                if (rs.next()) {
                    LOG.info("Banco '{}' já existe.", dbName);
                    return;
                }
            }

            LOG.info("Banco '{}' não encontrado. Criando...", dbName);
            try (Statement create = connection.createStatement()) {
                create.executeUpdate("CREATE DATABASE " + dbName);
            }
            LOG.info("Banco '{}' criado com sucesso.", dbName);
        } catch (Exception e) {
            LOG.error("Erro ao verificar/criar o banco '{}': {}", dbName, e.getMessage());
        }
    }
}
