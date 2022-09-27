import React, { Component } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./AuctionPage.css"
import AuctionsList from './AuctionsList';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import AuthService from "../../services/auth.service";
import BidService from '../../services/bid.service';

export function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionPage extends Component {
    constructor(props, context) {
        super(props);
        //console.log(this.props.data_tranfer);
        this.state = {
            auction: {},
            seller: {},
            user: {},
            bids: [],
            categories: [],
            toBack: false,
            showPopup: false,
            redirect: null,
            userReady: false,
            Loaded: false,
            currentUser: { username: "" },
            message: "",
            bidMessage: "",
            successful: false,
            isHighestBidder: false
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        axios.get("http://localhost:8080/api/v1/auctions/" + String(this.props.data_tranfer))
            .then(response => response.data)
            .then((data) => {
                //console.log(data);
                this.setState({
                    auction: data,
                    seller: data.seller,
                    user: data.seller.user,
                    bids: data.bids,
                    categories: data.categories,
                    lat_map: data.latitude,
                    lng_map: data.longitude,
                    Loaded: true,


                });

            });
        //console.log(this.state.bids);
    }

    render() {
        const isHighestBidder = () => {
            var highestBidder = "";
            for (const bid of this.state.bids) {
                console.log(bid.amount);
                if (this.state.auction.currently == bid.amount) {
                    highestBidder = bid.bidder.user.username;
                    console.log(highestBidder);
                    break;
                }

            }

            console.log("highest: " + highestBidder + " current: " + this.state.currentUser.username);
            if (highestBidder == this.state.currentUser.username) {
                return true;
            }
            else {
                return false;
            }

        };


        const handleBack = () => {
            console.log("BACK CLICKED");
            // console.log(this.state.auction.seller);
            this.setState({ toBack: true });
        };



        const handleBuyOut = () => {
            //console.log("BUY-OUT CLICKED");
        };


        const handleBid = () => {
            this.setState({ bidMessage: "" });
            var amount = parseFloat(document.getElementById("bid_amount").value);
            if (isNaN(amount)) {
                this.setState({ bidMessage: "Please put amount, in the form of a number with 2 decimals." });
                return;
            }
            var decimalSize = 0;
            if (!Number.isInteger(amount)) {
                decimalSize = amount.toString().split('.')[1].length;
            }

            if (decimalSize > 2) {
                this.setState({ bidMessage: "Make sure you used up to 2 decimals for the bidding price." });
                return;
            }

            if (amount <= this.state.auction.currently) {
                var current = this.state.auction.currently;
                this.setState({ bidMessage: "Bid must be higher than " + current + " €." });
                return;
            }

            this.setState({ showPopup: true });
        };

        const handleBidConfirm = () => {
            var amount = parseFloat(document.getElementById("bid_amount").value);
            console.log(this.state.currentUser.username);
            console.log(this.state.auction.id);
            console.log(amount);

            this.setState({
                successful: false,
                message: ""
            })
            BidService.newBid(
                this.state.auction.id,
                this.state.currentUser.username,
                amount)
                .then(
                    response => {
                        let bid = response.data;
                        let bids = this.state.auction.bids.push(bid);
                        this.setState({
                            message: "Bid submitted succesfully!",
                            successful: true,
                            auction: {
                                ...this.state.auction,
                                currently: amount,
                                bids: bids
                            }
                        });
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();

                        this.setState({
                            successful: false,
                            message: resMessage
                        });
                    }
                );
            this.setState({ showPopup: false });
        };

        const handleClose = () => {
            //console.log("CLOSE CLICKED");
            this.setState({ showPopup: false });
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        var firstbid_placeholder = "> " + String(this.state.auction.firstBid)

        var lat = this.state.auction.latitude;
        var lng = this.state.auction.longitude;

        // console.log(lat, lng);




        return (!this.state.toBack) ?
            (!this.state.Loaded) ? <></> :

                <>
                    {
                        this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )
                    }
                    <div className='title'>
                        <div className="container d-flex h-100">
                            <div className="row justify-content-center align-self-center">
                                <span className='display-3'> <u>Browse Auctions</u></span>
                                <span className='lead'>AUCTION DETAILS</span>
                            </div>
                        </div>
                    </div>

                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
                        integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
                        crossorigin="" />
                    <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
                        integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
                        crossorigin=""></script>

                    <Button variant="primary" className='back-button shadow' onClick={() => handleBack(this.state.auction.id)}> &emsp;BACK TO BROWSING&emsp; </Button>

                    <Row className='carousel-info-container' xs={1} md={2} xl={2}>
                        <Col>
                            <Carousel variant="dark" className='carousel'>
                                {this.state.auction.imgUrl.split(",").map((url) => (
                                    <Carousel.Item>
                                        <img
                                            className="d-block w-100"
                                            src={url}
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

                            <Row>
                                <Col className='text-start'> Auctioned by
                                    <Button variant='secondary' className='user-button'>{this.state.user.username}</Button>
                                    <div className='rating-text'>
                                        <span className='lead' > Seller Rating : {this.state.seller.rating} / 5 <span className='votecount'> ( {this.state.seller.rating_count} votes ) </span>
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            <br></br>

                            <Row>
                                <div className='text-start'>Categories: {this.state.categories.map((category) => (

                                    <div className={`category ${category.name}`}>&nbsp;{category.name}&nbsp;</div>

                                ))}</div>
                            </Row>

                            <Row><p className="desc"><u>DESCRIPTION</u></p></Row>

                            <Row><p className='lead'>{this.state.auction.description}</p></Row>

                            {lat == undefined ? <></> :
                                <div className='map'>
                                    <MapContainer center={[lat, lng]} zoom={7} className='map' >
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

                    <Row>
                    <div className='bidding'>
                            <div class="form-group row">
                                <label for="staticBids" class="col-sm-2 col-form-label">Total bids</label>
                                <div class="col-10">
                                <input type="text" readonly class="form-control-plaintext lead" id="staticBids" value={this.state.auction.numberOfBids}/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticStarted" class="col-sm-2 col-form-label">Auction started at</label>
                                <div class="col-10">
                                <input type="text" readonly class="form-control-plaintext lead" id="staticStarted" value={String(this.state.auction.firstBid) + " €"}/>
                                </div>
                            </div>
                            <Row>
                                <Row className="justify-content-md-center m-t-6">---</Row>
                            </Row>
                            <Row className='bid' xs={1} md={2} xl={2}>
                                <Col className='text-start' >
                                    <div class="form-group row">
                                        <label for="staticBid" class="col-sm-2 col-form-label">Current bid</label>
                                        <div class="col-10">
                                        <input type="text" readonly class="form-control-plaintext lead" id="staticBid" value={String(this.state.auction.currently) + " €"}/>
                                        </div>
                                    </div>
                                    {(this.state.auction.bids.length == 0) &&
                                                    <p className='text-danger'>There are no bids at the moment</p>}
                                                {isHighestBidder() && this.state.auction.bids.length != 0 &&
                                                    <p className='text-success'>You are the highest bidder</p>}
                                                {!isHighestBidder() && this.state.auction.bids.length != 0 &&
                                                    <p className='text-danger'>You are not the highest bidder</p>}
                                </Col>
                                <Col className="justify-content-md-center">
                                        {this.state.userReady ?
                                            <>
                                                <Row >
                                                    <input id="bid_amount" placeholder={firstbid_placeholder} className='bid-button'></input>
                                                </Row>
                                                <Row>

                                                    <Button className='bid-button' onClick={() => handleBid()}>BID</Button>



                                                    <Modal show={this.state.showPopup} onHide={() => handleClose()}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>ARE YOU SURE - POPUP</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>Are you sure? You are bound to be banned for irresponsible bids</Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={() => handleClose()}>
                                                                Back
                                                            </Button>
                                                            <Button variant="primary" onClick={() => handleBidConfirm()}>
                                                                I understand, bid
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>

                                                </Row>
                                                {
                                                    this.state.bidMessage && (
                                                        <Row>
                                                            <div className="form-group bid-button">
                                                                <div
                                                                    className={
                                                                        this.state.successful
                                                                            ? "alert alert-success"
                                                                            : "alert alert-danger"
                                                                    }
                                                                    role="alert"
                                                                >
                                                                    {this.state.bidMessage}
                                                                </div>
                                                            </div>
                                                        </Row>
                                                    )
                                                }
                                            </>
                                            : <></>
                                        }

                                    </Col>
                            </Row>
                            <Row className='bid' xs={1} md={2} xl={2}>
                                <Col className='text-start' >
                                    <div class="form-group row">
                                        <label for="staticBuy" class="col-sm-2 col-form-label">Amount to buy out</label>
                                        <div class="col-10">
                                        <input type="text" readonly class="form-control-plaintext lead" id="staticBuy" value={String(this.state.auction.buyPrice) + " €"}/>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                        {this.state.userReady ?
                                            <Button className='buy-out-button' onClick={() => handleBuyOut(this.state.auction.id)}>BUY OUT</Button>
                                            : <></>
                                        }

                                    </Col>
                            </Row>
                            
                    </div>
                    {!this.state.userReady ?
                        <div className='loginregister'>
                            <Link to="/login">
                                <Button className='login-button'>LOG IN TO PLACE A BID</Button>
                            </Link>
                            <span> OR </span>

                            <Link to="/register">
                                <Button className='register-button'>REGISTER</Button>
                            </Link>
                        </div>
                        : <></>
                    }
                    <br></br><br></br>

                    </Row>


                </>
            :
            <>
                <AuctionsList />
            </>
    }
}
