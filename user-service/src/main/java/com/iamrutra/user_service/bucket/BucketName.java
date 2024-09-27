package com.iamrutra.user_service.bucket;

import lombok.Getter;

@Getter
public enum BucketName {
    PROFILE_IMAGE("iamrutra-social-media-user-service");

    private final String bucketName;

    BucketName(String bucketName) {
        this.bucketName = bucketName;
    }

}
