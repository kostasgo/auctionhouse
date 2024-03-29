package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property="id")
@NoArgsConstructor
@Table(name = "auction")
public class Auction {

    @GeneratedValue
    @Id
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties({ "auctions" })
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
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column
    private LocalDateTime starts;

    @Column(nullable = false)
    private LocalDateTime ends;

    @ManyToMany(cascade =  CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "auction_category", joinColumns = @JoinColumn(referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(referencedColumnName = "id"))
    private List<Category> categories;

    @Column
    private Double currently;

    @Column(name="buy_price")
    private Double buyPrice;

    @Column(name="first_bid", nullable = false)
    private Double firstBid;

    @OneToMany(targetEntity = Bid.class, mappedBy = "auction", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Bid> bids;

    @Column
    private String imgUrl;

    @Column
    private Integer numberOfBids;

    @Column(nullable = false)
    private Boolean active;

    private Boolean completed = false;

    private Boolean boughtOut = false;

    @JsonIgnore
    @Column(name = "auction_features")
    private Double[] auctionFeatures;


    public Auction(Seller seller, String name, String description, String country, String location, Double latitude, Double longitude, LocalDateTime starts, LocalDateTime ends, List<Category> categories, Double buyPrice, Double firstBid, String imgUrl) {
        this.seller = seller;
        this.name = name;
        this.description = description;
        this.country = country;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.starts = starts;
        this.ends = ends;
        this.categories = categories;
        this.currently = firstBid;
        this.buyPrice = buyPrice;
        this.firstBid = firstBid;
        this.bids = null;
        this.imgUrl = imgUrl;
        this.active = false;
        this.numberOfBids=0;
//
//        Random r = new Random();
//        Double[] auctionFeatures = new Double[10];
//        for (int j=10; j<10; j++){
//            auctionFeatures[j] = r.nextDouble();
//        }
//        this.auctionFeatures=auctionFeatures;
    }

}
