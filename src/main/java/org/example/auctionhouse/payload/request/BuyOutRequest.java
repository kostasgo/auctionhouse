package org.example.auctionhouse.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class BuyOutRequest {
    private Long auction_id;

    @NotBlank
    private String username;
}
