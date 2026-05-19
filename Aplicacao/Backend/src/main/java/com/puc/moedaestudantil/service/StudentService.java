package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.StudentProfileResponse;
import com.puc.moedaestudantil.dto.TransacaoResponseDTO;
import com.puc.moedaestudantil.dto.UpdateStudentProfileRequest;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.repository.StudentRepository;
import com.puc.moedaestudantil.repository.TransacaoDAO;
import com.puc.moedaestudantil.security.PasswordEncoder;
import jakarta.inject.Singleton;
import java.util.List;
import java.util.Optional;

/**
 * StudentService - Serviço que encapsula a lógica de negócio para operações de aluno
 * 
 * Singleton: Apenas uma instância do serviço será criada durante toda a vida da aplicação
 * Injeção de Dependência: O Micronaut injeta automaticamente StudentRepository
 */
@Singleton
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final TransacaoDAO transacaoDAO;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Construtor com injeção de dependência
     * O Micronaut detecta automaticamente que StudentRepository é necessário
     * e a injeta aqui durante a instanciação do StudentService
     */
    public StudentService(StudentRepository studentRepository, TransacaoDAO transacaoDAO, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.transacaoDAO = transacaoDAO;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * Busca o perfil do aluno pelo ID
     * 
     * @param id ID do aluno
     * @return Optional contendo StudentProfileResponse se encontrado
     */
    public Optional<StudentProfileResponse> getStudentProfile(Long id) {
        return studentRepository.findById(id)
            .map(this::mapToProfileResponse);
    }
    
    /**
     * Atualiza o perfil do aluno
     * 
     * @param id ID do aluno
     * @param request Dados da atualização
     * @return Optional contendo StudentProfileResponse atualizado
     */
    public Optional<StudentProfileResponse> updateStudentProfile(
        Long id, 
        UpdateStudentProfileRequest request
    ) {
        return studentRepository.findById(id)
            .map(aluno -> {
                if (!aluno.getEmail().equals(request.email()) && studentRepository.findByEmail(request.email()).isPresent()) {
                    throw new IllegalArgumentException("Email já está em uso por outro usuário.");
                }

                aluno.setNome(request.nome());
                aluno.setEmail(request.email());

                if (request.endereco() != null && !request.endereco().isBlank()) {
                    aluno.setEndereco(request.endereco());
                } else {
                    aluno.setEndereco(null);
                }

                if (request.senha() != null && !request.senha().isBlank()) {
                    aluno.setSenhaHash(passwordEncoder.hash(request.senha()));
                }

                studentRepository.update(aluno);
                return mapToProfileResponse(aluno);
            });
    }
    
    /**
     * Retorna as transações do aluno pelo ID
     *
     * @param studentId ID do aluno
     * @return lista de transações associadas ao aluno
     */
    public List<TransacaoResponseDTO> getStudentTransactions(Long studentId) {
        return transacaoDAO.listarPorAluno(studentId).stream()
                .map(TransacaoResponseDTO::fromEntity)
                .toList();
    }
    
    /**
     * Converte uma entidade Aluno para StudentProfileResponse
     * Este mapeamento evita expor dados internos desnecessários
     */
    private StudentProfileResponse mapToProfileResponse(Aluno aluno) {
        return new StudentProfileResponse(
            aluno.getId(),
            aluno.getNome(),
            aluno.getEmail(),
            aluno.getCpf(),
            aluno.getRg(),
            aluno.getEndereco(),
            aluno.getCurso(),
            aluno.getInstituicao() != null ? aluno.getInstituicao().getId() : null,
            aluno.getInstituicao() != null ? aluno.getInstituicao().getNome() : null,
            aluno.getSaldoMoedas()
        );
    }
}
