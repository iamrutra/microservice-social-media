package com.iamrutra.user_service.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RequestCounterService {

    private static final Logger log = LoggerFactory.getLogger(RequestCounterService.class);
    private final RedisTemplate<String, Object> redisTemplate;
    private final static String REQUEST_COUNT_PREFIX = "request_count_user_";
    
    public int incrementRequestCount(int userId) {
        String key = REQUEST_COUNT_PREFIX + userId;
        Integer count = (Integer) redisTemplate.opsForValue().get(key);
        log.info("Request count for user {} is {}", userId, count);
        
        if (count == null) {
            count = 0;
        }
        
        count++;
        redisTemplate.opsForValue().set(key, count, 1, TimeUnit.DAYS);
        return count;
    }

}