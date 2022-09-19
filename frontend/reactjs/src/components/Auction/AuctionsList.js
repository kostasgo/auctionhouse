import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./AuctionsList.css"
import AuctionPage from './AuctionPage';

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
            toAuction : false
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions")
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });
    }
    
    render() {
        const handleSearch = () => {
            console.log("SEARCH CLICKED");
            <Route path="/" element={ <Navigate to="/" /> } />
        };

        const handleSelect = () => {
            console.log("SELECT CLICKED");
            this.setState({toAuction:true});
        };

        const handleUserClick = () => {
            console.log("USER CLICKED");
            <Route path="/" element={ <Navigate to="/" /> } />
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;

        return (
            !this.state.toAuction) ? <>
            <Container className='search-container'>
                <Row className='search-input' >
                    <input
                        className="auctions-search"
                        type={"text"}
                        placeholder="ex. Decorations, Clothes etc."
                    ></input>
                    <Button className='search-button' variant="primary" onClick={handleSearch}>SEARCH</Button>
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
                                    <Card key={auction.id}>
                                        <Card.Img variant="top" src={auction.imgUrl} style={{ objectFit: 'cover', maxHeight: '350px' }} />
                                        <Card.Body>
                                            <Card.Title className="text-left">{auction.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Auctioned By: <Button variant="secondary" className='userName' onClick={handleUserClick} >{auction.seller.user.username}</Button> ({auction.seller.rating}/5)</Card.Subtitle>
                                            <Card.Text className="text-left">
                                                {auction.description}
                                            </Card.Text>

                                            <ListGroup variant="flush">
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : {moment().format("YYYY-MM-DD hh:mm:ss")} </ListGroup.Item> */}
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : { new Date().toString() } </ListGroup.Item> */}
                                                <ListGroup.Item key='1' className='mb-2 text-muted'>Ends on&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                <ListGroup.Item key='2' className='mb-2 text-muted'>Time remaining&nbsp;&nbsp;: &emsp;
                                                { diff = Math.floor( Math.abs( new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) ) / 1000 / 60 / 60 / 24 )} days&ensp;
                                                { diff2 = Math.floor( Math.abs( diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 / 60 )} hours&ensp;
                                                { Math.floor( Math.abs( new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g,'/')) + (diff2* 1000 * 60 * 60 ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 )} minutes
                                                    
                                                    
                                                </ListGroup.Item>
                                            </ListGroup>
                                            {/* Math.abs( new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) ) */}
                                            <Card.Footer> 
                                                <Row>
                                                    <Col className="footer-mini-container"> CURRENT BID: &ensp; </Col>
                                                    <Col> {auction.currently} € </Col>
                                                </Row>
                                            
                                                <Row >
                                                    <Button variant="primary" className='select-button' onClick={handleSelect}>SEE MORE</Button>
                                                </Row>
                                            </Card.Footer>

                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        ))
                }
            </Row >
        </> : <AuctionPage />
            
        
    }
}
