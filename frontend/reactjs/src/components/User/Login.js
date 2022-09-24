import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/auth.service";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

import { Row, Col, Card, InputGroup } from "react-bootstrap";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                () => {
                    this.props.history.push("/");
                    window.location.reload();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Header>
                            Login
                        </Card.Header>
                        <Card.Body>
                            <Form
                                onSubmit={this.handleLogin}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                {this.state.message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="user-icon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                    <Input
                                        placeholder="Password"
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[required]}
                                        aria-label="username"
                                        aria-describedby="password-icon"
                                    />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="password-icon"><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required]}
                                        aria-label="password"
                                        aria-describedby="password-icon"
                                    />
                                </InputGroup>

                                <div className="form-group">
                                    <button
                                        className="btn btn-primary btn-block"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span><FontAwesomeIcon icon={faSignInAlt} /> Submit</span>
                                    </button>
                                </div>



                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />

                            </Form>
                        </Card.Body>
                        <Card.Footer>
                            <p>Don't have an account yet? <a href="/register">Register here</a></p>
                        </Card.Footer>

                    </Card>
                </Col>
            </Row>
        );
    }
}
