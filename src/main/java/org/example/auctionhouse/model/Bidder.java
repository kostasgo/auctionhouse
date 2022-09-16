package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property="id")
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
