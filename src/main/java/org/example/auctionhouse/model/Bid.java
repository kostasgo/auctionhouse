package org.example.auctionhouse.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "bid")
public class Bid {

    @GeneratedValue
    @Id
    private Long id;
    @ManyToOne
    @JoinColumn(name = "bidder_id")
    private Bidder bidder;

    @ManyToOne
    @JoinColumn(name = "auction_id")
    private Auction auction;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private Double amount;
}
