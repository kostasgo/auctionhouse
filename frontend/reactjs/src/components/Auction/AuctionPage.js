import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, json } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./AuctionPage.css"
import AuctionsList from './AuctionsList';
import { findAllByTestId } from '@testing-library/react';
import { MapContainer, TileLayer } from 'react-leaflet'

function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionPage extends Component {
    constructor(props, context) {
        super(props);
        console.log(this.props.data_tranfer);
        this.state = {
            auction: {},
            seller: {},
            user: {},
            categories: [],
            toBack : false
            
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions/"+String(this.props.data_tranfer))
            .then(response => response.data)
            .then((data) => {
                this.setState({ auction: data
                                ,seller :data.seller
                                ,user :data.seller.user
                                ,categories : data.categories });
            });

    }
    
    render() {

        const handleBack = () => {
            console.log("BACK CLICKED");
            // console.log(this.state.auction.seller);
            this.setState({toBack:true});
        };

        const handleUserClick = () => {
            console.log("USER CLICKED");
        };

        const handleBid = () => {
            console.log("BID CLICKED");
        };

        const handleBuyOut = () => {
            console.log("BUY-OUT CLICKED");
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        var firstbid_placeholder = "> "+String(this.state.auction.firstBid)
    
        

        

        return (!this.state.toBack) ? 
            <>
            <Button variant="primary" className='back-button' onClick={handleBack}> &emsp;BACK TO BROWSING&emsp; </Button>
            
            <Row className='carousel-container' xs={1} md={2} xl={2}>
                <Col>
                    <Carousel variant="dark">

                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={this.state.auction.imgUrl}
                            style={{ objectFit: 'cover' }}
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            {/* <h3>First slide label</h3> */}
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
                <Col>
                    <Col>
                        <Row className='display-6'>{this.state.auction.name}</Row>
                    </Col>
                    
                    <Row>
                        <Col className='text-start'> Auctioned by
                            <Button variant='secondary' className='user-button'>{ this.state.user.username }</Button> 
                            <div className='rating-text'>
                                <span className='lead' > Seller Rating : {this.state.seller.rating} / 5 <span className='votecount'> ( {this.state.seller.rating_count} votes ) </span>
                                </span>
                            </div>
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <div className='text-start'>Categories: {this.state.categories.map((category) => ( 
                            
                            <div className='category' category='{category.name}' >{category.name} </div>
                            
                        ))}</div>
                    </Row>
                    <Row><p className="desc"><u>DESCRIPTION</u></p></Row>
                    <Row><p className='lead'>{this.state.auction.description}</p></Row>
                    <Row>
                        <MapContainer center={[1.7160, 39.1404]} zoom={13} >
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </Row>
                    
                </Col>
            </Row>
            <Row>
                <Row className="justify-content-md-center">---</Row>
            </Row>
            <Row>
                <div className='end-time'>
                    <Row className='display-9'> Location&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;:&emsp;{String(this.state.auction.location)}, {String(this.state.auction.country)} </Row>
                    <Row className='display-9'> Ends on&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&emsp;{String(this.state.auction.ends).replace('T', ' ')} </Row>
                    <Row className='display-9'> Time remaining&nbsp;&nbsp;&emsp;:&emsp;
                                            { diff = Math.floor( Math.abs( new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) ) / 1000 / 60 / 60 / 24 )} days&ensp;
                                            { diff2 = Math.floor( Math.abs( diff2 = new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 / 60 )} hours&ensp;
                                            { Math.floor( Math.abs( new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/')) + (diff2* 1000 * 60 * 60 ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 )} minutes
                    </Row>
                </div>
            </Row>

            <div className='bidding-section'>
                <Row className='text-start'>
                    <span className='display-9'>Total bids&emsp;&emsp;&emsp;&emsp;:&emsp;{this.state.auction.numberOfBids} </span>
                </Row>
                <Row className='display-9'>
                    <span className='display-9'>Auction started at :&emsp;{this.state.auction.firstBid} €</span>
                </Row>
            </div>

            <Row>
                {/* {this.state.loggedIn ?  */}
                <>
                        <Row className='bid' xs={1} md={2} xl={2}>
                            <Col className='text-start' >
                                <p className='bid-text'>Current bid&emsp;&emsp;&emsp; :&emsp;{this.state.auction.currently} €</p>
                            </Col>
                            <Col>
                                <Row>
                                    <input id="input" placeholder={firstbid_placeholder} className='bid-button'></input>
                                </Row>
                                <Row>
                                    <Button className='bid-button' onClick={() => handleBid(this.state.auction.id)}>BID</Button> 
                                </Row>
                                
                            </Col>
                            
                        </Row>
                        <Row className='buy-out' xs={1} md={2} xl={2}>
                            <Col className='text-start'>
                                <p className='bid-text'>Amount to buy out&emsp;:&emsp;{this.state.auction.buyPrice} €</p>
                            </Col>
                            <Col>
                                <Button className='buy-out-button' onClick={() => handleBuyOut(this.state.auction.id)}>BUY OUT</Button>
                            </Col>
                            
                        </Row>
                    </>
    
                    {/*:
                    <>
                    <Row className='bid'>
                        <p className='bid-text'>Current bid&nbsp;&emsp;&emsp;&emsp;&emsp;:&emsp;{this.state.auction.currently} €</p>
                    </Row
                    <Row className='buy-out'>
                        <p className='bid-text'>Amount to buy out&emsp;:&emsp;{this.state.auction.buyPrice} €</p>
                    <Row>
                    <Button variant="primary" className='select-button' onClick={handleBack}>BACK TO EXPLORING</Button>
                    </Row>
                    <Row>
                    <p className="justify-content-md-center">OR</p>
                    </Row>
                    <Row>
                    <Button variant="primary" className='select-button' onClick={handleBack}>SIGN UP TO BID</Button>
                    </Row>
                    </>}*/}
            </Row>
            <br></br><br></br>
                
        
        </>
        : 
        <>
        <AuctionsList/>
        </>
    }
}
