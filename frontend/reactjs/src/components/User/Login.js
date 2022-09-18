import React, { Component } from 'react'
import { Row, Col, Card, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    initialState = {
        username: '',
        password: ''
    }

    render() {

        const { username, password } = this.state;
        return (
            <Row className="justify-content-center">
                <Col xs={4}>
                    <Card>
                        <Card.Header>
                            Login
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="username-icon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        name="username"
                                        type="text"
                                        value={username}
                                        placeholder="Username"
                                        aria-label="Username"
                                        aria-describedby="username-icon"
                                    />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="password-icon"><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        name="password"
                                        type="password"
                                        value={password}
                                        placeholder="Password"
                                        aria-label="Password"
                                        aria-describedby="password-icon"
                                    />
                                </InputGroup>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>

                    </Card>
                </Col>
            </Row>
        )
    }
}

