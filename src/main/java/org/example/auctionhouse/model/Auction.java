package org.example.auctionhouse.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "auction")
public class Auction {

    @GeneratedValue
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column
    private String country;

    @Column
    private String location;

    @Column(nullable = false)
    private LocalDateTime started;

    @Column(nullable = false)
    private LocalDateTime ends;

    @ManyToMany(cascade =  CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "auction_category", joinColumns = @JoinColumn(referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(referencedColumnName = "id"))
    private List<Category> categories;

    @Column
    private Double currently;

    @Column(name="buy_price")
    private Double buyPrice;

    @Column(name="first_bid", nullable = false)
    private Double firstBid;

    @Column(name="number_of_bids")
    private Long numberOfBids;

    @OneToMany(targetEntity = Bid.class, mappedBy = "auction", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Bid> bids;


}
