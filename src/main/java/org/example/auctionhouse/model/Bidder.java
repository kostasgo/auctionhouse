package org.example.auctionhouse.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "bidder")
public class Bidder {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Integer rating;

    @OneToMany(targetEntity = Bid.class, mappedBy = "bidder", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Bid> bids;

    public Bidder(User user, Integer rating) {
        this.user = user;
        this.rating = rating;
    }


}
