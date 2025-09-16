CREATE TABLE _likes
(
    id         INT      NOT NULL,
    post_id    INT      NULL,
    user_id    INT      NULL,
    created_at datetime NULL,
    CONSTRAINT pk__likes PRIMARY KEY (id)
);

ALTER TABLE _likes
    ADD CONSTRAINT FK__LIKES_ON_POST FOREIGN KEY (post_id) REFERENCES _posts (id);