import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap'
import "../../css/ManageAuctions.css"
import AuctionManagePage from './AuctionManagePage';
import AuthService from "../../services/auth.service";
import NewAuction from './NewAuction';
import auctionService from '../../services/auction.service';

function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


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
            currentUser: { username: "" }
        };
        this.handleToNewAuction = this.handleToNewAuction.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser != null) {
            this.setState({ currentUser: currentUser, userReady: true });
            console.log(currentUser.id);
            auctionService.getAllUserAuctions(currentUser.id)
                .then(response => response.data)
                .then((data) => {
                    this.setState({ auctions: data });
                    // console.log(data);
                });
        }
        else {
            this.setState({ currentUser: "redirect" });
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

    render() {


        const handleSearch = () => {
            console.log("SEARCH CLICKED");
            //  <Route path="/" element={<Navigate to="/" />} />
        };


        const handleUserClick = (id) => {
            console.log("USER CLICKED");
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;



        return (this.state.currentUser != "redirect" ?
            <>
                {!this.state.toAuctionManage ?
                    <>
                        {!this.state.toNewAuction ?
                            <>
                                <div className='title'>
                                    <div className="container d-flex h-100">
                                        <div className="row justify-content-center align-self-center">
                                            <span className='display-3'> <u>Manage Auctions</u></span>
                                            <span className='lead'>YOUR AUCTIONS</span>
                                        </div>
                                    </div>
                                </div>
                                <Row>
                                    <Col xs={12} md={6} xl={4}>
                                        <div onClick={this.handleToNewAuction} className="options">
                                            <Card key="new" background='green' style={{ objectFit: 'cover', maxHeight: '100px' }}>
                                                <Card.Img variant="top" src="https://content.fortune.com/wp-content/uploads/2019/04/brb05.19.plus_.jpg" style={{ objectFit: 'cover', maxHeight: '350px' }} />
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
                                                        <Card.Img variant="top" src={(auction.imgUrl.length != 0) ? auction.imgUrl.split(",")[0] : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} style={{ objectFit: 'cover', height: '350px' }} />
                                                        <Card.Body>
                                                            <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                                            {/* <ListGroup variant="flush"> */}

                                                            {/* <ListGroup.Item key="10000" className='mb-2 text-muted'>{!auction.active?<>Starts at</>:<>Started at</>}:&emsp;&emsp;&emsp;: &emsp;{auction.starts.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                <ListGroup.Item key='20000' className='mb-2 text-muted'>{Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')))> 0 ? <>Ends on</>:<>Ended on</>}&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                {Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')))> 0 ?
                                                <>
                                                    <ListGroup.Item key='3' className='mb-2 text-muted'>Time remaining&nbsp;&nbsp;: &emsp;
                                                        {diff = Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                                        {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                                        {Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes
                                                    </ListGroup.Item>
                                                </>:null} */}
                                                            {/* </ListGroup> */}
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
                                                                        {!auction.active && !auction.completed && (<>STARTING PRICE</>)}: &ensp; </Col>
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
