import React, { Component } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./NewAuction.css"
import AuctionsList from './AuctionsList';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import AuthService from "../../services/auth.service";

export function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class NewAuction extends Component {
    constructor(props, context) {
        super(props);
        console.log(this.props.data_tranfer);
        this.state = {
            auction: {},
            seller: {},
            user: {},
            categories: [],
            toBack : false,
            showPopup : false,
            redirect: null,
            userReady: false,
            Loaded : false,
            currentUser: { username: "" },
        };
    }

    componentDidMount() {
        
                                
       

        const currentUser = AuthService.getCurrentUser();
        if (currentUser)this.setState({ currentUser: currentUser, userReady: true });

        this.setState({Loaded:true});

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


        const handleBuyOut = () => {
            console.log("BUY-OUT CLICKED");
        };

        const handleLogIn= () => {
            console.log("LOGIN CLICKED");
            
        };

        const handleRegister = () => {
            console.log("REGISTER CLICKED");
        };

        const handleBid = () => {
            console.log("BID CLICKED");
            this.setState({showPopup:true});
        };

        const handleClose = () => {
            console.log("CLOSE CLICKED");
            this.setState({showPopup:false});
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        var firstbid_placeholder = "> "+String(this.state.auction.firstBid)

        var lat = this.state.auction.latitude;
        var lng = this.state.auction.longitude;

        // console.log(lat, lng);
        

        

        return (!this.state.toBack) ? 
            (!this.state.Loaded)?<></>:
            <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
            integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
            crossorigin=""/>
             <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
            integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
            crossorigin=""></script>

            {/* <Button variant="primary" className='back-button' onClick={() => handleBack(this.state.auction.id)}> &emsp;BACK TO BROWSING&emsp; </Button> */}
            
            <Row className='carousel-info-container' xs={1} md={2} xl={2}>
                <Col>
                    <Carousel variant="dark">
                        {/* {this.state.auction.imgUrl.map((url) => ( */}
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={"https://hybridglobalpublishing.com/wp-content/uploads/2016/06/Photo-Goes-Here.jpg"}
                            style={{ objectFit: 'cover' }}
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            {/* <h3>First slide label</h3> */}
                            </Carousel.Caption>
                        </Carousel.Item>
                        {/* ))} */}
                    </Carousel>
                </Col>
                <Col>
                    <Row className='display-6'>(name of auction input)</Row>

                    <br></br>

                    <Row>
                        <div className='text-start'>Categories: (categories input)</div>
                    </Row>

                    <Row><p className="desc"><u>DESCRIPTION</u></p></Row>

                    <Row><p className='lead'>(description input)</p></Row>
                    
                    {lat == undefined ? <></> :
                    <div className='map'>
                        <MapContainer center={[0, 0]} zoom={7} className='map' >
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </div>
                    }
                    
                    
                </Col>
            </Row>
            <Row>
                <Row className="justify-content-md-center">---</Row>
            </Row>
            <Row>
                <div className='end-time'>
                    <Row className='display-9'> Location&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;:&emsp;(location city input)), (country input) </Row>
                    <Row className='display-9'> Starts at&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&emsp;(starts datetime input) </Row>
                    <Row className='display-9'> Ends on&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&emsp;(ends datetime input) </Row>
                    <Row className='display-9'> Starting at&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&emsp;(starting at amount input) </Row>
                </div>
            </Row>
            
            <br></br><br></br>
                
        
        </>
        : 
        <>
            <div>BACK</div>
        </>
    }
}
