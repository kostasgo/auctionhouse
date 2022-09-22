import React from 'react';

import { Nav, Navbar, Container, Offcanvas, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuthService from "../../services/auth.service";

import '../../css/header.css';


class NavigationBar extends React.Component {

  handleLogout() {


  }
  render() {

    const handleLogout = () => {
      console.log("logging");
      AuthService.logout();
    };


    return (
      <>
        {[false].map((expand) => (
          <Navbar key={expand} bg="transparent" expand={expand} className="mb-3">
            <Container fluid>
              <Navbar.Brand href="#"><img className='logo_navbar' src={require('./../../media/logo/500x500.png')} alt="logo" /></Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    <img className='logo_navbar' src={require('./../../media/logo/500x500.png')} alt="logo" />
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="#action1">Home</Nav.Link>
                    <Nav.Link href="/auctions">Auctions</Nav.Link>
                  </Nav>
                  <Form className="d-flex">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                  </Form>

                  {this.props.currentUser ? (
                    <Nav className="justify-content-end mt-5">


                      <Nav.Link href="/profile" className="text-danger text-decoration-underline">{this.props.currentUser.username}</Nav.Link>
                      <Nav.Link href="/login" className="text-danger text-decoration-underline" onClick={handleLogout}>Logout</Nav.Link>

                    </Nav>
                  ) : (

                    <Nav className="justify-content-end mt-5">
                      <Link to={"/login"} className="nav-link">Admin Board</Link>

                      <Nav.Link href="/login" className="text-danger text-decoration-underline">Login</Nav.Link>
                      <Nav.Link href="/register" className="text-danger text-decoration-underline">Register</Nav.Link>

                    </Nav>


                  )}



                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        ))}
      </>
    );
  }
}

export default NavigationBar;