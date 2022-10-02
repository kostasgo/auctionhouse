import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEnvelope, faGlobe, faSignature, faPhone, faLocationPin, faKey, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import { Row, Col, Card, InputGroup } from "react-bootstrap";
import AllCountriesList from "../sharedComponents/AllCountriesList";
const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                This field is required!
            </div>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                This is not a valid email.
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

const vphone = value => {
    if (value.length !== 10 || !(/^\d+$/.test(value))) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                Phone Number must consist of 10 digits.
            </div>
        );
    }
}

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger m-0" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeCountry = this.onChangeCountry.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeRoles = this.onChangeRoles.bind(this);

        this.state = {
            username: "",
            name: "",
            email: "",
            role: [],
            password: "",
            phone: "",
            country: "",
            location: "",
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

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
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
        if (e.target.value === "admin") {
            this.setState({
                role: ["user", "admin"]
            });

        }
        else if (e.target.value === "user") {
            this.setState({
                role: ["user"]
            });
        }
        else {
            this.setState({
                role: []
            });
        }
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.username,
                this.state.name,
                this.state.email,
                this.state.role,
                this.state.password,
                this.state.phone,
                this.state.country,
                this.state.location
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
        const setGuest = () => {
            AuthService.setGuest();
        };
        return (
            <Row className="justify-content-center">
                <Col lg={6}>
                    <Card>
                        <Card.Header>
                            Register
                        </Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.handleRegister}
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

                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="signature-icon"><FontAwesomeIcon icon={faSignature} /></InputGroup.Text>
                                            <Input
                                                placeholder="Full Name"
                                                type="text"
                                                className="form-control register-input"
                                                name="name"
                                                value={this.state.name}
                                                onChange={this.onChangeName}
                                                validations={[required]}
                                                aria-label="name"
                                                aria-describedby="signature-icon"
                                            />
                                        </InputGroup>


                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="mail-icon"><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
                                            <Input
                                                placeholder="E-mail"
                                                type="text"
                                                className="form-control register-input"
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.onChangeEmail}
                                                validations={[required, email]}
                                                aria-label="email"
                                                aria-describedby="mail-icon"
                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="phone-icon"><FontAwesomeIcon icon={faPhone} /></InputGroup.Text>
                                            <Input
                                                placeholder="Phone"
                                                type="text"
                                                className="form-control register-input"
                                                name="phone"
                                                value={this.state.phone}
                                                onChange={this.onChangePhone}
                                                validations={[required, vphone]}
                                                aria-label="phone"
                                                aria-describedby="phone-icon"
                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="password-icon"><FontAwesomeIcon icon={faGlobe} /></InputGroup.Text>

                                            <select
                                                className="form-select"
                                                onChange={this.onChangeCountry}
                                                aria-label="country"
                                                aria-describedby="password-icon"
                                            >
                                                <AllCountriesList />
                                            </select>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="location-icon"><FontAwesomeIcon icon={faLocationPin} /></InputGroup.Text>
                                            <Input
                                                placeholder="Address"
                                                type="text"
                                                className="form-control register-input"
                                                name="name"
                                                value={this.state.location}
                                                onChange={this.onChangeLocation}
                                                validations={[required]}
                                                aria-label="address"
                                                aria-describedby="location-icon"
                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="user-icon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                            <Input
                                                placeholder="Username"
                                                type="text"
                                                className="form-control register-input"
                                                name="username"
                                                value={this.state.username}
                                                onChange={this.onChangeUsername}
                                                validations={[required, vusername]}
                                                aria-label="username"
                                                aria-describedby="user-icon"
                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="password-icon"><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                                            <Input
                                                type="password"
                                                className="form-control register-input"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.onChangePassword}
                                                validations={[required, vpassword]}
                                                aria-label="password"
                                                aria-describedby="password-icon"

                                            />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="key-icon"><FontAwesomeIcon icon={faKey} /></InputGroup.Text>

                                            <select
                                                className="form-select"
                                                onChange={this.onChangeRoles}
                                                validations={[required]}
                                                aria-label="role"
                                                aria-describedby="password-icon"
                                            >
                                                <option>Role</option>
                                                <option value="admin">ADMIN</option>
                                                <option value="user">USER</option>
                                            </select>
                                        </InputGroup>

                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block"><FontAwesomeIcon icon={faSignInAlt} /> Submit</button>
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
                            {this.state.message && this.state.successful && (
                                <p>We will contact you when your account is activated by an administrator.</p>
                            )}
                            {this.state.message && !this.state.successful && (
                                <p>Please try again.</p>
                            )}
                            {!this.state.message && !this.state.successful && (
                                <p>Already have an account? You can <a href="/login">Login here</a>. Otherwise, <a href="/auctions" onClick={setGuest}>continue as guest</a>.</p>
                            )}
                        </Card.Footer>

                    </Card>
                </Col>
            </Row>

        );
    }
}

