package com.iamrutra.api_geteaway.config;

import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    
    @Bean
    public HttpMessageConverters messageConverters() {
        return new HttpMessageConverters();
    }
}
