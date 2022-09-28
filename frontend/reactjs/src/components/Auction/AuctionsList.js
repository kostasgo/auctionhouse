import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup';
import "../../css/AuctionsList.css"
import AuctionPage from './AuctionPage';
import AuthService from "../../services/auth.service";
import { Form } from 'react-bootstrap';
import auctionService from '../../services/auction.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin, faList, faDollar, faContactCard, faSearch } from '@fortawesome/free-solid-svg-icons'
import AllCategoriesList from '../sharedComponents/AllCategoriesList';
import AllCountriesList from '../sharedComponents/AllCountriesList';


function calcDifference(dt1, dt2) {
    var diff = (dt1 - dt2) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


export default class AuctionsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auctions: [],
            toAuction: false,
            auction_id: -1,
            redirect: null,
            userReady: false,
            currentUser: { username: "" },

            filter1value : 100000,
            filter2value : "",
            filter3value : "",
            search_string: "",

            search_string: "",
            pageOffset: 0,
            totalResults: 0,
            message: props.message,
            successful: props.successful
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
        this.handlePageNext = this.handlePageNext.bind(this);
        this.handlePagePrev = this.handlePagePrev.bind(this);
        this.handlePriceFilter = this.handlePriceFilter.bind(this);
        this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
        this.handleCountryFilter = this.handleCountryFilter.bind(this);
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        var activeId = -1;
        
        if (currentUser){
            this.setState({ currentUser: currentUser, userReady: true });
            activeId = currentUser.id;
        } 
        if (!guest && !currentUser) this.setState({ redirect: "/login" });

        auctionService.searchAuctionsCount(this.state.search_string,this.state.filter1value,this.state.filter2value,this.state.filter3value,true, activeId, true)
        .then(response => response.data)
        .then((data) => {
            // console.log(data);
            this.setState({ auctionsCount: data });
        });

        auctionService.searchAuctions(this.state.search_string,this.state.filter1value,this.state.filter2value,this.state.filter3value,true, activeId, this.state.pageOffset)
        .then(response => response.data)
        .then((data) => {
            this.setState({ auctions: data });
        });


        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;

        if (this.state.pageOffset + 1 >= Math.ceil(this.state.totalResults / 3)) {
            document.getElementById("next-page").setAttribute("class", "page-link disabled")
        }


    }

    handleSearch(){
        this.state.search_string = document.getElementById("search-input").value;
        var activeId = -1;
        var currentUser = AuthService.getCurrentUser();
        if (currentUser){
            activeId = currentUser.id;
        }
        auctionService.searchAuctionsCount(this.state.search_string,this.state.filter1value,this.state.filter2value,this.state.filter3value,true,activeId,true)
        .then(response => response.data)
        .then((data) => {
            // console.log(data);
            this.setState({ totalResults: data });
        });

        auctionService.searchAuctions(this.state.search_string,this.state.filter1value,this.state.filter2value,this.state.filter3value,true,activeId,this.state.pageOffset)
        .then(response => response.data)
        .then((data) => {
            this.setState({ auctions: data });
        });
    }

    handlePriceFilter(){
        this.setState({filter1value : 100000});
        console.log("handler1");
    }

    handleSlider(e){
        this.state.filter1value = e.target.value;
        document.getElementById("num1").innerHTML = this.state.filter1value;
        console.log(this.state.filter1value);
    }

    handleCategoryFilter(){
        this.setState({filter2value : "%"});
        console.log("handler2")
        
    }

    handleCategory(e){
        this.state.filter2value = e.target.value;
        console.log(this.state.filter2value);
    }

    handleCountryFilter(){
        this.setState({filter1value : "%"});
        console.log("handler3");
    }

    handleCountry(e){
        this.state.filter3value = e.target.value;
        console.log(this.state.filter3value);
    }

    handlePageNext(){
        var activeId = -1;
        if (this.state.currentUser){
            activeId = this.state.currentUser.id;
        } 

        this.state.pageOffset++;
        document.getElementById("prev-page").setAttribute("class","page-link");

        if (this.state.pageOffset >= Math.ceil(this.state.totalResults / 3)){
            document.getElementById("next-page").setAttribute("class","page-link disabled")
        }

        auctionService.searchAuctions(this.state.search_string, true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;
    }

    handlePagePrev() {
        var activeId = -1;
        if (this.state.currentUser) {
            activeId = this.state.currentUser.id;
        }

        this.state.pageOffset--;
        document.getElementById("next-page").setAttribute("class", "page-link");

        if (this.state.pageOffset - 1 <= 0) {
            document.getElementById("prev-page").setAttribute("class", "page-link disabled")
        }

        auctionService.searchAuctions(this.state.search_string, true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const handleSelect = (id) => {
            // console.log("SELECT CLICKED");
            this.setState({ toAuction: true });
            this.setState({ auction_id: id });
        };

        const handleUserClick = () => {
            // console.log("USER CLICKED");
            //  <Route path="/" element={<Navigate to="/" />} />
        };

        // CLACULATING REMAINING TIME
        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;


        // FILTERS
        var coll;
        var i;








        return (!this.state.toAuction) ? <>

            <div className='title'>
                <div className="container d-flex h-100">
                    <div className="row justify-content-center align-self-center">
                        <span className='display-3'> <u className='shadow-sm title-text-effects'>Browse Auctions <FontAwesomeIcon icon={faSearch} /></u></span>
                        <span className='lead'>Find what you need!</span>
                    </div>
                </div>
            </div>

            <Form className="d-flex">
                <Form.Control
                    id='search-input'
                    type="search"
                    placeholder="#Anything you desire"
                    className="shadow me-2"
                    aria-label="Search"
                />
                <Button className='shadow primary searchbutton' onClick={this.handleSearch}>Search</Button>
            </Form>

            <Container className='search-container'>
                <Row xs={3} md={3} xl={3}>
                    <Col>
                        <Button className="shadow collapsible" variant="btn btn-success" onClick={this.handlePriceFilter}><FontAwesomeIcon icon={faDollar} /> PRICE RANGE</Button>
                        <div class="shadow content">
                            <label for="customRange1" class="form-label">Set maximum amount</label>
                            <input class="form-range" type="range" step="100" min="0" max="100000" aria-valuenow="30000" id="customRange1" onChange={this.handleSlider} />
                            <div className='lead form-bottom'>from 0   to  <span id="num1">100000</span> €</div>
                        </div>
                    </Col>
                    <Col>
                        <Button className="shadow collapsible" variant="btn btn-warning" onClick={this.handleCategoryFilter}><FontAwesomeIcon icon={faList} /> CATEGORY</Button>
                        <div class="shadow content">
                        <label for="sel1" class="form-label">Select category:</label>
                            <select class="shadow-sm form-control form-bottom" id="sel1" onChange={(e)=>this.handleCategory(e)}>
                            <option key="" value="">CATEGORY</option>
                            <AllCategoriesList/>
                            </select>
                        </div>
                    </Col>
                    <Col>
                        <Button className="shadow collapsible" variant="btn btn-danger" onClick={this.handleCountryFilter}><FontAwesomeIcon icon={faLocationPin} /> LOCATION</Button>
                        <div class="shadow content">
                        <label for="sel2" class="form-label">Select country:</label>
                        <select class="shadow-sm form-control form-bottom2" id="sel2" onChange={(e)=>this.handleCountry(e)}>
                            <option key="" value="">COUNTRY</option>
                            <AllCountriesList/>
                            </select>
                        </div>
                    </Col>
                </Row>



            </Container>

            <nav aria-label="Page navigation example">
                <ul class="pagination pagination-lg">
                    <li class="page-item">
                        <a class="page-link disabled" onClick={this.handlePagePrev} aria-label="Previous" id='prev-page'>
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link active" id="active-page">1</a></li>
                    <p className='page-link disabled'> out of {Math.ceil(this.state.totalResults / 3) == 0 ? 1 : Math.ceil(this.state.totalResults / 3)} </p>
                    <li class="page-item">
                        <a class="page-link" onClick={this.handlePageNext} aria-label="Next" id='next-page'>
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <Row>
                {
                    this.state.auctions.length === 0 ?
                        <h3>0 Auctions Available</h3>
                        :

                        this.state.auctions.map((auction) => (
                            <Col xs={12} md={6} xl={4}>
                                <div className="auctionItem">
                                    <div className="options">
                                        <Card key={auction.id} className="shadow card" >
                                            <Card.Img className='cardimg' variant="top" src={(auction.imgUrl != null) ? auction.imgUrl.split(",")[0] : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} style={{ objectFit: 'cover' }} />
                                            <Card.Body className='cardbod'>
                                                <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">Auctioned By: <Button variant="secondary" className='userName' onClick={handleUserClick} >{auction.seller.user.username}</Button> ({auction.seller.rating}/5) <span className='votecount'> {auction.seller.rating_count} votes </span> </Card.Subtitle>
                                                {/* <Card.Text className="text-left">
                                                {auction.description}
                                            </Card.Text> */}

                                                <ListGroup variant="flush">
                                                    {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : {moment().format("YYYY-MM-DD hh:mm:ss")} </ListGroup.Item> */}
                                                    {/* <ListGroup.Item className='mb-2 text-muted'>Current time     : { new Date().toString() } </ListGroup.Item> */}
                                                    <ListGroup.Item key='1' className='mb-2 text-muted'>Ends on&emsp;&emsp;&emsp;&emsp;: &emsp;{auction.ends.replace('T', ' ').replace('Z', '')} </ListGroup.Item>
                                                    <ListGroup.Item key='2' className='mb-2 text-muted remaining'>Time remaining&nbsp;&nbsp;: &emsp;
                                                        {diff = Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/'))) / 1000 / 60 / 60 / 24)} days&ensp;
                                                        {diff2 = Math.floor(Math.abs(diff2 = new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60 / 60)} hours&ensp;
                                                        {Math.floor(Math.abs(new Date() - new Date(auction.ends.replace('T', ' ').replace('Z', '').replace(/-/g, '/')) + (diff2 * 1000 * 60 * 60) + (diff * 1000 * 60 * 60 * 24)) / 1000 / 60)} minutes
                                                    </ListGroup.Item>
                                                </ListGroup>

                                                <Card.Footer>
                                                    <Row>
                                                        <Col className="footer-mini-container"> CURRENT BID: &ensp; </Col>
                                                        <Col> {auction.currently} € </Col>
                                                    </Row>

                                                    <Row >
                                                        <Button variant="primary" className='select-button' onClick={() => handleSelect(auction.id)}>SEE MORE</Button>
                                                    </Row>
                                                </Card.Footer>

                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </Col>
                        ))
                }
            </Row >
        </> : <AuctionPage data_tranfer={this.state.auction_id} />

    }


}
