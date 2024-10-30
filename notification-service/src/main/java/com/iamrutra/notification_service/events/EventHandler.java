package com.iamrutra.notification_service.events;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventHandler {

    private final JavaMailSender mailSender;

    @KafkaListener(topics = "comment-topic", groupId = "notification-service", containerFactory = "kafkaListenerContainerFactory")
    public void newCommentHandler(CommentEvent event){
        log.info("Received message: " + event);
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("iamrutra@gmail.com");
            messageHelper.setSubject("New Comment");
            messageHelper.setTo(event.authorEmail());
            messageHelper.setText(String.format("New comment from %s", event.senderName()));
        };
        mailSender.send(messagePreparator);
    }

    @KafkaListener(topics = "like-topic", groupId = "notification-service")
    public void newLikeHandler(LikeEvent event){
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("iamrutra@gmail.com");
            messageHelper.setSubject("New Like");
            messageHelper.setTo(event.authorEmail());
            messageHelper.setText(String.format("New like from %s", event.senderName()));
        };
        mailSender.send(messagePreparator);
    }
}
