import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./AuctionsList.css"
import AuctionsList from './AuctionsList';

function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            auctions: [],
            toBack : false
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions/1")
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });
    }
    
    render() {
        const handleSearch = () => {
            console.log("SEARCH CLICKED");
            <Route path="/" element={ <Navigate to="/" /> } />
        };

        const handleSelect = () => {
            console.log("SELECT CLICKED");
            this.setState({toBack:true});
        };

        const handleUserClick = () => {
            console.log("USER CLICKED");
            <Route path="/" element={ <Navigate to="/" /> } />
        };

        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;

        return (
            !this.state.toBack) ? 
            <>
               <span>HALLO</span>
               <Button variant="primary" className='select-button' onClick={handleSelect}>BACK</Button>
            </> : <AuctionsList />
        
    }
}
