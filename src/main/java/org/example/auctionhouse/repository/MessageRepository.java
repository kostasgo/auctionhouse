package org.example.auctionhouse.repository;

import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.payload.response.MessageResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findById(Long id);

    final static String GET_USER_INBOX = "SELECT * FROM messages mes INNER JOIN user u ON mes.sender_id=u.id WHERE mes.receiver_id = :id AND mes.deleted=false ORDER BY mes.id DESC";
    @Query(value = GET_USER_INBOX, nativeQuery = true)
    List<Message> getUserInbox(@Param("id") Integer id);

    final static String GET_USER_SENT = "SELECT * FROM messages mes WHERE mes.sender_id = :id AND mes.deleted=false ORDER BY mes.id DESC";
    @Query(value = GET_USER_SENT, nativeQuery = true)
    List<Message> getUserSent(@Param("id") Integer id);

    final static String DELETE_MESSAGE = "UPDATE messages mes SET mes.deleted = true WHERE mes.id = :id ";
    @Modifying
    @Transactional
    @Query(value = DELETE_MESSAGE, nativeQuery = true)
    void deleteMessage(@Param("id") Integer id);
}
