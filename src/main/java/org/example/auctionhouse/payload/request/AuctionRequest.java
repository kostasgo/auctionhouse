package org.example.auctionhouse.payload.request;

import lombok.Getter;
import lombok.Setter;
import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.model.Category;
import org.example.auctionhouse.model.Seller;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.validation.constraints.*;

@Getter
@Setter
public class AuctionRequest {

    @NotBlank
    private String username;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotBlank
    @Size(max = 50)
    private String country;

    @Size(max = 50)
    private String location;

    private Double latitude;

    private Double longitude;

    @NotBlank
    private String ends;

    private Set<String> categories;

    private Double buyPrice;

    private Double firstBid;

    private String[] images;

    private String[] imageNames;
}

