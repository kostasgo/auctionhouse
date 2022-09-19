import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'
import "./AuctionPage.css"
import moment from "moment";


function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}



export default class AuctionPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            auctions: []
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions/"+String(this.props.location.state.id))
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });
    }
    
    render() {
        
   
        return (
    
            <>
                <div> HALLO </div>

                
            </>
        )
    }
}
