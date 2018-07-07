import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import github from './images/github.png'

class Header extends React.Component {
  render() {
    return (
      <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#home">TONE CLOUD</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem eventKey={1} href="https://github.com/hadrienj/toneCloud">
          <img src={github} alt="Logo" width='30' />
        </NavItem>
      </Nav>
    </Navbar>
    );
  }
}

export default Header;