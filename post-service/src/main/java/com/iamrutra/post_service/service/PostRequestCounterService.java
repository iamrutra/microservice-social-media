package com.iamrutra.post_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PostRequestCounterService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String REQUEST_COUNT_PREFIX = "request_count_post_";
    
    public int incrementRequestCount(int postId) {
        String key = REQUEST_COUNT_PREFIX + postId;
        Integer count = (Integer) redisTemplate.opsForValue().get(key);
        
        if (count == null) {
            count = 0;
        }
        
        count++;
        redisTemplate.opsForValue().set(key, count, 1, TimeUnit.DAYS);
        return count;
    }

    public void resetRequestCount(int postId) {
        redisTemplate.delete(REQUEST_COUNT_PREFIX + postId);
    }
}
