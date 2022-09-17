import React from 'react';

import {Navbar, Container} from 'react-bootstrap';

class NavigationBar extends React.Component{
    render() {
      return (
        <Navbar bg="transparent" variant="dark">
            <Container>
                <div>
                    NavigationBar
                </div>
            </Container>
        </Navbar>
      );
    }
}

export default NavigationBar;