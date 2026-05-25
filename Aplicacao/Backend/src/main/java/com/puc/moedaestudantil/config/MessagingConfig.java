package com.puc.moedaestudantil.config;

import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import io.micronaut.context.annotation.Value;
import io.micronaut.context.event.StartupEvent;
import io.micronaut.rabbitmq.connect.ChannelPool;
import io.micronaut.runtime.event.annotation.EventListener;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Singleton
public class MessagingConfig {

    private static final Logger LOG = LoggerFactory.getLogger(MessagingConfig.class);

    private final ChannelPool channelPool;
    private final String exchange;
    private final String emailQueue;
    private final String whatsappQueue;
    private final String dlq;
    private final String dlx;

    public MessagingConfig(ChannelPool channelPool,
                           @Value("${notifications.exchange}") String exchange,
                           @Value("${notifications.queues.email}") String emailQueue,
                           @Value("${notifications.queues.whatsapp}") String whatsappQueue,
                           @Value("${notifications.queues.dlq}") String dlq,
                           @Value("${notifications.dlx}") String dlx) {
        this.channelPool = channelPool;
        this.exchange = exchange;
        this.emailQueue = emailQueue;
        this.whatsappQueue = whatsappQueue;
        this.dlq = dlq;
        this.dlx = dlx;
    }

    @EventListener
    public void onStartup(StartupEvent event) {
        Channel channel = null;
        try {
            channel = channelPool.getChannel();

            channel.exchangeDeclare(dlx, BuiltinExchangeType.FANOUT, true);
            channel.queueDeclare(dlq, true, false, false, null);
            channel.queueBind(dlq, dlx, "");

            channel.exchangeDeclare(exchange, BuiltinExchangeType.TOPIC, true);

            Map<String, Object> queueArgs = Map.of(
                "x-dead-letter-exchange", dlx
            );

            channel.queueDeclare(emailQueue, true, false, false, queueArgs);
            channel.queueBind(emailQueue, exchange, "notification.email.#");

            channel.queueDeclare(whatsappQueue, true, false, false, queueArgs);
            channel.queueBind(whatsappQueue, exchange, "notification.whatsapp.#");

            LOG.info("RabbitMQ: topologia declarada (exchange={}, filas=[{}, {}], DLQ={}).",
                exchange, emailQueue, whatsappQueue, dlq);
        } catch (Exception e) {
            LOG.warn("Falha ao declarar topologia RabbitMQ ({}). Notificacoes ficarao indisponiveis ate o broker subir.",
                e.getMessage());
        } finally {
            if (channel != null) {
                channelPool.returnChannel(channel);
            }
        }
    }
}
