import React, { Component } from 'react'
import { Container, Row, Col, Card, Button, NavItem } from 'react-bootstrap'
import "./ChatPage.css"
import AuthService from "../services/auth.service";
import ChatService from "../services/chat.service";
import { Redirect } from "react-router-dom";
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-bootstrap/Modal';
import chatService from '../services/chat.service';
import { async } from 'q';




export default class ChatPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" },

            messages: [],

            toMessage: false,
            toInbox: false,
            toSent: false,
            toChat: true,

            showDeletePopUp: false,

            prevId: -1,
            id: -1,
            text: "",
            sender: "",
            receiver: "",
            time: "",
            name: ""
        };

        this.handleToInbox = this.handleToInbox.bind(this);
        this.handleToSent = this.handleToSent.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleGetMessages = this.handleGetMessages.bind(this);
        this.handleMsgClick = this.handleMsgClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeletePopUp = this.handleDeletePopUp.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        console.log(guest);
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        if (!guest && !currentUser) this.setState({ redirect: "/login" });
    }

    handleToInbox() {
        this.setState({ toInbox: true, toChat: false });

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

    handleToSent() {
        this.setState({ toSent: true, toChat: false });

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

    handleBack() {
        this.setState({ prevId: -1, toMessage: false, toSent: false, toInbox: false, toChat: true, messages: [] });
    }

    handleGetMessages() {
        this.setState({ toSent: false, toInbox: false, toChat: true });
    }

    handleMsgClick(message) {
        console.log("in click");

        if (this.state.prevId != -1) document.getElementById(this.state.prevId + 1000).setAttribute("class", "chat_list inactive_chat");
        document.getElementById(message.id + 1000).setAttribute("class", "chat_list active_chat")
        this.state.prevId = message.id;

        this.setState({
            toMessage: true,
            curMessage: message
        });
    }

    handleDelete(id) {
        console.log("in click");
        ChatService.deleteMessage(id);
        var elem = document.getElementById(id + 1000);
        elem.parentNode.removeChild(elem);
        this.setState({
            showDeletePopUp: false,
            toMessage: false
        });

    }


    handleDeletePopUp() {
        this.setState({
            showDeletePopUp: true,
        });
    };

    handleClose() {
        this.setState({
            showDeletePopUp: false,
        });
    };




    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };



        return (
            <>
                <div className='title'>
                    <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>Messaging <FontAwesomeIcon icon={faMessage} /></u></span>
                            <span className='lead'>COMMUNICATE WITH EVERYONE!</span>
                        </div>
                    </div>
                </div>
                {this.state.toChat ?
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
                            <h3 class=" text-center">{this.state.toInbox ? <span>Inbox</span> : <span>Sent</span>}</h3>
                            <div class="messaging">
                                <div class="inbox_msg">
                                    <div class="inbox_people">
                                        <div class="headind_srch">
                                            <div class="recent_heading">
                                                <h4>{this.state.toInbox ? <span>Inbox</span> : <span>Sent</span>} Messages</h4>
                                            </div>
                                        </div>
                                        <div class="inbox_chat">

                                            {this.state.messages.map((message) => (
                                                <div onClick={() => this.handleMsgClick(message)}>
                                                    <div class="chat_list" id={message.id + 1000}>
                                                        <div class="chat_people">
                                                            <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                                            <div class="chat_ib">
                                                                <h5>{this.state.toInbox ? <>from {message.sender.username} to you</> : <>from you to {message.receiver.username}</>} <span class="chat_date">{message.time.replace('T', ' ').replace('Z', '').replace(/-/g, '/')}</span></h5>
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

                                            {this.state.toMessage ?
                                                <div id='current-message'>
                                                    <h2 className='display-6 justify-content-center msgtitle'>{this.state.curMessage.sender.id == this.state.currentUser.id ? <>Sent to {this.state.curMessage.receiver.username}: </> : <>Sent by : {this.state.curMessage.sender.username}</>} </h2>
                                                    <h4 className='lead lh-base msgtext'>{this.state.curMessage.text}</h4>
                                                    <hr />
                                                    <div className='text-muted'>{new Date(this.state.curMessage.time).toLocaleString(options)}</div>


                                                    <br></br><br></br>
                                                    <Button className='mx-2' variant="btn btn-danger" onClick={() => this.handleDeletePopUp()}>DELETE</Button>
                                                    <Modal show={this.state.showDeletePopUp} onHide={() => this.handleClose()}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>ARE YOU SURE?</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Are you sure you want to delete this message? Action is irriversable.</Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                                                Back
                                                            </Button>
                                                            <Button variant="primary" onClick={() => this.handleDelete(this.state.curMessage.id)}>
                                                                Yes, delete
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                    {this.state.toInbox ?
                                                        <Button className='mx-2' variant="btn btn-success">REPLY</Button>
                                                        : null}
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
