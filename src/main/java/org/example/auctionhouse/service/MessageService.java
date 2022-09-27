package org.example.auctionhouse.service;


import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Message saveOrUpdate(Message message) {
        return messageRepository.saveAndFlush(message);
    }

    public List<Message> getUserInbox(Integer id) {
        return messageRepository.getUserInbox(id);
    }

    public List<Message> getUserSent(Integer id) {
        return messageRepository.getUserSent(id);
    }

}