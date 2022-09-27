import React, { Component } from 'react'
import { Row, Col, Table, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "../../css/AuctionManagePage.css"
import ManageAuctions from './ManageAuctions';
import { MapContainer, TileLayer } from 'react-leaflet';
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
            toManage: false,
            showPopup: false,
            redirect: null,
            userReady: false,
            currentUser: { username: "" },

            numberOfBids: 0

        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions/" + String(this.props.data_tranfer))
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                this.setState({
                    auction: data
                    , seller: data.seller
                    , user: data.seller.user
                    , categories: data.categories
                    , images: data.imgUrl.split(",")
                    , numberOfBids: data.numberOfBids
                });
            });

        const currentUser = AuthService.getCurrentUser();
        if (currentUser) this.setState({ currentUser: currentUser, userReady: true });

    }

    render() {

        const handleBack = () => {
            console.log("BACK CLICKED");
            // console.log(this.state.auction.seller);
            this.setState({ toManage: true });
        };

        const handleClose = () => {
            console.log("SHOW CLICKED");
            this.setState({ showPopup: false });
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        var firstbid_placeholder = "> " + String(this.state.auction.firstBid)





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
                    crossorigin="" />
                <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
                    integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
                    crossorigin=""></script>

                <Button variant="primary" className='back-button shadow' onClick={() => handleBack(this.state.auction.id)}> &emsp;BACK TO YOUR AUCTIONS&emsp; </Button>

                <Row className="my-4">
                    <Col xs={12} md={6} className='carousel-info-container mt-0' >
                        <Carousel variant="dark">
                            {this.state.images.map((url) => (
                                <Carousel.Item key="{url}">
                                    <img
                                        className="d-block w-100"
                                        src={url != null ? url : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"}
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
                        <div class="mt-3">
                            {this.state.auction.active && (

                                <>
                                    <h4 className="text-success mb-4">THIS AUCTION IS ACTIVE</h4>
                                    {this.state.auction.numberOfBids == 0 ? (
                                        <h5>There hasn't been placed a bid yet.</h5>

                                    ) : (
                                        <>
                                            <h5>There {this.state.auction.numberOfBids == 1 ? (<>has</>) : (<>have</>)} been placed {this.state.auction.numberOfBids} bid{this.state.auction.numberOfBids == 1 ? (<></>) : (<>s</>)}.</h5>
                                            {this.state.auction.numberOfBids == 1 ?
                                                (<h5>The bid's value is {this.state.auction.currently} €.</h5>) :
                                                (<h5>Highest bid so far is {this.state.auction.currently} €.</h5>)}

                                        </>)}</>
                            )}

                            {!this.state.auction.active && this.state.auction.completed && (

                                <>
                                    <h4 className="text-danger mb-4">THIS AUCTION IS COMPLETED</h4>
                                    {this.state.auction.numberOfBids == 0 ? (
                                        <>
                                            <h5 className="text-muted mb-2">Sadly, there were no bids in your auction.</h5>
                                            <h5 className="text-muted"> Don't be disheartened! This happens even to the most experienced Auctioneers.</h5>
                                            <h5 className="text-muted"> Try to auction again, at a different price, or for a longer period of time.</h5>
                                        </>
                                    ) : (
                                        <>
                                            <h5 className="text-muted">There {this.state.auction.numberOfBids == 1 ? (<>has</>) : (<>have</>)} been placed {this.state.auction.numberOfBids} bid{this.state.auction.numberOfBids == 1 ? (<></>) : (<>s</>)}.</h5>
                                            {this.state.auction.numberOfBids == 1 ?
                                                (<h5 className="text-muted">The bid's value is {this.state.auction.currently} €.</h5>) :
                                                (<h5 className="text-muted">Highest bid so far is {this.state.auction.currently} €.</h5>)}

                                        </>)}</>
                            )}



                            {!this.state.auction.active && !this.state.auction.completed && (
                                <h3 className="text-muted text-center mb-2"> NOT STARTED</h3>
                            )}

                        </div>



                    </Col>
                </Row>
                <hr />
                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <Table borderless>
                            <tbody>
                                <tr>
                                    <th scope="row">Starting Price</th>
                                    <td>{String(this.state.auction.firstBid) + " €"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Amount to buy out</th>
                                    <td>{String(this.state.auction.buyPrice) + " €"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total bids</th>
                                    <td>{this.state.numberOfBids}</td>
                                </tr>
                                {(this.state.auction.active || this.state.auction.completed) && (
                                    <tr>
                                        <th scope="row">Highest bid</th>
                                        <td>{String(this.state.auction.currently) + " €"}</td>
                                    </tr>
                                )}

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
                                    <td>{(new Date() > new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) ?
                                        (<>AUCTION COMPLETED</>) :
                                        (<>
                                            {diff = Math.floor(Math.abs(new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                            {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                            {Math.floor(Math.abs(new Date() - new Date(String(this.state.auction.ends).replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes</>)}

                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={12} md={6}>
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



            </>
            :
            <>
                <ManageAuctions />
            </>
    }
}
