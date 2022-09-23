import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./HomePage.css"
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";




export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser)this.setState({ currentUser: currentUser, userReady: true });
        // console.log(currentUser);
    }

    render() {
        const handleSearch = () => {
            console.log("SEARCH CLICKED");
            //  <Route path="/" element={<Navigate to="/" />} />
        };

        const handleSelect = (id) => {
            console.log("SELECT CLICKED");
            this.setState({ toAuctionManage: true });
            this.setState({ auction_id: id });
        };

        const handleUserClick = (id) => {
            console.log("USER CLICKED");
        };

     

        return(
            <>

            <div className='title'>
                <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-4'>{(this.state.userReady)?<> Welcome back {this.state.currentUser.username}! </>: <> Welcome to AuctionHouse!</>}</span>
                            <span className='lead'>Find what you need!</span>
                        </div>
                </div>
            </div>

            <Container>
                <Row>
                    <Col> </Col>
                </Row>
            </Container>


            </>)

    }
}
