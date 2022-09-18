import React, { Component } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import axios from 'axios'

export default class AuctionsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auctions: []
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/v1/auctions")
            .then(response => response.data)
            .then((data) => {
                this.setState({ auctions: data });
            });
    }

    render() {
        return (
            <>
                <Row>
                    {
                        this.state.auctions.length === 0 ?
                            <h3>0 Auctions Available</h3>
                            :

                            this.state.auctions.map((auction) => (
                                <Col xs={12} md={6} xl={4}>
                                    <div className="auctionItem">
                                        <Card key={auction.id}>
                                            <Card.Img variant="top" src={auction.imgUrl} style={{ objectFit: 'cover', maxHeight: '350px' }} />
                                            <Card.Body>
                                                <Card.Title className="text-left">{auction.name}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">Auctioned By: {auction.seller.user.username} ({auction.seller.rating}/5)</Card.Subtitle>
                                                <Card.Text className="text-left">
                                                    {auction.description}
                                                </Card.Text>
                                                <Button variant="primary">Go somewhere</Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Col>
                            ))
                    }
                </Row >
            </>
        )
    }
}
