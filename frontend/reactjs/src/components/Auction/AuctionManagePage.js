import React, { Component } from 'react'
import { Row, Col, Table, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "../../css/AuctionManagePage.css"
import ManageAuctions from './ManageAuctions';
import { MapContainer, TileLayer } from 'react-leaflet';
import AuthService from "../../services/auth.service";
import AuctionService from '../../services/auction.service';
import Modal from 'react-bootstrap/Modal';

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
            showEnablePopup: false,
            showDeletePopup: false,
            redirect: null,
            userReady: false,
            currentUser: { username: "" },
            message: "",
            successful: false,
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

        const handleActivate = () => {
            this.setState({
                message: "",
                successful: false
            });
            AuctionService.enableAuction(this.state.auction.id)
                .then(
                    response => {
                        this.setState({
                            auction: response.data,
                            seller: response.data.seller,
                            user: response.data.seller.user,
                            categories: response.data.categories,
                            images: response.data.imgUrl.split(","),
                            numberOfBids: response.data.numberOfBids,
                            message: "Auction successfully activated!",
                            successful: true
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
        };

        const handleDelete = () => {
            this.setState({
                message: "",
                successful: false
            });
            AuctionService.deleteAuction(this.state.auction.id)
                .then(
                    response => {
                        this.setState({
                            toManage: true,
                            message: response.data.message,
                            successful: true
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
        };

        const handleEnablePopup = () => {
            this.setState({
                showEnablePopup: true
            });
        };

        const handleDeletePopup = () => {
            this.setState({
                showDeletePopup: true
            });
        };

        const handleClose = () => {
            this.setState({
                showEnablePopup: false,
                showDeletePopup: false
            });
        };
        var diff;
        var diff2;


        return (!this.state.toManage) ?
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
                            <span className='display-3'> <u>Manage Auctions</u></span>
                            <span className='lead'>VIEW or EDIT AUCTION </span>
                        </div>
                    </div>
                </div>

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
                                        <p className="lead">There hasn't been placed a bid yet.</p>

                                    ) : (
                                        <>
                                            <p className="lead">There {this.state.auction.numberOfBids == 1 ? (<>has</>) : (<>have</>)} been placed {this.state.auction.numberOfBids} bid{this.state.auction.numberOfBids == 1 ? (<></>) : (<>s</>)}.</p>
                                            {this.state.auction.numberOfBids == 1 ?
                                                (<p className="lead">The bid's value is {this.state.auction.currently} €.</p>) :
                                                (<p className="lead">Highest bid so far is {this.state.auction.currently} €.</p>)}

                                        </>)}</>
                            )}

                            {!this.state.auction.active && this.state.auction.completed && (

                                <>
                                    <h4 className="text-danger mb-4">THIS AUCTION IS COMPLETED</h4>
                                    {this.state.auction.numberOfBids == 0 ? (
                                        <>
                                            <p className="lead mb-2">Sadly, there were no bids in your auction.</p>
                                            <p className="lead"> Don't be disheartened! This happens even to the most experienced Auctioneers.</p>
                                            <p className="lead"> Try to auction again, at a different price, or for a longer period of time.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="lead">There {this.state.auction.numberOfBids == 1 ? (<>has</>) : (<>have</>)} been placed {this.state.auction.numberOfBids} bid{this.state.auction.numberOfBids == 1 ? (<></>) : (<>s</>)}.</p>
                                            {this.state.auction.numberOfBids == 1 ?
                                                (<p className="lead">The bid's value is {this.state.auction.currently} €.</p>) :
                                                (<p className="lead">Highest bid so far is {this.state.auction.currently} €.</p>)}

                                        </>)}</>
                            )}

                            {!this.state.auction.active && !this.state.auction.completed && (

                                <>
                                    <h4 className="text-muted mb-4">THIS AUCTION HAS NOT STARTED YET</h4>
                                    <Row>
                                        <Col xs={9}>
                                            <p className="lead">Before you activate the auction, make sure that everything is as you want it. After the activation you will not be able to edit or delete the auction anymore.</p>
                                        </Col>
                                        <Col xs={3} className="d-grid">
                                            <Button variant="primary" className="my-2 p-0"> EDIT</Button>
                                            <Button variant="danger" className="my-2 p-0" onClick={() => handleDeletePopup()}> DELETE</Button>
                                            <Modal show={this.state.showDeletePopup} onHide={() => handleClose()}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>ARE YOU SURE - POPUP</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Are you sure? You are about to delete this auction. </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => handleClose()}>
                                                        Back
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDelete()}>
                                                        Delete
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col xs={9}>
                                            <p className="lead"> You should activate your auction, to make it visible to other users.</p>
                                        </Col>
                                        <Col xs={3} className="d-grid">
                                            <Button variant="primary" className="my-2 p-0" onClick={() => handleEnablePopup()}> ACTIVATE </Button>
                                            <Modal show={this.state.showEnablePopup} onHide={() => handleClose()}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>ARE YOU SURE - POPUP</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Are you sure? After activating this auction you won't be able to edit or delete it.</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => handleClose()}>
                                                        Back
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handleActivate()}>
                                                        I understand, activate
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                        </Col>
                                    </Row>
                                </>
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
                <ManageAuctions message={this.state.message} />
            </>
    }
}
