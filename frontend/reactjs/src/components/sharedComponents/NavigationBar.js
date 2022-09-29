import React from 'react';

import { Nav, Navbar, Container, Offcanvas, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuthService from "../../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../css/header.css';
import { faContactCard, faHouse, faMessage, faPeopleRoof, faSearch } from '@fortawesome/free-solid-svg-icons';


class NavigationBar extends React.Component {

  handleLogout() {


  }
  render() {

    const handleLogout = () => {
      AuthService.logout();
    };


    return (
      <>
        {[false].map((expand) => (
          <Navbar key={expand} bg="light" expand={expand} className="mb-3">
            <Container fluid className='shadow'>
              <Navbar.Brand href="/"><img className='logo_navbar' src={require('./../../media/logo/500x500.png')} alt="logo" /></Navbar.Brand>
              <div className='notification'>notification</div><Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}/>
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
                    <Nav.Link href="/"><FontAwesomeIcon icon={faHouse} />&nbsp;&nbsp;Home</Nav.Link>
                    {this.props.showAdminBoard && (
                      <Nav.Link href="/admin"><FontAwesomeIcon icon={faContactCard} />&nbsp;&nbsp;Admin Board</Nav.Link>
                    )}
                    {this.props.currentUser ? <Nav.Link href="/manage"><FontAwesomeIcon icon={faPeopleRoof} />&nbsp;&nbsp;My Auctions</Nav.Link> : null}
                    {this.props.currentUser ? <Nav.Link href="/chat"><FontAwesomeIcon icon={faMessage} />&nbsp;&nbsp;Messages</Nav.Link> : null}
                    <Nav.Link href="#"><br></br></Nav.Link>
                    <Nav.Link href="/auctions"><FontAwesomeIcon icon={faSearch} />&nbsp;&nbsp;Browse Auctions </Nav.Link>

                  </Nav>


                  {this.props.currentUser ? (
                    <Nav className="justify-content-end mt-5">

                      <Nav.Link href={`/user/${this.props.currentUser.username}`} className="text-danger text-decoration-underline">{this.props.currentUser.username}</Nav.Link>
                      <Nav.Link href="/login" className="text-danger text-decoration-underline" onClick={handleLogout}>Logout</Nav.Link>

                    </Nav>
                  ) : (

                    <Nav className="justify-content-end mt-5">
                      {/* <Link to={"/login"} className="nav-link">Admin Board</Link> */}

                      <Nav.Link href="/login" className="text-danger text-decoration-underline">Login</Nav.Link>
                      <Nav.Link href="/register" className="text-danger text-decoration-underline">Register</Nav.Link>

                    </Nav>


                  )}



                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        ))
        }
      </>
    );
  }
}

export default NavigationBar;