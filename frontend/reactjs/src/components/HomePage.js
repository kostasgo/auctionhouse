import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import { Container, Row, Col, Card, Button, NavItem } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./HomePage.css"
import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";




export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            selectedFiles: null,
            redirect: null,
            currentUser: { username: "" }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        console.log(guest);
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        if (!guest && !currentUser) this.setState({ redirect: "/login" });
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFiles: event.target.files[0]
        });
    }

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append("images", this.state.selectedFiles);
        axios.post("http://localhost:8080/api/v1/auctions/images", this.state.selectedFiles, {
            headers: {
                'Content-Type': 'multipart/form-data;'
            }
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

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




        return (
            <>

                <div className='title'>
                    <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-4'>{(this.state.userReady) ? <> Welcome back {this.state.currentUser.username}! </> : <> Welcome to AuctionHouse!</>}</span>
                            <span className='lead'>Find what you need!</span>
                        </div>
                    </div>
                </div>

                <Container>
                    <Row>
                        <Col>
                            <input onChange={this.fileSelectedHandler} type="file" />
                            <button onClick={this.fileUploadHandler} > Upload </button>

                        </Col>
                    </Row>
                </Container>


            </>)

    }
}
