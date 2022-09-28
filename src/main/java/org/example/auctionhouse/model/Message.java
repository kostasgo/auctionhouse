package org.example.auctionhouse.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.bytebuddy.asm.Advice;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @GeneratedValue
    @Id
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false, name = "sender_id")
    private Long senderId;

    @Column(nullable = false, name = "receiver_id")
    private Long receiverId;

    @Column
    private LocalDateTime time;

    @Column
    private Boolean deleted;


    public Message(String text, Long senderId, Long receiverId) {
        this.text = text;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.time = LocalDateTime.now();
        this.deleted = false;
    }
}
