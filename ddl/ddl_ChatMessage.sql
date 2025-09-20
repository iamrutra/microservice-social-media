CREATE TABLE chat_message
(
    id           INT          NOT NULL,
    chat_id      VARCHAR(255) NULL,
    sender_id    INT          NOT NULL,
    recipient_id INT          NOT NULL,
    content      VARCHAR(255) NULL,
    file         VARCHAR(255) NULL,
    timestamp    datetime     NULL,
    CONSTRAINT pk_chatmessage PRIMARY KEY (id)
);