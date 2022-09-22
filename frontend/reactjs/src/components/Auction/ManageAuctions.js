import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./ManageAuctions.css"
import AuctionManagePage from './AuctionManagePage';
import AuthService from "../../services/auth.service";

function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class ManageAuctions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auctions: [],
            toAuctionManage: false,
            auction_id: -1,
            redirect: null,
            userReady: false,
            currentUser: { username: "" }
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions")
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        const currentUser = AuthService.getCurrentUser();
        if (currentUser)this.setState({ currentUser: currentUser, userReady: true });
    
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
            console.log("SELECT CLICKED");
            this.setState({ toAuctionManage: true });
            this.setState({ auction_id: id });
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;

        

        return (!this.state.toAuctionManage) ? <>
            
            <Row>
                {
                    this.state.auctions.length === 0 ?
                        <h3>0 Active Auctions Available</h3>
                        :

                        this.state.auctions.map((auction) => (
                            <Col xs={12} md={6} xl={4}>
                                <div className="auctionItem">
                                    <Card key={auction.id}>
                                        <Card.Img variant="top" src={auction.imgUrl} style={{ objectFit: 'cover', maxHeight: '350px' }} />
                                        <Card.Body>
                                            <Card.Title className="text-left"><span className='display-6'>{auction.name}</span></Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Auctioned By: <Button variant="secondary" className='userName' onClick={handleUserClick} >{auction.seller.user.username}</Button> ({auction.seller.rating}/5) <span className='votecount'> {auction.seller.rating_count} votes </span> </Card.Subtitle>
                                            <Card.Text className="text-left">
                                                {auction.description}
                                            </Card.Text>

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
                                                    <Button variant="primary" className='select-button' onClick={() => handleSelect(auction.id)}>EDIT   </Button>
                                                </Row>
                                            </Card.Footer>

                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        ))
                }
            </Row >
        </> : <AuctionManagePage data_tranfer={this.state.auction_id} />


    }
}
