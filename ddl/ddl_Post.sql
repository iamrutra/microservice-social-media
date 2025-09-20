CREATE TABLE _posts
(
    id             INT          NOT NULL,
    title          VARCHAR(255) NULL,
    content        VARCHAR(255) NULL,
    user_id        INT          NULL,
    total_likes    INT          NULL,
    total_comments INT          NULL,
    post_image     VARCHAR(255) NULL,
    created_at     datetime     NULL,
    updated_at     datetime     NULL,
    CONSTRAINT pk__posts PRIMARY KEY (id)
);