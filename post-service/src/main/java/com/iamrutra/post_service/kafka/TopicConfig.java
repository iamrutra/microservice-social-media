package com.iamrutra.post_service.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class TopicConfig {

    @Bean
    public NewTopic newTopic(){
        return TopicBuilder.name("new-comment").build();
    }
}
