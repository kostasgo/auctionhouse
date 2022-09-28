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
    final static String SEARCH_AUCTIONS = "SELECT * FROM auction auc JOIN seller sel ON auc.seller_id=sel.id JOIN auction_category ON auc.id = auction_category.auction_id JOIN category cat ON auction_category.categories_id = cat.id WHERE auc.active = :active AND auc.name LIKE %:search% AND sel.user_id != :id AND cat.name LIKE %:category% AND auc.currently <= :max AND auc.country LIKE %:country% ORDER BY auc.id DESC LIMIT 3 OFFSET :offset ";
    @Query(value = SEARCH_AUCTIONS, nativeQuery = true)
    List<Auction> searchAuctions(@Param("search") String search,@Param("max")Integer max,@Param("category")String category,@Param("country")String country,@Param("active") Boolean active, @Param("id") Integer id, @Param("offset") Integer offset);


    final static String SEARCH_AUCTIONS_COUNT = "SELECT COUNT(*) FROM auction auc JOIN seller sel ON auc.seller_id=sel.id JOIN auction_category ON auc.id = auction_category.auction_id JOIN category cat ON auction_category.categories_id= cat.id WHERE auc.active = :active AND auc.name LIKE %:search% AND sel.user_id != :id AND cat.name LIKE %:category% AND auc.currently <= :max AND auc.country LIKE %:country% ORDER BY auc.id DESC";
    @Query(value = SEARCH_AUCTIONS_COUNT, nativeQuery = true)
    Integer searchAuctionsCount(@Param("search") String search,@Param("max")Integer max,@Param("category")String category,@Param("country")String country,@Param("active") Boolean active, @Param("id") Integer id);


    final static String GET_USER_AUCTIONS = "SELECT * FROM auction auc INNER JOIN seller sel ON auc.seller_id=sel.id WHERE sel.user_id = :id ORDER BY auc.id DESC LIMIT 3 OFFSET :offset";
    @Query(value = GET_USER_AUCTIONS, nativeQuery = true)
    List<Auction> findAllUserAuctions(@Param("id") Integer id, @Param("offset") Integer offset);

    final static String GET_USER_AUCTIONS_COUNT = "SELECT COUNT(*) FROM auction auc INNER JOIN seller sel ON auc.seller_id=sel.id WHERE sel.user_id = :id ORDER BY auc.id DESC";
    @Query(value = GET_USER_AUCTIONS_COUNT, nativeQuery = true)
    Integer findAllUserAuctionsCount(@Param("id") Integer id);


    final static String FIND_ALL_ACTIVE_AUCTIONS = "SELECT * FROM auction auc WHERE auc.active = true ORDER BY auc.id DESC";
    @Query(value = FIND_ALL_ACTIVE_AUCTIONS, nativeQuery = true)
    List<Auction> findAllActiveAuctions(@Param("active")Boolean active);


}
