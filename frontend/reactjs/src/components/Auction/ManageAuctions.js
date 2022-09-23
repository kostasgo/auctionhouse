import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Router, Redirect } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./ManageAuctions.css"
import AuctionManagePage from './AuctionManagePage';
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";

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
        const currentUser = AuthService.getCurrentUser();
        if (currentUser!= null){
            this.setState({ currentUser: currentUser, userReady: true });
            axios.get("http://localhost:8080/api/v1/auctions?id="+String(currentUser.id))
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
                // console.log(data);
            });
        }
        else{
            this.setState({ currentUser: "redirect"});
        }
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

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        
        

        return (
        this.state.currentUser!="redirect"?
        <>
        {!this.state.toAuctionManage ? 
            <>
            <div className='title'>
                <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>MANAGE AUCTIONS</u></span>
                            <span className='lead'>YOUR AUCTIONS</span>
                        </div>
                </div>
            </div>
            <Row>
                {
                    this.state.auctions.length === 0 ?
                        <h3>No auctions made yet...</h3>
                        :
                        
                        <Col xs={12} md={6} xl={4}>
                                <Link to="/new-auction" className="new">
                                    <Card key="new" background='green' style={{ objectFit: 'cover', maxHeight: '100px' }}>
                                        <Card.Img variant="top" src="https://content.fortune.com/wp-content/uploads/2019/04/brb05.19.plus_.jpg"  style={{ objectFit: 'cover', maxHeight: '350px' }} />
                                        <Card.Body>
                                            <Card.Title className="text-left"><span className='display-6'>NEW AUCTION</span></Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Create a new auction </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                        </Col>}

                        {this.state.auctions.map((auction) => (
                            <Col xs={12} md={6} xl={4}>
                                <div className="auctionItem">
                                    <Card key={auction.id}>
                                        <Card.Img variant="top" src={auction.imgUrl} style={{ objectFit: 'cover', maxHeight: '350px' }} />
                                        <Card.Body>
                                            <Card.Title className="text-left"><span className='display-6'>{auction.name}</span></Card.Title>
                                            <ListGroup variant="flush">
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : {moment().format("YYYY-MM-DD hh:mm:ss")} </ListGroup.Item> */}
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : { new Date().toString() } </ListGroup.Item> */}
                                                <ListGroup.Item key='1' className='mb-2 text-muted'>{!auction.active?<>Starts at</>:<>Started at</>}:&emsp;&emsp;&emsp;: &emsp;{auction.started.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                <ListGroup.Item key='1' className='mb-2 text-muted'>{Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')))> 0 ? <>Ends on</>:<>Ended on</>}&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                {Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')))> 0 ?
                                                <>
                                                    <ListGroup.Item key='2' className='mb-2 text-muted'>Time remaining&nbsp;&nbsp;: &emsp;
                                                        {diff = Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                                        {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                                        {Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes
                                                    </ListGroup.Item>
                                                </>:null}
                                            </ListGroup>
                                        
                                            <Card.Footer>
                                                <Row>
                                                    <Col className="footer-mini-container"> CURRENT BID: &ensp; </Col>
                                                    <Col> {auction.currently} € </Col>
                                                </Row>

                                                {(!auction.active)?
                                                    <Row >
                                                        <Button variant="primary" className='select-button' onClick={() => handleSelect(auction.id)}>EDIT   </Button>
                                                    </Row>
                                                    :
                                                    <Row >
                                                        <Button variant="secondary" className='select-button' onClick={() => handleSelect(auction.id)}>VIEW   </Button>
                                                    </Row>
                                                }
                                            </Card.Footer>

                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        ))}
                        
            </Row >
        </>
        : <AuctionManagePage data_tranfer={this.state.auction_id} />}
        </>
        : <Redirect exact to="/login"></Redirect>
        )
    }
}
