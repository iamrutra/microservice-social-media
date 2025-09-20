CREATE TABLE _users
(
    id                 INT          NOT NULL,
    keycloak_id        VARCHAR(255) NULL,
    username           VARCHAR(255) NULL,
    full_name          VARCHAR(255) NULL,
    date_of_birth      date         NULL,
    email              VARCHAR(255) NULL,
    password           VARCHAR(255) NULL,
    profile_image_link VARCHAR(255) NULL,
    status             VARCHAR(255) NULL,
    created_at         datetime     NULL,
    updated_at         datetime     NULL,
    is_locked          BIT(1)       NOT NULL,
    is_enabled         BIT(1)       NOT NULL,
    CONSTRAINT pk__users PRIMARY KEY (id)
);

CREATE TABLE user_followers
(
    follower_id  INT NOT NULL,
    following_id INT NOT NULL
);

ALTER TABLE _users
    ADD CONSTRAINT uc__users_email UNIQUE (email);

ALTER TABLE _users
    ADD CONSTRAINT uc__users_username UNIQUE (username);

ALTER TABLE user_followers
    ADD CONSTRAINT fk_usefol_on_follower FOREIGN KEY (follower_id) REFERENCES _users (id);

ALTER TABLE user_followers
    ADD CONSTRAINT fk_usefol_on_following FOREIGN KEY (following_id) REFERENCES _users (id);