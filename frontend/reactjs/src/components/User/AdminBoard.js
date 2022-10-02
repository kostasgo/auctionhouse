import React, { Component } from 'react'
import { Table, Row, Col, Button } from 'react-bootstrap'

import AuctionService from '../../services/auction.service';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import EventBus from '../../common/EventBus';

import { Redirect } from 'react-router-dom';



export default class AdminBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            message: "",
            successful: false,
            redirect: null,
            currentUser: null,
            allAuctions: [],
            loading: false
        };
    }

    componentDidMount() {
        UserService.getAdminBoard()
            .then(response => response.data)
            .then((data) => {
                this.setState({ users: data });
            },
                error => {
                    this.setState({
                        message:
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString(),
                        successful: false
                    });

                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("logout");
                    }
                }
            );
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) this.setState({ redirect: "/" });
        this.setState({ currentUser: currentUser })

    }



    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const handleEnable = (username) => {
            this.setState({
                successful: false,
                message: ""
            })
            UserService.enable(username).then(
                response => {
                    var usersEdited = this.state.users;
                    for (var i = 0, l = usersEdited.length; i < l; i++) {
                        if (usersEdited[i].id === response.data.id) {
                            usersEdited[i] = response.data;
                            // console.log(usersEdited[i].username + " YES");
                        }
                        else {
                            // console.log(usersEdited[i].username + " NO");
                        }

                    }
                    this.setState({
                        users: usersEdited,
                        message: "User successfully enabled!",
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
        };

        const exportAuctions = async () => {
            this.setState({
                loading: true,
                successful: false,
                message: ""
            })
            const auctions = await AuctionService.getAllAuctions();




            var e = document.getElementById("typeOptions");
            var type = e.value;


            if (type === 'JSON') {
                const jsonString = `data:text/json;chatset=utf-8,
                    ${JSON.stringify(auctions.data, null, 2)}
                }`;
                // console.log(jsonString);

                const link = document.createElement("a");
                link.href = jsonString;
                link.download = "auctions.json";

                link.click();

                this.setState({
                    successful: true,
                    message: "Downloaded Auctions as a JSON file"
                })
            }
            else {
                // console.log(JSON.stringify(auctions))
                var xml = '<Items>';
                auctions.data.forEach(
                    (auction) => {
                        xml += '<Item ItemId="' + auction.id + '">\n';
                        xml += '<Name>';
                        xml += '<![CDATA[' + auction.name + ']]>';
                        xml += '</Name>\n';
                        auction.categories.forEach(
                            (category) => {
                                xml += '<Category>';
                                xml += '<![CDATA[' + category.name + ']]>';

                                xml += '</Category>\n';
                            }
                        )
                        xml += '<Currently>';
                        xml += '$' + auction.currently;
                        xml += '</Currently>\n';
                        xml += '<Buy_Price>';
                        xml += '$' + auction.buyPrice;
                        xml += '</Buy_Price>\n';
                        xml += '<First_Bid>';
                        xml += '$' + auction.firstBid;
                        xml += '</First_Bid>\n';
                        xml += '<Number_of_Bids>';
                        xml += auction.numberOfBids;
                        xml += '</Number_of_Bids>\n';
                        if (auction.numberOfBids == 0) {
                            xml += '<Bids/>\n';
                        }
                        else {
                            xml += '<Bids>';
                            auction.bids.forEach(
                                (bid) => {
                                    xml += '<Bid>';
                                    xml += '<Bidder Rating="' + bid.bidder.rating + '" UserId="' + bid.bidder.user.username + '">\n';
                                    xml += '<Location>';
                                    xml += bid.bidder.user.location;
                                    xml += '</Location>\n';
                                    xml += '<Country>';
                                    xml += bid.bidder.user.country;
                                    xml += '</Country>\n';
                                    xml += '<Time>';
                                    xml += '<![CDATA[' + auction.time + ']]>';
                                    xml += '</Time>\n';
                                    xml += '</Bidder>\n';
                                    xml += '<Amount>';
                                    xml += '$' + auction.amount;
                                    xml += '</Amount>\n';
                                    xml += '</Bid>\n';
                                }
                            )
                            xml += '</Bids>\n';
                        }
                        xml += '<Location' + ((auction.longitude && auction.latitude) ? ' Latitude="' + auction.latitude + '" Longitude="' + auction.longitude + '"' : '') + '>';
                        xml += '<![CDATA[' + auction.location + ']]>';
                        xml += '</Location>\n';
                        xml += '<Country>';
                        xml += auction.country;
                        xml += '</Country>\n';
                        xml += '<Started>';
                        xml += '<![CDATA[' + auction.started + ']]>';
                        xml += '</Started>\n';
                        xml += '<Ends>';
                        xml += '<![CDATA[' + auction.ends + ']]>';
                        xml += '</Ends>\n';
                        xml += '<Seller Rating="' + auction.seller.rating + '" UserId="' + auction.seller.user.username + '"/>';
                        xml += '<Description>';
                        xml += '<![CDATA[' + auction.description + ']]>';
                        xml += '</Description>\n';
                        xml += '</Item>\n';
                    }
                )
                xml += '</Items>'

                const xmlStr = ('data:Application/octet-stream,' + encodeURIComponent(xml));
                const link = document.createElement("a");
                link.href = xmlStr;
                link.download = "auctions.xml";
                link.click();

                this.setState({
                    successful: true,
                    message: "Downloaded Auctions as an XML file"
                })
                //const data = auctions;   //dataForXml
                //const fileName = "auctions";
                //let fields = [];  //fieldsAsObjects or fieldsAsStrings, empty list means "use all"
                //const exportType = 'xml';
                //exportFromJSON({ data, fileName, fields, exportType });
            }

            this.setState({
                loading: false
            })
        }


        return (

            <>
                <Row>

                    <Col md={2}>
                        Export Auctions:
                        <select id="typeOptions">
                            <option value="JSON">JSON</option>
                            <option value="XML">XML</option>

                        </select>
                        <Button onClick={exportAuctions} disabled={this.state.loading}> Submit</Button>
                        {this.state.loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col md={3}>
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
                    </Col>
                </Row>
                <div className="my-3">
                    <h1>User List</h1>
                </div>
                <Table striped="columns" bordered variant="primary">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Country</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.length === 0 ?
                                <tr>
                                    <td>0 Users Available</td>
                                </tr>
                                :

                                this.state.users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.location}</td>
                                        <td>{user.country}</td>
                                        {user.roles.length > 1 ?
                                            <td>ADMIN</td>
                                            :
                                            <td>USER</td>

                                        }
                                        <td>
                                            {user.enabled ? (
                                                <span className="text-success">Enabled</span>
                                            ) : (
                                                <a href="#" className="text-decoration-underline" onClick={() => handleEnable(user.username)}>Enable</a>
                                            )
                                            }</td>
                                    </tr>
                                ))
                        }

                    </tbody>
                </Table>

            </>
        )
    }
}
