package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @ManyToOne
    @JsonIgnoreProperties({ "sent" })
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JsonIgnoreProperties({ "received" })
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Column
    private LocalDateTime time;

    @Column
    private Boolean deleted;


    public Message(String text, User senderId, User receiverId) {
        this.text = text;
        this.sender = sender;
        this.receiver = receiver;
        this.time = LocalDateTime.now();
        this.deleted = false;


    }
}
