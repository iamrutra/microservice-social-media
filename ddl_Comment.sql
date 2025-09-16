CREATE TABLE _comments
(
    id         INT          NOT NULL,
    comment    VARCHAR(255) NULL,
    user_id    INT          NOT NULL,
    created_at VARCHAR(255) NULL,
    updated_at VARCHAR(255) NULL,
    post_id    INT          NULL,
    CONSTRAINT pk__comments PRIMARY KEY (id)
);

ALTER TABLE _comments
    ADD CONSTRAINT FK__COMMENTS_ON_POST FOREIGN KEY (post_id) REFERENCES _posts (id);