package com.iamrutra.chatRoom.bucket;

import lombok.Getter;

@Getter
public enum BucketName {
    FILE("iamrutra-social-media-chat-service");

    private final String bucketName;

    BucketName(String bucketName) {
        this.bucketName = bucketName;
    }

}
