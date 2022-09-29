package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
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
    @JsonIgnoreProperties({"seller", "email", "name","phone","country","role","bidder","location"})
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Double rating;

    @Column(name= "rating_count")
        private Integer ratingCount;

    @OneToMany(targetEntity = Bid.class, mappedBy = "bidder", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Bid> bids;

    public Bidder(User user) {
            this.user = user;
            this.rating = 0.0;
            this.ratingCount = 0;
            this.bids = new HashSet<Bid>();
    }


}
