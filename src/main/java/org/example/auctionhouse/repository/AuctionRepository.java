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

    final static String GET_ALL_ACTIVE_AUCTIONS = "SELECT * FROM auction auc INNER JOIN seller sel ON auc.seller_id=sel.id WHERE auc.active = :active AND sel.user_id != :id";
    @Query(value = GET_ALL_ACTIVE_AUCTIONS, nativeQuery = true)
    List<Auction> findAllActiveAuctions(@Param("active") Boolean active, @Param("id") Integer id);


    final static String GET_USER_AUCTIONS = "SELECT * FROM auction auc INNER JOIN seller sel ON auc.seller_id=sel.id WHERE sel.user_id = :id";
    @Query(value = GET_USER_AUCTIONS, nativeQuery = true)
    List<Auction> findUserAuctions(@Param("id") Integer id);

}
