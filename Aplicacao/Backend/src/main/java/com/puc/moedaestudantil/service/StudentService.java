package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.StudentProfileResponse;
import com.puc.moedaestudantil.dto.UpdateStudentProfileRequest;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.repository.StudentRepository;
import jakarta.inject.Singleton;
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
    
    /**
     * Construtor com injeção de dependência
     * O Micronaut detecta automaticamente que StudentRepository é necessário
     * e a injeta aqui durante a instanciação do StudentService
     */
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
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
                // Atualiza os campos fornecidos
                aluno.setNome(request.nome());
                aluno.setEmail(request.email());
                
                if (request.endereco() != null && !request.endereco().isBlank()) {
                    aluno.setEndereco(request.endereco());
                }
                
                // Atualiza senha apenas se fornecida
                // Em produção, seria necessário fazer hash da senha com bcrypt ou similar
                if (request.senha() != null && !request.senha().isBlank()) {
                    // TODO: Implementar hash de senha
                    // aluno.setSenha(hashPassword(request.senha()));
                }
                
                // Salva as alterações
                studentRepository.update(aluno);
                
                // Retorna o perfil atualizado
                return mapToProfileResponse(aluno);
            });
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
            aluno.getSaldoMoedas().longValue()
        );
    }
}
