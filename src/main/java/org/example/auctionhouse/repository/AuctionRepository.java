package org.example.auctionhouse.repository;

import org.example.auctionhouse.model.Auction;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    final static String GET_ACTIVE_AUCTIONS = "SELECT * FROM auction auc WHERE auc.active = :active";
    @Query(value = GET_ACTIVE_AUCTIONS, nativeQuery = true)
    List<Auction> findAllAuctions(@Param("active") Boolean active);

}
