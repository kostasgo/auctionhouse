import React, { Component } from 'react'
import { Table, Row, Col, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "../../css/AuctionPage.css"
import AuctionsList from './AuctionsList';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import AuthService from "../../services/auth.service";
import BidService from '../../services/bid.service';
import AuctionService from '../../services/auction.service';
import Recommended from "../Recommended";

export function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionPage extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            auction: {},
            seller: {},
            user: {},
            bids: [],
            categories: [],
            toBack: false,
            showBidPopUp: false,
            showBuyOutPopUp: false,
            redirect: null,
            userReady: false,
            Loaded: false,
            currentUser: { username: "" },
            message: "",
            bidMessage: "",
            successful: false,
            isHighestBidder: false,
            numberOfBids: 0
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });
        axios.get("http://localhost:8080/api/v1/auctions/" + String(id))
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    auction: data,
                    seller: data.seller,
                    user: data.seller.user,
                    bids: data.bids,
                    numberOfBids: data.numberOfBids,
                    categories: data.categories,
                    lat_map: data.latitude,
                    lng_map: data.longitude,
                    Loaded: true,


                });

            });
    }

    render() {
        const isHighestBidder = () => {
            var highestBidder = "";
            for (const bid of this.state.bids) {
                if (this.state.auction.currently == bid.amount) {
                    highestBidder = bid.bidder.user.username;
                    break;
                }

            }


            if (highestBidder == this.state.currentUser.username) {
                return true;
            }
            else {
                return false;
            }

        };


        const handleBack = () => {
            this.setState({ toBack: true });
        };



        const handleBuyOut = () => {
            this.setState({ showBuyOutPopUp: true });
        };

        const handleBuyOutConfirm = () => {

            this.setState({
                successful: false,
                message: ""
            })
            AuctionService.buyOutAuction(
                this.state.auction.id,
                this.state.currentUser.username)
                .then(
                    () => {
                        this.setState({
                            message: "Auction was just bought out!",
                            successful: true,
                            toBack: true
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

            this.setState({ showBuyOutPopUp: false });
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

            this.setState({ showBidPopUp: true });
        };

        const handleBidConfirm = () => {
            var amount = parseFloat(document.getElementById("bid_amount").value);

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
                        let numberOfBids = this.state.numberOfBids + 1;
                        this.setState({
                            message: "Bid submitted succesfully!",
                            successful: true,
                            auction: {
                                ...this.state.auction,
                                currently: amount,
                                bids: bids
                            },
                            numberOfBids: numberOfBids
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
            this.setState({ showBidPopUp: false });
        };

        const handleClose = () => {
            this.setState({
                showBidPopUp: false,
                showBuyOutPopUp: false
            });
        };

        var diff;
        var diff2;
        var firstbid_placeholder = "> " + String(this.state.auction.currently)

        var lat = this.state.auction.latitude;
        var lng = this.state.auction.longitude;


        return (
            (!this.state.Loaded) ? <></> :

                <>
                    <Row className="my-3">
                        <Col md={3}>
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
                        </Col>
                    </Row>

                    <div className='title'>
                        <div className="container d-flex h-100">
                            <div className="row justify-content-center align-self-center">
                                <span className='display-3'> <u>Browse Auctions</u></span>
                                <span className='lead'>AUCTION DETAILS</span>
                            </div>
                        </div>
                    </div>

                    <a variant="primary" className='back-button shadow btn btn-primary' href="/auctions"> &emsp;BACK TO BROWSING&emsp; </a>

                    <Row className="my-4">
                        <Col className='carousel-info-container mt-0' xs={12} md={6} key={this.state.auction.imgUrl} >
                            <Carousel variant="dark" className='carousel'>
                                {this.state.auction.imgUrl.split(",").map((url) => (
                                    <Carousel.Item key={this.state.auction.name}>
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
                        <Col xs={12} md={6}>
                            <div className='display-6 mb-3'>{this.state.auction.name}</div>


                            <div className='align-items-center d-flex'> Auctioned by :
                                <Button variant='secondary' className='user-button'>{this.state.user.username}</Button>
                                <div className='rating-text'>
                                    <span className='lead' > Seller Rating : {this.state.seller.rating} / 5 <span className='votecount'> ( {this.state.seller.rating_count} votes ) </span>
                                    </span>
                                </div>
                            </div>

                            <p className="desc"><u>DESCRIPTION</u></p>

                            <p className='lead'>{this.state.auction.description}</p>
                            <hr />
                            <Row className='bid'>


                                <Col className='text-start' xs={6} >
                                    <Table borderless>
                                        <tbody>

                                            <tr>
                                                <th scope="row">Current bid</th>
                                                <td>{String(this.state.auction.currently) + " €"}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Amount to buy out</th>
                                                <td>{String(this.state.auction.buyPrice) + " €"}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Total bids</th>
                                                <td>{this.state.numberOfBids}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Auction started at</th>
                                                <td>{String(this.state.auction.firstBid) + " €"}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    {(this.state.userReady && this.state.numberOfBids == 0) &&
                                                        <p className='text-danger'>There are no bids at the moment</p>}
                                                    {isHighestBidder() && this.state.numberOfBids != 0 &&
                                                        <p className='text-success'>You are the highest bidder</p>}
                                                    {this.state.userReady && !isHighestBidder() && this.state.numberOfBids != 0 &&
                                                        <p className='text-danger'>You are not the highest bidder</p>}
                                                </th>
                                            </tr>

                                        </tbody>
                                    </Table>


                                </Col>
                                <Col className="justify-content-md-center pt-2" xs={6}>
                                    {this.state.userReady ?
                                        <>

                                            <input id="bid_amount" placeholder={firstbid_placeholder} className='bid-button'></input>

                                            <Button className='bid-button mb-2' onClick={() => handleBid()}>BID</Button>

                                            <Modal show={this.state.showBidPopUp} onHide={() => handleClose()}>
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


                                            {
                                                this.state.bidMessage && (

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

                                                )
                                            }
                                        </>
                                        : <></>
                                    }
                                    {this.state.userReady ?
                                        <>
                                            <Button className='buy-out-button' onClick={() => handleBuyOut(this.state.auction.id)}>BUY OUT</Button>

                                            <Modal show={this.state.showBuyOutPopUp} onHide={() => handleClose()}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>ARE YOU SURE - POPUP</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Are you sure? You are about to buy out this item for the whole price of {this.state.auction.buyPrice} €</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => handleClose()}>
                                                        Back
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handleBuyOutConfirm()}>
                                                        Buy
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </>
                                        : <></>
                                    }
                                    {!this.state.userReady ?
                                        <div className='d-grid'>
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

                                </Col>
                            </Row>



                        </Col>
                    </Row >
                    <hr />

                    <Row>
                        <Col className='info' xs={12} md={6}>
                            <Table borderless>
                                <tbody>
                                    <tr>
                                        <th scope="row">Categories</th>
                                        <td><div className="d-flex">{this.state.categories.map((category) => (

                                            <div className={`category ${category.name}`}>&nbsp;{category.name}&nbsp;</div>

                                        ))}</div></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Location</th>
                                        <td>{String(this.state.auction.location)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Ends on</th>
                                        <td>{String(this.state.auction.ends).replace('T', ' ')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Time remaining</th>
                                        <td>
                                            {diff = Math.floor(Math.abs(new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                            {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                            {Math.floor(Math.abs(new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                        </Col>
                        <Col xs={12} md={6}>
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
                    <hr />
                    <div id='recommended'>
                        <Recommended id={this.state.currentUser.id}></Recommended>
                    </div>



                </>
            )
    }
}
