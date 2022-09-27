import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import { Container, Row, Col, Card, Button, NavItem } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./ChatPage.css"
import AuthService from "../services/auth.service";
import ChatService from "../services/chat.service";
import { Redirect } from "react-router-dom";
import Chat from "./sharedComponents/Chat"
import { Link } from "react-router-dom";
import chatService from '../services/chat.service';




export default class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" },

            messages : [],

            toInbox : false,
            toSent : false,
            toChat : true
        };

        this.handleToInbox = this.handleToInbox.bind(this);
        this.handleToSent = this.handleToSent.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleGetMessages = this.handleGetMessages.bind(this);
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        console.log(guest);
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        if (!guest && !currentUser) this.setState({ redirect: "/login" });
    }

    handleToInbox(){
        this.setState({toInbox:true, toChat:false});

        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        console.log(guest);
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        if (!guest && !currentUser) this.setState({ redirect: "/login" });
        ChatService.getUserInbox(currentUser.id)
        .then(response => response.data)
        .then((data) => {
            console.log(data);
            this.setState({ messages: data });
        });

    }

    handleToSent(){
        this.setState({toSent:true, toChat:false});

        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        console.log(guest);
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        if (!guest && !currentUser) this.setState({ redirect: "/login" });
        ChatService.getUserSent(currentUser.id)
        .then(response => response.data)
        .then((data) => {
            console.log(data);
            this.setState({ messages: data });
        });

    }

    handleBack(){
        this.setState({toSent:false, toInbox:false, toChat:true , messages : []});
    }

    handleGetMessages(){
        this.setState({toSent:false, toInbox:false, toChat:true});
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }



        return (this.state.toChat?
            <>
                <Row>
                    <Button type="button" variant="secondary" class='btn-lg' onClick={this.handleToInbox}>INBOX</Button>
                </Row>

                <Row>
                    <Button type="button" variant="secondary" class='btn-lg' onClick={this.handleToSent}>OUTGOING</Button>
                </Row>
            </>
            :
            <>
            <Button variant="primary" className='back-button shadow' onClick={this.handleBack}> &emsp;BACK TO BROWSING&emsp; </Button>
                <div class="container">
                    <h3 class=" text-center">Messaging</h3>
                    <div class="messaging">
                        <div class="inbox_msg">
                            <div class="inbox_people">
                            <div class="headind_srch">
                                <div class="recent_heading">
                                <h4>{this.state.toInbox?<span>Inbox</span>:<span>Sent</span>} Messages</h4>
                                </div>
                                <div class="srch_bar">
                                <div class="stylish-input-group">
                                    <input type="text" class="search-bar"  placeholder="Search" />
                                    <span class="input-group-addon">
                                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                    </span> </div>
                                </div>
                            </div>
                            <div class="inbox_chat">

                                {this.state.messages.map((message) => (
                                <div class="chat_list active_chat">
                                <div class="chat_people">
                                    <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                                    <div class="chat_ib">
                                    <h5>{this.state.toInbox?<>{message.senderId}</>:<>{message.receiverId}</>} <span class="chat_date">{message.time.replace('T', ' ').replace('Z', '').replace(/-/g,'/')}</span></h5>
                                    <p>{message.text}</p>
                                    </div>
                                </div>
                                </div>
                                ))}

                            </div>
                            </div>
                            <div class="mesgs">
                                <div class="msg_history">
                                

                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </>
        )
    }



}
