package com.puc.moedaestudantil.exception;

public class VantagemNaoEncontradaException extends BusinessException {
    public VantagemNaoEncontradaException(Long id) {
        super("Vantagem nao encontrada: id=" + id);
    }
}
