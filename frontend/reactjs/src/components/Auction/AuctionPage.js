import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./AuctionPage.css"
import AuctionsList from './AuctionsList';

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
            auction: [],
            toBack : false
            
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions/"+String(this.props.data_tranfer))
            .then(response => response.data)
            .then((data) => {
                this.setState({ auction: data });
            });
    }
    
    render() {

        const handleBack = () => {
            console.log("BACK CLICKED");
            console.log(this.state.auction.seller.user);
            this.setState({toBack:true});
        };

        const handleUserClick = () => {
            console.log("USER CLICKED");
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;

        var username;
        

        return (!this.state.toBack) ? 
            <>
            <Button variant="primary" className='select-button' onClick={handleBack}>BACK</Button>
            <Row className='display-4'>{this.state.auction.name}</Row>
            <Row className='text-left'> Auctioned by {  }</Row>
            <Row>
                <Col>
                    <Carousel variant="dark" className="carousel-container">

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
                    <Row className="justify-content-md-center"><p><u>DESCRIPTION</u></p></Row>
                    <Row><p className='lead'>{this.state.auction.description}</p></Row>
                    
                    <div className='end-time'>
                        <Row className='lead'> Ends on&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:<br></br> &emsp;{String(this.state.auction.ends).replace('T', ' ')} </Row>
                        <Row className='lead'> Time remaining&nbsp;&nbsp;&emsp;:<br></br> &emsp;
                                                { diff = Math.floor( Math.abs( new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) ) / 1000 / 60 / 60 / 24 )} days&ensp;
                                                { diff2 = Math.floor( Math.abs( diff2 = new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 / 60 )} hours&ensp;
                                                { Math.floor( Math.abs( new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/')) + (diff2* 1000 * 60 * 60 ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 )} minutes
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Row className="justify-content-md-center">---</Row>
            </Row>
            <Row>
                {/* {this.state.loggedIn ?  */}
                <>
                        <Row className='bid'>
                            <Col>
                                <p className='bid-text'>Current bid&nbsp;&emsp;&emsp;&emsp;&emsp;:&emsp;{this.state.auction.currently} €</p>
                            </Col>
                            <Col>
                                <Row>
                                    <input placeholder='Your bidding amount' className='bid-button'></input>
                                </Row>
                                <Row>
                                    <Button className='bid-button'>BID</Button> 
                                </Row>
                                
                            </Col>
                            
                        </Row>
                        <Row className='buy-out'>
                            <Col>
                                <p className='bid-text'>Amount to buy out&emsp;:&emsp;{this.state.auction.buyPrice} €</p>
                            </Col>
                            <Col>
                                <Button className='buy-out-button'>BUY OUT</Button>
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
            <Row>
                <h1>FOOTER</h1>
            </Row>
                
        
        </>
        : 
        <>
        <AuctionsList/>
        </>
    }
}
