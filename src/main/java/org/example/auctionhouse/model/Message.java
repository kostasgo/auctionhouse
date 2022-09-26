package org.example.auctionhouse.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

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

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private Long recieverId;





    public Message(String name) {
        this.text = text;
    }
}
