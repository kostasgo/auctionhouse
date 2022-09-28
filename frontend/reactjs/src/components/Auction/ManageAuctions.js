import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap'
import "../../css/ManageAuctions.css"
import AuctionManagePage from './AuctionManagePage';
import AuthService from "../../services/auth.service";
import NewAuction from './NewAuction';
import auctionService from '../../services/auction.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleRoof } from '@fortawesome/free-solid-svg-icons';

export default class ManageAuctions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auctions: [],
            toAuctionManage: false,
            toNewAuction: false,
            auction_id: -1,
            redirect: null,
            userReady: false,
            currentUser: { username: "" },
            search_string: "",
            pageOffset: 0,
            totalResults: 0,
            message: props.message,
            successful: props.successful
        };
        this.handleToNewAuction = this.handleToNewAuction.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handlePageNext = this.handlePageNext.bind(this);
        this.handlePagePrev = this.handlePagePrev.bind(this);
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        var activeId = -1;
        if (this.state.currentUser) {
            activeId = currentUser.id;
        }
        if (currentUser != null) {
            this.setState({ currentUser: currentUser, userReady: true });
            //console.log(currentUser.id);
            auctionService.getAllUserAuctionsCount(activeId, true)
                .then(response => response.data)
                .then((data) => {
                    this.setState({ totalResults: data });
                });
            auctionService.getAllUserAuctions(activeId, this.state.pageOffset)
                .then(response => response.data)
                .then((data) => {
                    this.setState({ auctions: data });
                });
        }
        else {
            this.setState({ currentUser: "redirect" });
        }

        if (this.state.pageOffset + 1 >= Math.ceil(this.state.totalResults / 3)) {
            document.getElementById("next-page").setAttribute("class", "page-link disabled")
        }
    }

    handleSelect(id) {
        console.log("SELECT CLICKED");
        this.setState({ toAuctionManage: true });
        this.setState({ auction_id: id });
    };

    handleToNewAuction() {
        this.setState({ toNewAuction: true });
    }

    handlePageNext() {
        var activeId = -1;
        if (this.state.currentUser) {
            activeId = this.state.currentUser.id;
        }

        this.state.pageOffset++;
        document.getElementById("prev-page").setAttribute("class", "page-link");


        if (this.state.pageOffset + 1 >= Math.ceil(this.state.totalResults / 3)) {
            document.getElementById("next-page").setAttribute("class", "page-link disabled")
        }

        auctionService.getAllUserAuctions(true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;
    }

    handlePagePrev() {
        var activeId = -1;
        if (this.state.currentUser) {
            activeId = this.state.currentUser.id;
        }

        this.state.pageOffset--;
        document.getElementById("next-page").setAttribute("class", "page-link");

        if (this.state.pageOffset - 1 <= 0) {
            document.getElementById("prev-page").setAttribute("class", "page-link disabled")
        }

        auctionService.getAllUserAuctions(true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;
    }

    render() {

        return (this.state.currentUser != "redirect" ?
            <>
                {!this.state.toAuctionManage ?
                    <>
                        {!this.state.toNewAuction ?
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
                                            <span className='display-3'> <u>Manage Auctions <FontAwesomeIcon icon={faPeopleRoof} /></u></span>
                                            <span className='lead'>YOUR AUCTIONS</span>
                                        </div>
                                    </div>
                                </div>
                                <nav aria-label="Page navigation example">
                                    <ul class="pagination pagination-lg">
                                        <li class="page-item">
                                            <a class="page-link disabled" onClick={this.handlePagePrev} aria-label="Previous" id='prev-page'>
                                                <span aria-hidden="true">&laquo;</span>
                                            </a>
                                        </li>
                                        <li class="page-item"><a class="page-link active" id="active-page">1</a></li>
                                        <p className='page-link disabled'> out of {Math.ceil(this.state.totalResults / 3) == 0 ? 1 : Math.ceil(this.state.totalResults / 3)} </p>
                                        <li class="page-item">
                                            <a class="page-link" onClick={this.handlePageNext} aria-label="Next" id='next-page'>
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                                <Row>
                                    <Col xs={12} md={6} xl={4}>
                                        <div onClick={this.handleToNewAuction} className="options">
                                            <Card key="new" background='green' style={{ objectFit: 'cover', maxHeight: '100px' }}>
                                                <Card.Img variant="top" src="https://content.fortune.com/wp-content/uploads/2019/04/brb05.19.plus_.jpg" style={{ objectFit: 'cover', maxHeight: '250px' }} />
                                                <Card.Body>
                                                    <Row><Card.Title className="card-title"><span className='title-text'>NEW AUCTION</span></Card.Title></Row>
                                                    <Row><Card.Subtitle className="card-title text-muted"> Create a new auction </Card.Subtitle></Row>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </Col>
                                    {
                                        this.state.auctions.length === 0 ?
                                            <h3>No auctions made yet...</h3>
                                            :

                                            <></>}
                                    {this.state.auctions.map((auction) => (
                                        <Col xs={12} md={6} xl={4}>
                                            <div className="auctionItem">
                                                <div className="options">
                                                    <Card key={auction.id} className="card">
                                                        <Card.Img variant="top" src={(auction.imgUrl.length != 0) ? auction.imgUrl.split(",")[0] : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} style={{ objectFit: 'cover', height: '250px' }} />
                                                        <Card.Body>
                                                            <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                                            {auction.active && (
                                                                <h3 className="text-success text-center mb-2"> ACTIVE</h3>
                                                            )}
                                                            {!auction.active && auction.completed && (
                                                                <h3 className="text-danger text-center mb-2"> COMPLETED</h3>
                                                            )}
                                                            {!auction.active && !auction.completed && (
                                                                <h3 className="text-muted text-center mb-2"> NOT STARTED</h3>
                                                            )}
                                                            <Card.Footer>
                                                                <Row>

                                                                    <Col className="footer-mini-container">
                                                                        {auction.active && (<>CURRENT BID</>)}
                                                                        {!auction.active && auction.completed && (<>WINNING BID</>)}
                                                                        {!auction.active && !auction.completed && (
                                                                            <>STARTING PRICE</>)}: &ensp; </Col>
                                                                    <Col> {auction.currently} € </Col>
                                                                </Row>

                                                                {(!auction.active && !auction.completed) ?
                                                                    <Row >
                                                                        <Button variant="primary" className='select-button' onClick={() => this.handleSelect(auction.id)}>EDIT   </Button>
                                                                    </Row>
                                                                    :
                                                                    <Row >
                                                                        <Button variant="secondary" className='select-button' onClick={() => this.handleSelect(auction.id)}>VIEW   </Button>
                                                                    </Row>
                                                                }
                                                            </Card.Footer>

                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}

                                </Row >
                            </>
                            : <NewAuction />}
                    </>
                    : <AuctionManagePage data_tranfer={this.state.auction_id} />}
            </>
            : <Redirect exact to="/login"></Redirect>
        )
    }
}
