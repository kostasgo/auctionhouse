package org.example.auctionhouse.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Getter
@Setter
public class AuctionUpdateRequest {

    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 1000)
    private String description;

    @Size(max = 50)
    private String location;

    @NotBlank
    private String ends;

    private Set<String> categories;

    private Double buyPrice;

    private Double firstBid;
}

