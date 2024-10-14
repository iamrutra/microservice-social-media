package com.iamrutra.feeds_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class FeedsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FeedsServiceApplication.class, args);
	}

}
