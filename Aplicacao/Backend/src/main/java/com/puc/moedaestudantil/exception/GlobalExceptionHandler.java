package com.puc.moedaestudantil.exception;

import com.puc.moedaestudantil.security.AuthenticatedUser;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class GlobalExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Produces
    @Singleton
    @Requires(classes = {AuthenticatedUser.ForbiddenException.class, ExceptionHandler.class})
    public static class ForbiddenHandler implements ExceptionHandler<AuthenticatedUser.ForbiddenException, HttpResponse<?>> {
        @Override
        public HttpResponse<?> handle(HttpRequest request, AuthenticatedUser.ForbiddenException exception) {
            Map<String, Object> body = new HashMap<>();
            body.put("erro", "Acesso negado");
            body.put("mensagem", exception.getMessage());
            return HttpResponse.status(HttpStatus.FORBIDDEN).body(body);
        }
    }

    @Produces
    @Singleton
    @Requires(classes = {IllegalArgumentException.class, ExceptionHandler.class})
    public static class IllegalArgumentHandler implements ExceptionHandler<IllegalArgumentException, HttpResponse<?>> {
        @Override
        public HttpResponse<?> handle(HttpRequest request, IllegalArgumentException exception) {
            Map<String, Object> body = new HashMap<>();
            body.put("erro", "Requisição inválida");
            body.put("mensagem", exception.getMessage());
            return HttpResponse.badRequest(body);
        }
    }

    @Produces
    @Singleton
    @Requires(classes = {EntityNotFoundException.class, ExceptionHandler.class})
    public static class EntityNotFoundHandler implements ExceptionHandler<EntityNotFoundException, HttpResponse<?>> {
        @Override
        public HttpResponse<?> handle(HttpRequest request, EntityNotFoundException exception) {
            Map<String, Object> body = new HashMap<>();
            body.put("erro", "Recurso não encontrado");
            body.put("mensagem", exception.getMessage());
            return HttpResponse.notFound(body);
        }
    }

    @Produces
    @Singleton
    @io.micronaut.context.annotation.Replaces(io.micronaut.validation.exceptions.ConstraintExceptionHandler.class)
    @Requires(classes = {ConstraintViolationException.class, ExceptionHandler.class})
    public static class ConstraintViolationHandler implements ExceptionHandler<ConstraintViolationException, HttpResponse<?>> {
        @Override
        public HttpResponse<?> handle(HttpRequest request, ConstraintViolationException exception) {
            Map<String, Object> body = new HashMap<>();
            body.put("erro", "Erro de validação");
            body.put("camposInvalidos", exception.getConstraintViolations().stream()
                    .collect(Collectors.toMap(
                            cv -> {
                                String path = cv.getPropertyPath().toString();
                                int lastDot = path.lastIndexOf('.');
                                return lastDot >= 0 ? path.substring(lastDot + 1) : path;
                            },
                            ConstraintViolation::getMessage,
                            (a, b) -> a)));
            return HttpResponse.badRequest(body);
        }
    }

    @Produces
    @Singleton
    @Requires(classes = {RuntimeException.class, ExceptionHandler.class})
    public static class RuntimeExceptionHandler implements ExceptionHandler<RuntimeException, HttpResponse<?>> {
        @Override
        public HttpResponse<?> handle(HttpRequest request, RuntimeException exception) {
            LOG.error("Erro inesperado em {} {}", request.getMethod(), request.getPath(), exception);
            Map<String, Object> body = new HashMap<>();
            body.put("erro", "Erro interno");
            body.put("mensagem", "Ocorreu um erro inesperado. Verifique os logs do servidor.");
            return HttpResponse.serverError(body);
        }
    }
}
