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
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




export default class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" },

            messages : [],

            toMessage: false,
            toInbox : false,
            toSent : false,
            toChat : true,

            id : -1,
            text : "",
            sender : "",
            receiver: "",
            time : "",
            name : ""
        };

        this.handleToInbox = this.handleToInbox.bind(this);
        this.handleToSent = this.handleToSent.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleGetMessages = this.handleGetMessages.bind(this);
        this.handleMsgClick = this.handleMsgClick.bind(this);
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
        this.setState({toMessage : false, toSent:false, toInbox:false, toChat:true , messages : []});
    }

    handleGetMessages(){
        this.setState({toSent:false, toInbox:false, toChat:true});
    }

    handleMsgClick(id, text, time, sender, receiver, username){
        console.log("in click");
        // console.log(id) ;
        // console.log(text);
        // console.log(time);
        // console.log(sender);
        // console.log(receiver);
        if(this.state.id!=-1)document.getElementById(this.state.id+1000).setAttribute("class", "chat_list" );
        document.getElementById(id+1000).setAttribute("class", "chat_list active_chat" )
    
        this.setState({ toMessage:true,
                        curId : id,
                        curText : text,
                        curTime : time,
                        curSender : sender,
                        curReceiver : receiver,
                        curName : username});
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }



        return( 
            <>
            <div className='title'>
                    <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>Messaging <FontAwesomeIcon icon={faMessage} /></u></span>
                            <span className='lead'>COMMUNICATE WITH EVERYONE!</span>
                        </div>
                    </div>
                </div>
            {this.state.toChat?
            <>

                <div class="d-grid gap-2 col-6 mx-auto">
                <Button type="button" variant="btn btn-outline-primary" className='btn-lg inbox-btn position-relative-start' onClick={this.handleToInbox}> INBOX </Button>
               
                <Button type="button" variant="btn btn-outline-primary" className='btn-lg sent-btn position-relative-end' onClick={this.handleToSent}> SENT </Button>
                </div>
            </>
            :
            <>
    
            <Button variant="primary" className='back-button shadow' onClick={this.handleBack}> &emsp;BACK TO BROWSING&emsp; </Button>
                <div class="container">
                    <h3 class=" text-center">{this.state.toInbox?<span>Inbox</span>:<span>Sent</span>}</h3>
                    <div class="messaging">
                        <div class="inbox_msg">
                            <div class="inbox_people">
                            <div class="headind_srch">
                                <div class="recent_heading">
                                <h4>{this.state.toInbox?<span>Inbox</span>:<span>Sent</span>} Messages</h4>
                                </div>
                            </div>
                            <div class="inbox_chat">

                                {this.state.messages.map((message) => (
                                <div onClick={()=>this.handleMsgClick(message.id, message.text, message.time, message.senderId, message.receiverId, message.username)}>
                                    <div class="chat_list active_chat" id={message.id + 1000}>
                                        <div class="chat_people">
                                            <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> </div>
                                            <div class="chat_ib">
                                            <h5>{this.state.toInbox?<>from {message.senderId} to you</>:<>from you to {message.receiverId}</>} <span class="chat_date">{message.time.replace('T', ' ').replace('Z', '').replace(/-/g,'/')}</span></h5>
                                            <p>{message.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}

                            </div>
                            </div>
                            <div class="mesgs">
                                <div class="msg_history">

                                    {this.state.toMessage?
                                    <div>
                                        <h2 className='display-6 justify-content-center msgtitle'>{this.state.curSender==this.state.currentUser.id?<>Sent to : </>:<>Sent by : </> }{this.state.curName} </h2>
                                        <h4 className='lead lh-base msginfo'>{this.state.curText}</h4>
                                        <br></br>
                                        <div className='lead lh-base msginfo'>{this.state.curTime.replace('T', ' ').replace('Z', '').replace(/-/g,'/')}</div>
                                    </div>
                                    :
                                    <></>
                                    }
                                

                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
                <br></br><br></br><br></br><br></br>
            </>
            }
        </>
        )
    }



}
