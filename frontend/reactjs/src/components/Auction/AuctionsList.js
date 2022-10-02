import React, { Component, useEffect } from 'react'
import { Redirect, Router } from 'react-router-dom';
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
            resultsReady: false,
            currentUser: { username: "" },

            filter1value: 100000,
            filter2value: "",
            filter3value: "",
            search_string: "",

            search_string: "",
            pageOffset: 0,
            totalResults: -1,
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
        this.handleReady = this.handleReady.bind(this);
        this.handleUserClick = this.handleUserClick.bind(this);
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        var activeId = -1;
        if (currentUser) {
            console.log(currentUser);
            this.setState({ currentUser: currentUser, userReady: true });
            activeId = currentUser.id;
        }
        if (!guest && !currentUser) this.setState({ redirect: "/login" });


        auctionService.searchAuctionsCount(this.state.search_string, this.state.filter1value, this.state.filter2value, this.state.filter3value, true, activeId, true)
            .then(response => response.data)
            .then((data) => {
                console.log("initial count")
                console.log(data);
                this.setState({
                    totalResults: data,
                    resultsReady: true
                })
            })


        auctionService.searchAuctions(this.state.search_string, this.state.filter1value, this.state.filter2value, this.state.filter3value, true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                console.log(data.length);
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
    }



    handleReady() {
        this.state.resultsReady = false;
        console.log("in handle ready")
        console.log(this.state.pageOffset)
        console.log(Math.ceil(this.state.totalResults / 9))

        if (this.state.pageOffset + 1 > Math.ceil(this.state.totalResults / 9) || Math.ceil(this.state.totalResults / 9) == 1) {
            document.getElementById("next-page").setAttribute("class", "page-link disabled")
        }
        else {
            document.getElementById("next-page").setAttribute("class", "page-link")
        }
    }



    handleSearch() {
        this.state.search_string = document.getElementById("search-input").value;
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        var activeId = -1;

        if (currentUser) {
            this.setState({ currentUser: currentUser, userReady: true });
            activeId = currentUser.id;
        }
        auctionService.searchAuctionsCount(this.state.search_string, this.state.filter1value, this.state.filter2value, this.state.filter3value, true, activeId, true)
            .then(response => response.data)
            .then((data) => {
                console.log("after search count")
                console.log(data);
                this.setState({
                    totalResults: data,
                    resultsReady: true
                });
            });

        auctionService.searchAuctions(this.state.search_string, this.state.filter1value, this.state.filter2value, this.state.filter3value, true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });
    }

    handlePriceFilter() {
        this.setState({ filter1value: 50000 });
        document.getElementById("price").value = this.state.filter1value;
        document.getElementById("num1").innerHTML = this.state.filter1value;
        // console.log("handler1");
    }

    handleSlider(e) {
        this.state.filter1value = e.target.value;
        document.getElementById("num1").innerHTML = this.state.filter1value;
        // console.log(this.state.filter1value);
    }

    handleCategoryFilter() {
        this.setState({ filter2value: "%" });
        document.getElementById("category").value = null;
        // console.log("handler2")

    }

    handleCategory(e) {
        this.state.filter2value = e.target.value;
        // console.log(this.state.filter2value);
    }

    handleCountryFilter() {
        this.setState({ filter3value: "%" });
        document.getElementById("country").value = null;
        // console.log("handler3");
    }

    handleCountry(e) {
        this.state.filter3value = e.target.value;
        // console.log(this.state.filter3value);
    }

    handlePageNext() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        var activeId = -1;

        if (currentUser) {
            this.setState({ currentUser: currentUser, userReady: true });
            activeId = currentUser.id;
        }

        this.state.pageOffset++;
        document.getElementById("prev-page").setAttribute("class", "page-link");

        if (this.state.pageOffset + 1 >= Math.ceil(this.state.totalResults / 9)) {
            document.getElementById("next-page").setAttribute("class", "page-link disabled")
        }

        auctionService.searchAuctions(this.state.search_string, this.state.filter1value, this.state.filter2value, this.state.filter3value, true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;
    }

    handlePagePrev() {
        const currentUser = AuthService.getCurrentUser();
        const guest = AuthService.getGuest();
        var activeId = -1;

        if (currentUser) {
            this.setState({ currentUser: currentUser, userReady: true });
            activeId = currentUser.id;
        }

        this.state.pageOffset--;
        document.getElementById("next-page").setAttribute("class", "page-link");

        if (this.state.pageOffset - 1 < 0) {
            document.getElementById("prev-page").setAttribute("class", "page-link disabled")
        }

        auctionService.searchAuctions(this.state.search_string, this.state.filter1value, this.state.filter2value, this.state.filter3value, true, activeId, this.state.pageOffset)
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });

        document.getElementById("active-page").innerHTML = this.state.pageOffset + 1;
    }


    handleUserClick() {
        // console.log("USER CLICKED");
        //  <Route path="/" element={<Navigate to="/" />} />
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }


        // CALCULATING REMAINING TIME
        var diff;
        var diff2;
        var days;
        var hours;
        var minutes;


        // FILTERS
        var coll;
        var i;








        return (<>

            <script>{this.state.resultsReady ? this.handleReady() : null}</script>

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
                    <Col id="filter1">
                        <Button className="shadow collapsible" variant="btn btn-success" onClick={this.handlePriceFilter}><FontAwesomeIcon icon={faDollar} /> PRICE RANGE</Button>
                        <div className="shadow content">
                            <label htmlFor="price" className="form-label">Set maximum amount</label>
                            <input className="form-range" type="range" step="100" min="0" max="100000" aria-valuenow="30000" id="price" onChange={this.handleSlider} />
                            <div className='lead form-bottom'>from 0   to  <span id="num1">100000</span> €</div>
                        </div>
                    </Col>
                    <Col id="filter2">
                        <Button className="shadow collapsible" variant="btn btn-warning" onClick={this.handleCategoryFilter}><FontAwesomeIcon icon={faList} /> CATEGORY</Button>
                        <div className="shadow content">
                            <label htmlFor="category" className="form-label">Select category:</label>
                            <select className="shadow-sm form-control form-bottom" id="category" onChange={(e) => this.handleCategory(e)}>
                                {/* <option key="" value="">CATEGORY</option> */}
                                <AllCategoriesList />
                            </select>
                        </div>
                    </Col>
                    <Col id="filter3">
                        <Button className="shadow collapsible" variant="btn btn-danger" onClick={this.handleCountryFilter}><FontAwesomeIcon icon={faLocationPin} /> LOCATION</Button>
                        <div className="shadow content">
                            <label htmlFor="country" className="form-label">Select country:</label>
                            <select className="shadow-sm form-control form-bottom" id="country" onChange={(e) => this.handleCountry(e)}>
                                {/* <option key="" value="">COUNTRY</option> */}
                                <AllCountriesList />
                            </select>
                        </div>
                    </Col>
                </Row>



            </Container>

            <nav aria-label="Page navigation example">
                <ul className="pagination pagination-lg">
                    <li className="page-item">
                        <a className="page-link disabled" onClick={this.handlePagePrev} aria-label="Previous" id='prev-page'>
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                    </li>
                    <li className="page-item"><a className="page-link active" id="active-page">1</a></li>
                    <p className='page-link disabled'> out of {Math.ceil(this.state.totalResults / 9) == 0 ? 1 : Math.ceil(this.state.totalResults / 9)} </p>
                    <li className="page-item">
                        <a className="page-link" onClick={this.handlePageNext} aria-label="Next" id='next-page'>
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
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
                            <Col key={auction.id} xs={12} md={6} xl={4}>
                                <div className="auctionItem my-5">
                                    <div className="options">
                                        <Card key={auction.id} className="shadow-lg card" >
                                            <Card.Img className='cardimg' variant="top" src={(auction.imgUrl != null) ? auction.imgUrl.split(",")[0] : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} style={{ objectFit: 'cover' }} />
                                            <Card.Body className="cardbod">
                                                <Card.Title className="card-title"><span className='title-text'>{auction.name}</span></Card.Title>
                                                <Card.Subtitle className="mb-3 text-muted">Auctioned By: <Button variant="secondary" className='userName' onClick={this.handleUserClick} >{auction.seller.user.username}</Button> ({auction.seller.rating}/5) <span className='votecount'> {auction.seller.rating_count} votes </span> </Card.Subtitle>
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
                                                        <a className='select-button w-100 btn btn-primary' href={`/auction/item/${auction.id}`} >
                                                            <strong>PRICE TO BEAT</strong><br />
                                                            <strong class="price">{auction.currently} €</strong>
                                                        </a>
                                                    </div>

                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            </Col>
                        ))
                }
            </Row >
            <br></br><br></br><br></br><br></br>
            <div className="footer">
                <p className='lead fw-light text-end'>by Konstantinos * (Gogas + Antzoulidis)</p>
            </div>
        </>
        )
    }


}
