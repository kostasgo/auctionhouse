import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, json } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./NewAuction.css"
import AuctionsList from './AuctionsList';

function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class NewAuction extends Component {
    constructor(props, context) {
        super(props);
        console.log(this.props.data_tranfer);
        this.state = {
            toBack: false
        };
    }

    componentDidMount() {

    }

    render() {

        const handleBack = () => {
            console.log("BACK CLICKED");
            console.log(this.state.auction.seller);
            this.setState({ toBack: true });
        };


        return (!this.state.toBack) ?
            <>
                <span>HALLO</span>
            </>
            :
            <>
                <AuctionsList />
            </>
    }
}
