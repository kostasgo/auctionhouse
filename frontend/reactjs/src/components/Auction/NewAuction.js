import React, { Component } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios'
import "./NewAuction.css"
import { MapContainer, TileLayer } from 'react-leaflet';

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEnvelope, faGlobe, faSignature, faPhone, faLocationPin, faKey, faSignInAlt, faSave, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

import { InputGroup } from "react-bootstrap";
import AllCountriesList from "../sharedComponents/AllCountriesList";

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


const vusername = value => {
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

        this.state = {
            title: "",
            description: "",
            country: "",
            city : "",

      
            successful: false,
            message: ""
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangePhone(e) {
        this.setState({
            phone: e.target.value
        });
    }

    onChangeLocation(e) {
        this.setState({
            location: e.target.value
        });
    }


    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeCountry(e) {
        this.setState({
            country: e.target.value
        });
    }

    onChangeRoles(e) {
        if (e.target.value === "ADMIN") {
            this.setState({
                roles: ["USER", "ADMIN"]
            });

        }
        else if (e.target.value === "ADMIN") {
            this.setState({
                roles: ["USER"]
            });
        }
        else {
            this.setState({
                roles: []
            });
        }
    }

    handleNewAuction(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                
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
                                                value={this.state.name}
                                                onChange={this.onChangeName}
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
                                                value={this.state.email}
                                                onChange={this.onChangeDescription}
                                                validations={[required, email]}
                                                aria-label="description"
                                                aria-describedby="signature-icon"
                                            />
                                        </InputGroup>

                                        {/* CATEGORY */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faCalendarCheck} /></InputGroup.Text>
                                            <select
                                                className="form-select"
                                                onChange={this.onAddCategory}
                                                validations={[required]}
                                                aria-label="role"
                                                aria-describedby="password-icon"
                                            >
                                                <option>Category</option>
                                                <option value="admin">Jewlery</option>
                                                <option value="user">Vehicles</option>
                                                <option value="admin">Instruments</option>
                                                <option value="user">Cars</option>
                                            </select>
                                        </InputGroup>


                                        {/* STARTING DATE */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faCalendarCheck} /></InputGroup.Text>
                                            <Input
                                                placeholder="Date start"
                                                size="500"
                                                type="datetime-local"
                                                className="form-control newAuction-input"
                                                name="description"
                                                onChange={this.onChangeDateStart}
                                            />
                                        </InputGroup>

                    
                                        {/* ENDING DATE */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faCalendarCheck} /></InputGroup.Text>
                                            <Input
                                                placeholder="Date end"
                                                size="500"
                                                type="datetime-local"
                                                className="form-control newAuction-input"
                                                name="description"
                                                onChange={this.onChangeDateStart}
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
                                                onChange={this.onChangeName}
                                                validations={[required]}
                                                aria-label="title"
                                                aria-describedby="signature-icon"
                                            />
                                        </InputGroup>


                                        {/* MAP */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="location-icon"><FontAwesomeIcon icon={faLocationPin} /></InputGroup.Text>
                                            <div className='map'>
                                                <MapContainer center={[37.983810, 23.727539]} zoom={5} className='map' >
                                                    <TileLayer
                                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                </MapContainer>
                                            </div>
                                        </InputGroup>


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

