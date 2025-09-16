CREATE TABLE chat_room
(
    id           INT          NOT NULL,
    chat_id      VARCHAR(255) NULL,
    sender_id    INT          NOT NULL,
    recipient_id INT          NOT NULL,
    CONSTRAINT pk_chatroom PRIMARY KEY (id)
);