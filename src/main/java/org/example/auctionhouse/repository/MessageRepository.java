package org.example.auctionhouse.repository;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findById(Long id);

    final static String GET_USER_INBOX = "SELECT * FROM messages mes WHERE mes.sender_id = :id ORDER BY mes.id ";
    @Query(value = GET_USER_INBOX, nativeQuery = true)
    List<Message> getUserInbox(@Param("id") Integer id);

    final static String GET_USER_SENT = "SELECT * FROM messages mes WHERE mes.receiver_id = :id ORDER BY mes.id ";
    @Query(value = GET_USER_SENT, nativeQuery = true)
    List<Message> getUserSent(@Param("id") Integer id);
}
