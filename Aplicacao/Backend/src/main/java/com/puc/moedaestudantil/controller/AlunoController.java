package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.service.AlunoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import jakarta.inject.Inject;
import java.util.List;

@Controller("/api/alunos")
public class AlunoController {

    @Inject
    private AlunoService alunoService;

    @Post
    public HttpResponse<Aluno> cadastrar(@Body Aluno aluno) {
        Aluno novoAluno = alunoService.salvar(aluno);
        return HttpResponse.created(novoAluno);
    }

    @Get
    public HttpResponse<List<Aluno>> listar() {
        return HttpResponse.ok(alunoService.listarTodos());
    }
}