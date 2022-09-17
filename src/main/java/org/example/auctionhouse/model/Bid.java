package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "bid")
public class Bid {

    @GeneratedValue
    @Id
    private Long id;
    @ManyToOne
    @JoinColumn(name = "bidder_id")
    @JsonManagedReference
    private Bidder bidder;

    @ManyToOne
    @JoinColumn(name = "auction_id")
    @JsonBackReference
    private Auction auction;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private Double amount;

    public Bid(Bidder bidder, Auction auction, LocalDateTime time, Double amount) {
        this.bidder = bidder;
        this.auction = auction;
        this.time = time;
        this.amount = amount;
    }
}
