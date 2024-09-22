package com.iamrutra.post_service.bucket;

public enum BucketName {
    PROFILE_IMAGE("iamrutra-social-media-post-service");

    private final String bucketName;

    BucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getBucketName() {
        return bucketName;
    }
}
