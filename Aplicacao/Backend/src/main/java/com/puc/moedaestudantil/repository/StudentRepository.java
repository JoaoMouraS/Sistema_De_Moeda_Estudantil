package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Aluno;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.Optional;

/**
 * StudentRepository - Interface do Micronaut Data para operações CRUD de Aluno
 * 
 * Injeção de Dependência: O Micronaut Data gera automaticamente a implementação
 * em tempo de compilação, implementando o CrudRepository<T, ID>
 */
@Repository
public interface StudentRepository extends CrudRepository<Aluno, Long> {
    
    /**
     * Busca um aluno pelo email
     * O Micronaut Data gera a query SQL automaticamente baseado no nome do método
     */
    Optional<Aluno> findByEmail(String email);
}
