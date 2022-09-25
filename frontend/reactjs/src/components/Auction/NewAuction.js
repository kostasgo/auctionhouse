import React, { Component } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./NewAuction.css"
import { MapContainer, TileLayer } from 'react-leaflet';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";


import AuthService from "../../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEnvelope, faGlobe, faSignature, faPhone, faLocationPin, faKey, faSignInAlt, faSave, faCalendarCheck, faCalendarDays, faList } from '@fortawesome/free-solid-svg-icons'

import { InputGroup } from "react-bootstrap";
import AllCountriesList from "../sharedComponents/AllCountriesList";
import AllCategoriesList from "../sharedComponents/AllCategoriesList";
import auctionService from '../../services/auction.service';
import { LeafletContext, LeafletProvider } from '@react-leaflet/core';
import { Map, map } from 'leaflet';


export function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                This field is required!
            </div>
        );
    }
};


const vtext = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vdate = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};



export default class NewAuction extends Component {
    constructor(props) {
        super(props);
        this.handleNewAuction = this.handleNewAuction.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onAddCategory = this.onAddCategory.bind(this);
        this.onChangeCountry = this.onChangeCountry.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);


    

        this.state = {
            title: "",
            description: "",
            country: "",
            city : "",
            longitude: 0,
            latitude: 0,

            countryLocation : [],
            cityLocation : [],

      
            successful: false,
            message: ""
        };
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeDate(e) {
        this.setState({
            // startDate: e.target.value
            // endDate:
        });
    }

    onChangeCountry(e) {
        this.setState({
            country: e.target.value
        });
      

        axios.get("https://nominatim.openstreetmap.org/search.php?q="+ String(e.target.value)  +"&format=jsonv2")
        .then(response => response.data)
        .then((data) => {
            // console.log(data[0]);
            this.setState({ countryLocation : data});  
            this.map.flyTo([data[0].lat,data[0].lon],7);              
        });
    }

    onChangeCity(e) {
        this.setState({
            city: e.target.value
        });
        axios.get("https://nominatim.openstreetmap.org/search.php?q="+ String(e.target.value)  +"&format=jsonv2")
        .then(response => response.data)
        .then((data) => {
            // console.log(data[0]);
            this.setState({ cityLocation : data});  
            this.map.flyTo([data[0].lat,data[0].lon],7);              
        });
    }

    onAddCategory(e) {
        this.setState({
        });
    }

    onChangeEndDate(e) {
        this.setState({   
        });
    }

    handleMapClick(e) {
        console.log(e.coordinate);
    }



    handleNewAuction(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            auctionService.createNewAuction(
                
            ).then(
                response => {
                    this.setState({
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
        }

        
    }

    

    render() {

        

        return (
            <>

            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
            integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
            crossorigin=""/>
             <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
            integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
            crossorigin=""></script>

            <script src="http://www.openlayers.org/api/OpenLayers.js"></script>

            <div className='title'>
                <div className="container d-flex h-100">
                        <div className="row justify-content-center align-self-center">
                            <span className='display-3'> <u>Manage Auctions</u></span>
                            <span className='lead'>NEW AUCTION</span>
                        </div>
                </div>
            </div>
            <Row className="justify-content-center">
                <Col lg={6}>
                    <Card>
                        <Card.Header>
                            Fill the form below to create a new auction
                        </Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.handleNewAuction}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                {this.state.message && (
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
                                )}

                                {!this.state.successful && (
                                    <div>
                                        {/* TITLE */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faSignature} /></InputGroup.Text>
                                            <Input
                                                placeholder="Title"
                                                type="text"
                                                className="form-control newAuction-input"
                                                name="title"
                                                value={this.state.title}
                                                onChange={this.onChangeTitle}
                                                validations={[required]}
                                                aria-label="title"
                                                aria-describedby="signature-icon"
                                            />
                                        </InputGroup>

                                        {/* DESCRIPTION */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faSignature} /></InputGroup.Text>
                                            <textarea
                                                placeholder="Description"
                                                size="500"
                                                type="text"
                                                className="form-control newAuction-input"
                                                name="description"
                                                value={this.state.description}
                                                onChange={this.onChangeDescription}
                                                validations={[required]}
                                                aria-label="description"
                                                aria-describedby="signature-icon"
                                            />
                                        </InputGroup>

                                        {/* CATEGORY */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faList} /></InputGroup.Text>

                                            <span className="text-muted">
                                            &nbsp;&nbsp; Categories (Windows: ctrl+click - Mac: command+click)
                                            </span>
                                        
                                            <select multiple 
                                                size = "3"
                                                className="form-select"
                                                onChange={this.onAddCategory}
                                                validations={[required]}
                                                aria-label="role"
                                                aria-describedby="password-icon"
                                            >
                                                <AllCategoriesList />
                                            </select>
                                        </InputGroup>

                    
                                        {/* ENDING DATE */}
                                        <InputGroup className="mb-3">

                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faCalendarDays} /></InputGroup.Text>
                                            <InputGroup.Text id="signature-icon"><span className="text-muted">&nbsp;&nbsp;Ending date and time</span></InputGroup.Text>
                                
                                            <Input
                                                id="datefield"
                                                size="500"
                                                type="datetime-local"
                                                className="form-control newAuction-input"
                                                name="endDate"
                                                onChange={this.onChangeEndDate}
                                            />
                                        </InputGroup>

                                        
                                        {/* COUNTRY */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="country-icon"><FontAwesomeIcon icon={faGlobe} /></InputGroup.Text>

                                            <select
                                                className="form-select"
                                                onChange={this.onChangeCountry}
                                                aria-label="country"
                                                aria-describedby="country-icon"
                                            >
                                                <AllCountriesList />
                                            </select>
                                        </InputGroup>


                                        {/* CITY */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faSignature} /></InputGroup.Text>
                                            <Input
                                                placeholder="City"
                                                type="text"
                                                className="form-control newAuction-input"
                                                name="title"
                                                onBlur={this.onChangeCity}
                                                validations={[required]}
                                                aria-label="title"
                                                aria-describedby="signature-icon"
                                            />
                                        </InputGroup>


                                        {/* MAP */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="location-icon"><FontAwesomeIcon icon={faLocationPin} /></InputGroup.Text>
                                            <div id='map'>
                                                <MapContainer ondblclick={this.handleMapClick} ref={(e) => { this.map = e; }} id='map' className='map' center={[37.983810, 23.727539]} zoom={5}>
                                                    <TileLayer
                                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                </MapContainer>
                                            </div>
                                        </InputGroup>

                                        {/* {this.map.on('dblclick', event => {console.log(event.coordinate);})} */}
                        

                               


                                        {/* SAVE BUTTON */}
                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block"><FontAwesomeIcon icon={faSave} /> Create Auction</button>
                                        </div>
                                    </div>
                                )}


                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                                <p className='lead'>*Creating fake auctions will result in account suspension.</p>
                        </Card.Footer>

                    </Card>
                </Col>
            </Row>
            </>

        );
    }
}

