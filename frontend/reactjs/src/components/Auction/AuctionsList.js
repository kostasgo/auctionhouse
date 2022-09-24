import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./AuctionsList.css"
import AuctionPage from './AuctionPage';
import AuthService from "../../services/auth.service";
import { Form } from 'react-bootstrap';

function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auctions: [],
            toAuction: false,
            auction_id: -1,
            redirect: null,
            userReady: false,
            currentUser: { username: "" }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        axios.get("http://localhost:8080/api/v1/auctions?active=true&id="+String(currentUser.id))
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

    }

    render() {
        const handleSearch = () => {
            console.log("SEARCH CLICKED");
            //  <Route path="/" element={<Navigate to="/" />} />
        };

        const handleSelect = (id) => {
            console.log("SELECT CLICKED");
            this.setState({ toAuction: true });
            this.setState({ auction_id: id });
        };

        const handleUserClick = () => {
            console.log("USER CLICKED");
            //  <Route path="/" element={<Navigate to="/" />} />
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;



        return (!this.state.toAuction) ? <>

            <div className='title'>
                <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>Browse Auctions</u></span>
                            <span className='lead'>Find what you need!</span>
                        </div>
                </div>
            </div>

            <Form className="d-flex">
                    <Form.Control
                      type="search"
                      placeholder="#Anything you desire"
                      className="me-2"
                      aria-label="Search"
                    />
                    <Button variant="primary">Search</Button>
                  </Form>

            <Container className='search-container'>
                <Row xs={4} md={4} xl={4}>
                    <Col><Button variant="btn btn-success">FILTER1</Button></Col>
                    <Col><Button variant="btn btn-warning">FILTER2</Button></Col>
                    <Col><Button variant="btn btn-danger">FILTER3</Button></Col>
                    <Col><Button variant="btn btn-info">FILTER4</Button></Col>
                </Row>
                
            </Container>

            <Row>
                {
                    this.state.auctions.length === 0 ?
                        <h3>0 Auctions Available</h3>
                        :

                        this.state.auctions.map((auction) => (
                            <Col xs={12} md={6} xl={4}>
                                <div className="auctionItem">
                                    <Card key={auction.id} className="card" >
                                        <Card.Img variant="top" src={auction.imgUrl[0]} style={{ objectFit: 'cover', height: '350px' }} />
                                        <Card.Body>
                                            <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Auctioned By: <Button variant="secondary" className='userName' onClick={handleUserClick} >{auction.seller.user.username}</Button> ({auction.seller.rating}/5) <span className='votecount'> {auction.seller.rating_count} votes </span> </Card.Subtitle>
                                            {/* <Card.Text className="text-left">
                                                {auction.description}
                                            </Card.Text> */}

                                            <ListGroup variant="flush">
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : {moment().format("YYYY-MM-DD hh:mm:ss")} </ListGroup.Item> */}
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : { new Date().toString() } </ListGroup.Item> */}
                                                <ListGroup.Item key='1' className='mb-2 text-muted'>Ends on&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                <ListGroup.Item key='2' className='mb-2 text-muted'>Time remaining&nbsp;&nbsp;: &emsp;
                                                    {diff = Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                                    {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                                    {Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes
                                                </ListGroup.Item>
                                            </ListGroup>

                                            <Card.Footer>
                                                <Row>
                                                    <Col className="footer-mini-container"> CURRENT BID: &ensp; </Col>
                                                    <Col> {auction.currently} € </Col>
                                                </Row>

                                                <Row >
                                                    <Button variant="primary" className='select-button' onClick={() => handleSelect(auction.id)}>SEE MORE</Button>
                                                </Row>
                                            </Card.Footer>

                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        ))
                }
            </Row >
        </> : <AuctionPage data_tranfer={this.state.auction_id} />


    }
}
