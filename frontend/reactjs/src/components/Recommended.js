import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import { Container, Row, Col, Card, Button, NavItem } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./HomePage.css"
import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";
import Chat from "./sharedComponents/Chat"
import { Link } from "react-router-dom";
import auctionService from '../services/auction.service';





export default class Recommended extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommended_auctions: [],
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        console.log(this.props.id);

        auctionService.getRecommended(this.props.id)
            .then(response => response.data)
            .then((data) => {
                console.log(data.length);
                this.setState({ recommended_auctions: data });
            });
    }

    handleSelect = (id) => {
        console.log("SELECT CLICKED");
        this.setState({ toBack: true, toAuctionManage: true });
        this.setState({ auction_id: id });


    };



    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const handleSearch = () => {
            console.log("SEARCH CLICKED");
            //  <Route path="/" element={<Navigate to="/" />} />
        };


        const handleUserClick = (id) => {
            console.log("USER CLICKED");
        };

        // CALCULATING REMAINING TIME
        var diff;
        var diff2;


        return (
            <>
                <div >
                    <u class="display-4">Recommeneded Auctions</u>
                    <br></br>
                    <span class="lead">
                        WE THINK YOU MAY FIND THESE INTERESTING
                    </span>
                </div>
                <Row>
                    {
                        this.state.recommended_auctions.length === 0 ?
                            <h3>0 Auctions Available</h3>
                            :

                            this.state.recommended_auctions.map((auction) => (
                                <Col key={auction.id} xs={4} md={3} xl={3}>
                                    <div className="auctionItem my-5">
                                        <div className="options">
                                            <Card key={auction.id} className="shadow-lg card" >
                                                <Card.Img variant="top" src={(auction.imgUrl != null) ? auction.imgUrl.split(",")[0] : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} style={{ height: '150px', objectFit: 'cover' }} />
                                                <Card.Body className="cardbod">
                                                    <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                                    <Card.Subtitle className="mb-3 text-muted">Auctioned By: <Button variant="secondary" className='userName' onClick={this.handleUserClick} >{auction.seller.user.username}</Button> </Card.Subtitle>
                                                    {/* <Card.Text className="text-left">
                                                {auction.description}
                                            </Card.Text> */}

                                                    <ListGroup variant="flush">
                                                        {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : {moment().format("YYYY-MM-DD hh:mm:ss")} </ListGroup.Item> */}
                                                        {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : { new Date().toString() } </ListGroup.Item> */}
                                                        <ListGroup.Item key='1' className='p-0 text-muted'>Ends on&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                        <ListGroup.Item key='2' className='p-0 text-muted'>Time remaining&nbsp;&nbsp;: &emsp;
                                                            {diff = Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)}d,&ensp;
                                                            {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)}h,&ensp;
                                                            {Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)}m
                                                        </ListGroup.Item>
                                                    </ListGroup>

                                                    <div className="mx-5 mt-3 d-flex item-footer">
                                                        <div className="btn-price">
                                                            <Button variant="primary" className='select-button w-100' onClick={() => this.handleSelect(auction.id)}>
                                                                <strong>PRICE TO BEAT</strong><br />
                                                                <strong class="price">{auction.currently} €</strong>
                                                            </Button>
                                                        </div>

                                                    </div>

                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </div>
                                </Col>
                            ))
                    }
                </Row>





            </>)

    }
}
