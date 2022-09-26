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
import { faUser, faLock, faEnvelope, faGlobe, faSignature, faPhone, faLocationPin, faKey, faSignInAlt, faSave, faCalendarCheck, faCalendarDays, faList, faImage, faDollarSign } from '@fortawesome/free-solid-svg-icons'

import { InputGroup } from "react-bootstrap";
import AllCountriesList from "../sharedComponents/AllCountriesList";
import AllCategoriesList from "../sharedComponents/AllCategoriesList";
import auctionService from '../../services/auction.service';
import ImageUploading from 'react-images-uploading';


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
        this.onChangeEndDate = this.onChangeEndDate.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onImageRemoveAll = this.onImageRemoveAll.bind(this);
        this.onChangeFirstBid = this.onChangeFirstBid.bind(this);
        this.onChangeBuyPrice = this.onChangeBuyPrice.bind(this);

        this.state = {
            title: "",
            description: "",
            categories : [],
            endDate : "",
            country: "",
            city : "",
            longitude: 0,
            latitude: 0,
            firstBid : 0,
            buyPrice: 0,

            selectedFiles : [],
            selectedFileNames : [],


            userReady: false,
            currentUser: { username: "" },
      
            successful: false,
            message: ""
        };
    }

    componentDidMount(){
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        var activeId = -1;
        
        if (currentUser){
            this.setState({ currentUser: currentUser, userReady: true });
            activeId = currentUser.id;
        } 
        if (!guest && !currentUser) this.setState({ redirect: "/login" });

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

    onChangeCountry(e) {
        this.setState({
            country: e.target.value
        });
        axios.get("https://nominatim.openstreetmap.org/search.php?q="+ String(e.target.value)  +"&format=jsonv2")
        .then(response => response.data)
        .then((data) => {
            // console.log(data[0]);
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
            this.setState({ 
                            latitude : data[0].lat,
                            longitude : data[0].lon
            });  
            this.map.flyTo([data[0].lat,data[0].lon],7);              
        });
    }


    onChangeFirstBid(e) {
        if (!(/^\d+$/)) {
            return (
                <div className="alert alert-danger m-0" role="alert">
                    First bid not valid.
                </div>
            );
        }
        else this.state.firstBid = e.target.value;
    }

    onChangeBuyPrice(e) {
        if (!(/^\d+$/) || e.target.value < this.state.firstBid) {
            return (
                <div className="alert alert-danger m-0" role="alert">
                    Buy price not valid.
                </div>
            );
        }
        else this.state.buyPrice = e.target.value;
    }

    onAddCategory(e) {
        console.log(e.target.selectedOptions);
        // console.log(e.target.value);
        this.state.categories = [];
        for (let j=0 ; j < e.target.selectedOptions.length ; j++){
            this.state.categories.push(e.target.selectedOptions[j].value);
        }
        
    }

    onChangeEndDate(e) {
        this.setState({  
            endDate : (e.target.value).replace('T', ' ')
        });
        // console.log(e.target.value);
    }


    onChange(e) {
        console.log(e)
        // console.log(e.length)
        // console.log(e[0])
        // console.log(e[0].file.name)
        // console.log(e[0].data)
        for (let i = 0 ; i < e.length ; i++ ){
            document.getElementById("pic"+String(i+1)).src=(e[i].data);
            document.getElementById("pic"+String(i+1)).name=(e[i].file.name);
        }
    }

    onImageRemoveAll(){
        document.getElementById("pic1").src="";
        document.getElementById("pic1").name="";

        document.getElementById("pic2").src="";
        document.getElementById("pic2").name="";

        document.getElementById("pic3").src="";
        document.getElementById("pic3").name="";

        document.getElementById("pic4").src="";
        document.getElementById("pic4").name="";

        document.getElementById("pic5").src="";
        document.getElementById("pic5").name="";
    }



    handleNewAuction(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        var imageData = [];
        var imageNames = [];

        for (let i = 1 ; i <= 5 ; i++){
            var current = document.getElementById("pic"+String(i))
            if (current.src!=""){
                imageData.push(current.src);
                imageNames.push(current.name);
            }
        }



        console.log(
            this.state.currentUser.username,
            this.state.title,
            this.state.description,
            this.state.categories,
            this.state.firstBid,
            this.state.buyPrice,
            this.state.endDate,
            this.state.country,
            this.state.city,
            this.state.latitude,
            this.state.longitude,
            imageNames,
            imageData
        )
        if (this.checkBtn.context._errors.length === 0) {
            auctionService.createNewAuction(
                this.state.currentUser.username,
                this.state.title,
                this.state.description,
                this.state.categories,
                this.state.firstBid,
                this.state.buyPrice,
                this.state.endDate,
                this.state.country,
                this.state.city,
                this.state.latitude,
                this.state.longitude,
                imageNames,
                imageData
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
                                                size="50"
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
                                            >
                                                <AllCategoriesList />
                                            </select>
                                        </InputGroup>


                                        {/* FIRSTBID */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faDollarSign} /></InputGroup.Text>
                                            <Input
                                                placeholder="First bid"
                                                type="number"
                                                size="50"
                                                className="form-control newAuction-input"
                                                name="title"
                                                value={this.state.title}
                                                onChange={this.onChangeFirstBid}
                                                validations={[required]}
                                                aria-label="FIRST BID"
                                            />
                                        </InputGroup>

                                        {/* BUY PRICE */}
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faDollarSign} /></InputGroup.Text>
                                            <Input
                                                placeholder="Buy out price"
                                                type="number"
                                                size="50"
                                                className="form-control newAuction-input"
                                                name="title"
                                                value={this.state.title}
                                                onChange={this.onChangeBuyPrice}
                                                validations={[required]}
                                                aria-label="BUY PRICE"
                                            />
                                        </InputGroup>

                    
                                        {/* ENDING DATE */}
                                        <InputGroup className="mb-3">

                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faCalendarDays} /></InputGroup.Text>
                                            <InputGroup.Text id="signature-icon"><span className="text-muted">&nbsp;&nbsp;Ending date and time</span></InputGroup.Text>
                                
                                            <Input
                                                id="datefield"
                                                size="500"
                                                type="datetime-local"
                                                validations={[required]}
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
                                                <MapContainer ref={(e) => { this.map = e; }} id='map' className='map' center={[37.983810, 23.727539]} zoom={5}>
                                                    <TileLayer
                                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                </MapContainer>
                                            </div>
                                        </InputGroup>




                                        {/* IMAGES */}
                                        <InputGroup className="mb-3">
                                        <InputGroup.Text id="location-icon"><FontAwesomeIcon icon={faImage} /><span>&nbsp; Images </span></InputGroup.Text>
                                        <ImageUploading
                                                multiple
                                                value={this.state.images}
                                                onChange={this.onChange}
                                                maxNumber={5}
                                                dataURLKey="data"
                                            >
                                                {({
                                                imageList,
                                                onImageUpload,
                                                onImageRemoveAll,
                                                onImageUpdate,
                                                onImageRemove,
                                                isDragging,
                                                dragProps,
                                                }) => (
                                                // write your building UI
                                                <div className="upload__image-wrapper">
                                                    <Button variant="btn btn-success"
                                                    style={isDragging ? { color: 'red' } : undefined}
                                                    onClick={onImageUpload}
                                                    {...dragProps}
                                                    >
                                                    Click or Drop here
                                                    </Button>
                                                    &nbsp;
                                                    <Button variant="btn btn-danger" onClick={this.onImageRemoveAll}>Remove all images</Button>
                                                    {imageList.map((image, index) => (
                                                    <div key={index} className="image-item">
                                                        <img src={image['data_url']} alt="" width="100" />
                                                        <div className="image-item__btn-wrapper">
                                                        <button onClick={() => onImageUpdate(index)}>Update</button>
                                                        <button onClick={() => onImageRemove(index)}>Remove</button>
                                                        </div>
                                                    </div>
                                                    ))}
                                                </div>
                                                )}
                                        </ImageUploading>
                                        </InputGroup>


                                        {/* <InputGroup className="mb-3">
                                        <InputGroup.Text id="location-icon"><FontAwesomeIcon icon={faImage} /><span>&nbsp; Images </span></InputGroup.Text>
                                            <input className="btn btn-secondary btn-block" accept='image/*' multiple onChange={this.onChange} type="file" />
                                        </InputGroup> */}
                                          


                                        <Row><img className='imgprev' id="pic1"></img><img className='imgprev' id="pic2"></img><img className='imgprev' id="pic3"></img><img className='imgprev' id="pic4"></img><img className='imgprev' id="pic5"></img></Row>

                                        <br></br>                                        
                                        {/* </InputGroup> */}

                        

                               


                                        {/* SAVE BUTTON */}
                                        <div className="form-group">
                                            <Button className="btn btn-primary btn-block" onClick={this.handleNewAuction}><FontAwesomeIcon icon={faSave} /> Create Auction</Button>
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

