package org.example.auctionhouse.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class BidRequest {

    private Long auction_id;

    @NotBlank
    private String username;

    private Double amount;
}
