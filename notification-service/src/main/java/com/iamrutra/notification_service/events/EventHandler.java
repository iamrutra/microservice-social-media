package com.iamrutra.notification_service.events;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventHandler {

    private final JavaMailSender mailSender;

    @KafkaListener(topics = "comment-topic")
    public void NewCommentHandler(CommentEvent event){
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("iamrutra@gmail.com");
            messageHelper.setSubject("New Comment");
            messageHelper.setTo(event.authorEmail());
            messageHelper.setText(String.format("New comment from %s", event.senderName()));
        };
        mailSender.send(messagePreparator);
    }

    @KafkaListener(topics = "like-topic")
    public void NewLikeHandler(CommentEvent event){
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
