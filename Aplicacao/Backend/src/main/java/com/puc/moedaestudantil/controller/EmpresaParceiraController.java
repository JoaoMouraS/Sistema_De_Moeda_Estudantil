package com.puc.moedaestudantil.controller;

import java.util.List;

import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.service.EmpresaParceiraService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import jakarta.inject.Inject;

@Controller("/api/empresas")
public class EmpresaParceiraController {

    @Inject
    private EmpresaParceiraService empresaService;

    @Post
    public HttpResponse<EmpresaParceira> cadastrar(@Body EmpresaParceira empresa) {
        EmpresaParceira novaEmpresa = empresaService.cadastrar(empresa);
        return HttpResponse.created(novaEmpresa);
    }

    @Get
    public HttpResponse<List<EmpresaParceira>> listar() {
        return HttpResponse.ok(empresaService.listarTodas());
    }
}