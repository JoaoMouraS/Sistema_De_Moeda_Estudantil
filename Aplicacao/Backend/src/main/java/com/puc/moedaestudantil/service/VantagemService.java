package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.VantagemRequest;
import com.puc.moedaestudantil.dto.response.VantagemResponse;
import com.puc.moedaestudantil.exception.AcessoNegadoException;
import com.puc.moedaestudantil.exception.EmpresaNaoEncontradaException;
import com.puc.moedaestudantil.exception.VantagemNaoEncontradaException;
import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.model.Vantagem;
import com.puc.moedaestudantil.repository.EmpresaParceiraRepository;
import com.puc.moedaestudantil.repository.VantagemRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Singleton
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaRepository;

    public VantagemService(VantagemRepository vantagemRepository,
                           EmpresaParceiraRepository empresaRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional
    public VantagemResponse cadastrar(Long empresaId, VantagemRequest request) {
        EmpresaParceira empresa = carregarEmpresa(empresaId);

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(request.nome());
        vantagem.setDescricao(request.descricao());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setFotoUrl(request.fotoUrl());
        vantagem.setEmpresa(empresa);

        return toResponse(vantagemRepository.save(vantagem));
    }

    public List<VantagemResponse> listarTodas() {
        return vantagemRepository.findAllByDeletedAtIsNull().stream()
            .map(this::toResponse)
            .toList();
    }

    public List<VantagemResponse> listarPorEmpresa(Long empresaId) {
        carregarEmpresa(empresaId);
        return vantagemRepository.findAllByEmpresaIdAndDeletedAtIsNull(empresaId).stream()
            .map(this::toResponse)
            .toList();
    }

    public VantagemResponse buscarPorId(Long id) {
        return toResponse(carregar(id));
    }

    @Transactional
    public VantagemResponse atualizar(Long id, Long empresaSolicitanteId, boolean isAdmin, VantagemRequest request) {
        Vantagem vantagem = carregar(id);
        garantirDono(vantagem, empresaSolicitanteId, isAdmin);

        vantagem.setNome(request.nome());
        vantagem.setDescricao(request.descricao());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setFotoUrl(request.fotoUrl());

        return toResponse(vantagemRepository.update(vantagem));
    }

    @Transactional
    public void deletar(Long id, Long empresaSolicitanteId, boolean isAdmin) {
        Vantagem vantagem = carregar(id);
        garantirDono(vantagem, empresaSolicitanteId, isAdmin);

        vantagem.setDeletedAt(LocalDateTime.now());
        vantagemRepository.update(vantagem);
    }

    private Vantagem carregar(Long id) {
        return vantagemRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new VantagemNaoEncontradaException(id));
    }

    private EmpresaParceira carregarEmpresa(Long empresaId) {
        return empresaRepository.findByIdAndDeletedAtIsNull(empresaId)
            .orElseThrow(() -> new EmpresaNaoEncontradaException(empresaId));
    }

    private void garantirDono(Vantagem vantagem, Long empresaSolicitanteId, boolean isAdmin) {
        if (isAdmin) {
            return;
        }
        Long donaId = vantagem.getEmpresa() != null ? vantagem.getEmpresa().getId() : null;
        if (donaId == null || !donaId.equals(empresaSolicitanteId)) {
            throw new AcessoNegadoException("Empresa nao pode alterar vantagens de outras empresas.");
        }
    }

    private VantagemResponse toResponse(Vantagem v) {
        EmpresaParceira empresa = v.getEmpresa();
        return new VantagemResponse(
            v.getId(),
            v.getNome(),
            v.getDescricao(),
            v.getCustoMoedas(),
            v.getFotoUrl(),
            empresa != null ? empresa.getId() : null,
            empresa != null ? empresa.getNomeFantasia() : null
        );
    }
}
