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
                console.log(data);
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
                            console.log(usersEdited[i].username + " YES");
                        }
                        else {
                            console.log(usersEdited[i].username + " NO");
                        }

                    }
                    console.log(usersEdited);
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

            console.log(auctions.data);



            var e = document.getElementById("typeOptions");
            var type = e.value;


            if (type === 'JSON') {
                const jsonString = `data:text/json;chatset=utf-8,
                    ${JSON.stringify(auctions, null, 2)}
                }`;
                console.log(jsonString);

                const link = document.createElement("a");
                link.href = jsonString;
                link.download = "auctions.json";

                link.click();

                this.setState({
                    successful: true,
                    message: "Downloaded Auctions as a JSON file"
                })
            };

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
