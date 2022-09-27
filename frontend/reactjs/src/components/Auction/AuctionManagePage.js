import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, json, Router } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./AuctionManagePage.css"
import ManageAuctions from './ManageAuctions';
import { findAllByTestId } from '@testing-library/react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import AuthService from "../../services/auth.service";

export function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionManagePage extends Component {
    constructor(props, context) {
        super(props);
        console.log(this.props.data_tranfer);
        this.state = {
            auction: {},
            seller: {},
            user: {},
            categories: [],
            images: [],
            toManage : false,
            showPopup : false,
            redirect: null,
            userReady: false,
            currentUser: { username: "" },

            numberOfBids : 0
            
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions/"+String(this.props.data_tranfer))
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                this.setState({ auction: data
                                ,seller :data.seller
                                ,user :data.seller.user
                                ,categories : data.categories
                                ,images : data.imgUrl.split(",")
                                ,numberOfBids :data.numberOfBids });
            });

        const currentUser = AuthService.getCurrentUser();
        if (currentUser)this.setState({ currentUser: currentUser, userReady: true });

    }
    
    render() {

        const handleBack = () => {
            console.log("BACK CLICKED");
            // console.log(this.state.auction.seller);
            this.setState({toManage:true});
        };

        const handleClose = () => {
            console.log("SHOW CLICKED");
            this.setState({showPopup:false});
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        var firstbid_placeholder = "> "+String(this.state.auction.firstBid)
    
        

        

        return (!this.state.toManage) ? 
            <>
            <div className='title'>
                <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>Manage Auctions</u></span>
                            <span className='lead'>VIEW or EDIT AUCTION </span>
                        </div>
                </div>
            </div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
            integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
            crossorigin=""/>
             <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
            integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
            crossorigin=""></script>

            <Button variant="primary" className='back-button shadow' onClick={() => handleBack(this.state.auction.id)}> &emsp;BACK TO YOUR AUCTIONS&emsp; </Button>
            
            <Row className='carousel-info-container' xs={1} md={2} xl={2}>
                <Col>
                    <Carousel variant="dark">
                    {this.state.images.map((url) => (
                        <Carousel.Item key="{url}">
                            <img
                            className="d-block w-100"
                            src={url!=null?url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"}
                            style={{ objectFit: 'cover' }}
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            {/* <h3>First slide label</h3> */}
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                    </Carousel>
                </Col>
                <Col>
                    <Row className='display-6'>{this.state.auction.name}</Row>
                   
                    

                    <br></br>

                    <Row>
                        <div className='text-start'>Categories: {this.state.categories.map((category) => ( 
                            
                            <div className='category' category='{category.name}' >{category.name} </div>
                            
                        ))}</div>
                    </Row>

                    <Row><p className="desc"><u>DESCRIPTION</u></p></Row>

                    <Row><p className='lead'>{this.state.auction.description}</p></Row>

                    <div className='map'>
                        <MapContainer center={[37.983810, 23.727539]} zoom={5} className='map' >
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </div>
                    
                    
                </Col>
            </Row>
            <Row>
                <Row className="justify-content-md-center">---</Row>
            </Row>
            <Row>
                <div className='info'>
                    <div class="form-group row">
                        <label for="staticLocation" class="col-sm-2 col-form-label">Location</label>
                        <div class="col-sm-10">
                        <input type="text" readonly class="form-control-plaintext lead" id="staticLocation" value={String(this.state.auction.location)}/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="staticEnds" class="col-sm-2 col-form-label">Ends on</label>
                        <div class="col-sm-10">
                        <input type="text" readonly class="form-control-plaintext lead" id="staticEnds" value={String(this.state.auction.ends).replace('T', ' ')}/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="staticTime%" class="col-sm-2 col-form-label">Time remaining</label>
                        <div class="col-sm-10">   
                            <Row className='display-9 lead'>&nbsp;&nbsp;
                                { diff = Math.floor( Math.abs( new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) ) / 1000 / 60 / 60 / 24 )} days&ensp;
                                { diff2 = Math.floor( Math.abs( diff2 = new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/') ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 / 60 )} hours&ensp;
                                { Math.floor( Math.abs( new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g,'/')) + (diff2* 1000 * 60 * 60 ) + (diff * 1000 * 60 * 60 * 24) ) / 1000 / 60 )} minutes
                            </Row>
                        </div>
                    </div>
                </div>
            </Row>

            <div className='bidding'>
                    <div class="form-group row">
                        <label for="staticBids" class="col-sm-2 col-form-label">Total bids</label>
                        <div class="col-10">
                        <input type="text" readonly class="form-control-plaintext lead" id="staticBids" value={this.state.numberOfBids}/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="staticStarted" class="col-sm-2 col-form-label">Auction started at</label>
                        <div class="col-10">
                        <input type="text" readonly class="form-control-plaintext lead" id="staticStarted" value={String(this.state.auction.firstBid) + " €"}/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="staticStarted" class="col-sm-2 col-form-label">Current bid</label>
                        <div class="col-10">
                        <input type="text" readonly class="form-control-plaintext lead" id="staticStarted" value={String(this.state.auction.currently) + " €"}/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="staticStarted" class="col-sm-2 col-form-label">Amount to buy out</label>
                        <div class="col-10">
                        <input type="text" readonly class="form-control-plaintext lead" id="staticStarted" value={String(this.state.auction.buyPrice) + " €"}/>
                        </div>
                    </div>
                    
            </div>

            <br></br><br></br>
                
        
        </>
        : 
        <>
            <ManageAuctions/>
        </>
    }
}
