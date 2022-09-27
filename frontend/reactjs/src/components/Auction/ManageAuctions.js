import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Router, Redirect } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./ManageAuctions.css"
import AuctionManagePage from './AuctionManagePage';
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
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
            currentUser: { username: "" },

            search_string: "",
            pageOffset : 0,
            totalResults : 0
        };
        this.handleToNewAuction = this.handleToNewAuction.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handlePageNext = this.handlePageNext.bind(this);
        this.handlePagePrev = this.handlePagePrev.bind(this);
    }

    componentDidMount() {
        
        const currentUser = AuthService.getCurrentUser();
        var activeId = -1;
        if (this.state.currentUser){
            activeId = currentUser.id;
        } 

        if (currentUser!= null){
            this.setState({ currentUser: currentUser, userReady: true });
            // console.log(currentUser.id);

            auctionService.getAllUserAuctionsCount(activeId, true)
            .then(response => response.data)
            .then((data) => {
                // console.log(data);
                this.setState({ totalResults: data });
            });

            auctionService.getAllUserAuctions( activeId ,this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
                // console.log(data);
            });
        }
        else{
            this.setState({ currentUser: "redirect"});
        }

        if (this.state.pageOffset+1 >= Math.ceil(this.state.totalResults / 3)){
            document.getElementById("next-page").setAttribute("class","page-link disabled")
        }
    }

    handleSelect(id){
        console.log("SELECT CLICKED");
        this.setState({ toAuctionManage: true });
        this.setState({ auction_id: id });
    };

    handleToNewAuction(){
        this.setState({ toNewAuction: true });
    }

    handlePageNext(){
        var activeId = -1;
        if (this.state.currentUser){
            activeId = this.state.currentUser.id;
        } 

        this.state.pageOffset++;
        document.getElementById("prev-page").setAttribute("class","page-link");


        if (this.state.pageOffset+1 >= Math.ceil(this.state.totalResults / 3)){
            document.getElementById("next-page").setAttribute("class","page-link disabled")
        }

        auctionService.getAllUserAuctions(true,activeId,this.state.pageOffset)
        .then(response => response.data)
        .then((data) => {
            this.setState({ auctions: data });
        });

        document.getElementById("active-page").innerHTML=this.state.pageOffset+1;
    }

    handlePagePrev(){
        var activeId = -1;
        if (this.state.currentUser){
            activeId = this.state.currentUser.id;
        } 

        this.state.pageOffset--;
        document.getElementById("next-page").setAttribute("class","page-link");

        if (this.state.pageOffset-1 <= 0 ){
            document.getElementById("prev-page").setAttribute("class","page-link disabled")
        }
        
        auctionService.getAllUserAuctions(true,activeId,this.state.pageOffset)
        .then(response => response.data)
        .then((data) => {
            this.setState({ auctions: data });
        });

        document.getElementById("active-page").innerHTML=this.state.pageOffset+1;
    }

    render() {

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;
        
        

        return (this.state.currentUser!="redirect"?
        <>
        {!this.state.toAuctionManage ? 
            <>
            {!this.state.toNewAuction?
            <>
            <div className='title'>
                <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>Manage Auctions</u></span>
                            <span className='lead'>YOUR AUCTIONS</span>
                        </div>
                </div>
            </div>

            <nav aria-label="Page navigation example">
                <ul class="pagination pagination-lg">
                    <li class="page-item">
                        <a class="page-link disabled" onClick={this.handlePagePrev} aria-label="Previous" id='prev-page'>
                            <span aria-hidden="true">&laquo;</span>
                            {/* <span class="sr-only">Previous</span> */}
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link active" id="active-page">1</a></li>
                    <p className='page-link disabled'> out of { Math.ceil(this.state.totalResults / 3)==0?1:Math.ceil(this.state.totalResults / 3)  } </p>
                    <li class="page-item">
                        <a class="page-link" onClick={this.handlePageNext} aria-label="Next" id='next-page'>
                            <span aria-hidden="true">&raquo;</span>
                            {/* <span class="sr-only">Next</span> */}
                        </a>
                    </li>
                </ul>
            </nav>

            <Row>
                <Col xs={12} md={6} xl={4}>
                        <div onClick={this.handleToNewAuction} className="options">
                            <Card className="card shadow-lg" key="new" background='green' style={{ objectFit: 'cover', maxHeight: '100px' }}>
                                <Card.Img variant="top" src="https://content.fortune.com/wp-content/uploads/2019/04/brb05.19.plus_.jpg"  style={{ objectFit: 'cover', maxHeight: '350px' }} />
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
                                    <Card key={auction.id} className="card shadow">
                                        <Card.Img variant="top" src={(auction.imgUrl.length!=0)?auction.imgUrl.split(",")[0]:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} style={{ objectFit: 'cover', height: '350px' }} />
                                        <Card.Body>
                                            <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                            <ListGroup variant="flush">
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : {moment().format("YYYY-MM-DD hh:mm:ss")} </ListGroup.Item> */}
                                                {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : { new Date().toString() } </ListGroup.Item> */}
                                                <ListGroup.Item key="10000" className='mb-2 text-muted'>{!auction.active?<>Starts at</>:<>Started at</>}:&emsp;&emsp;&emsp;: &emsp;{auction.starts.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                <ListGroup.Item key='20000' className='mb-2 text-muted'>{Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')))> 0 ? <>Ends on</>:<>Ended on</>}&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                {Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')))> 0 ?
                                                <>
                                                    <ListGroup.Item key='3' className='mb-2 text-muted'>Time remaining&nbsp;&nbsp;: &emsp;
                                                        {diff = Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                                        {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                                        {Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes
                                                    </ListGroup.Item>
                                                </>:null}
                                            </ListGroup>
                                        
                                            <Card.Footer>
                                                <Row>
                                                    <Col className="footer-mini-container"> CURRENT BID: &ensp; </Col>
                                                    <Col> {auction.currently} € </Col>
                                                </Row>

                                                {(!auction.active)?
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
            :<NewAuction/>}
        </>
        : <AuctionManagePage data_tranfer={this.state.auction_id} />}
        </>
        : <Redirect exact to="/login"></Redirect>
        )
    }
}
