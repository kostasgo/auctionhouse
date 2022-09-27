import React, { Component } from 'react'
import axios from 'axios'
import authHeader from '../../services/authHeader';
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import { Container, Row, Col, Card, Button, NavItem } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import AuthService from "../../services/auth.service";
import { Redirect } from "react-router-dom";

export default class Chat extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            conversations : [],
            messages : []
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/messages", { headers: authHeader() })
            .then(response => response.data)
            .then((data) => {
                this.setState({ categories_given : data});
            });
    }
    render() {
        return (
            <Container className='overlay'>
            
    
            </Container>


        )
    }
}