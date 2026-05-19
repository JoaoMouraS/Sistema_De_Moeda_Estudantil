package com.puc.moedaestudantil.config;

import com.puc.moedaestudantil.model.Administrador;
import com.puc.moedaestudantil.model.Instituicao;
import com.puc.moedaestudantil.model.Professor;
import com.puc.moedaestudantil.model.Usuario;
import com.puc.moedaestudantil.repository.InstituicaoDAO;
import com.puc.moedaestudantil.repository.ProfessorDAO;
import com.puc.moedaestudantil.repository.UsuarioDAO;
import com.puc.moedaestudantil.security.PasswordEncoder;
import io.micronaut.context.event.StartupEvent;
import io.micronaut.runtime.event.annotation.EventListener;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class DataSeeder {

    private static final Logger LOG = LoggerFactory.getLogger(DataSeeder.class);

    private final InstituicaoDAO instituicaoDAO;
    private final ProfessorDAO professorDAO;
    private final UsuarioDAO usuarioDAO;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(InstituicaoDAO instituicaoDAO, ProfessorDAO professorDAO, UsuarioDAO usuarioDAO, PasswordEncoder passwordEncoder) {
        this.instituicaoDAO = instituicaoDAO;
        this.professorDAO = professorDAO;
        this.usuarioDAO = usuarioDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener
    public void onStartup(StartupEvent event) {
        
        // 1. SEED DE INSTITUIÇÕES
        if (!instituicaoDAO.listarTodas().isEmpty()) {
            LOG.info("Seed: instituições já existem, pulando.");
        } else {
            Instituicao puc = novaInstituicao("PUC Minas", "12345678000100", "Av. Dom José Gaspar, 500 - Belo Horizonte/MG");
            Instituicao ufmg = novaInstituicao("UFMG", "12345678000201", "Av. Antônio Carlos, 6627 - Belo Horizonte/MG");
            Instituicao cefet = novaInstituicao("CEFET-MG", "12345678000302", "Av. Amazonas, 7675 - Belo Horizonte/MG");
            instituicaoDAO.salvar(puc);
            instituicaoDAO.salvar(ufmg);
            instituicaoDAO.salvar(cefet);
            LOG.info("Seed: 3 instituições inseridas.");
        }

        // 2. SEED DE PROFESSOR
        if (professorDAO.buscarPorCpf("11122233344").isEmpty()) {
            Instituicao puc = instituicaoDAO.listarTodas().get(0);

            Professor prof = new Professor();
            prof.setEmail("joao.aramuni@puc.br");
            prof.setSenhaHash(passwordEncoder.hash("senha123"));
            prof.setCpf("11122233344");
            prof.setNome("João Paulo Aramuni");
            prof.setDepartamento("Engenharia de Software");
            prof.setSaldoMoedas(1000);
            prof.setInstituicao(puc);
            professorDAO.salvar(prof);
            LOG.info("Seed: professor exemplo inserido.");
        }

        // 3. SEED DO USUÁRIO ADMIN (AGORA DENTRO DO MÉTODO, DO JEITO CERTO)
            if (usuarioDAO.buscarPorEmail("admin@studentcoins.com").isEmpty()) {
            Administrador admin = new Administrador();
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@studentcoins.com");
            admin.setSenhaHash(passwordEncoder.hash("admin123")); 
            
            // O usuarioDAO aceita salvar o Administrador pois ele herda de Usuario
            usuarioDAO.salvar(admin);
            LOG.info("Seed: Usuário ADMIN inserido com sucesso.");
        }
    }

    private Instituicao novaInstituicao(String nome, String cnpj, String endereco) {
        Instituicao i = new Instituicao();
        i.setNome(nome);
        i.setCnpj(cnpj);
        i.setEndereco(endereco);
        return i;
    }
}