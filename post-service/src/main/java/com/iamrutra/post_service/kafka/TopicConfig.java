package com.iamrutra.post_service.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class TopicConfig {

//    @Bean
//    public NewTopic likeTopic(){
//        return TopicBuilder.name("like-topic").build();
//    }

    @Bean
    public NewTopic commentTopic(){
        return TopicBuilder.name("comment-topic").build();
    }
}
