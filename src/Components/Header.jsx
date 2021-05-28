import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <Navbar id='site-head'>
            <Nav>
                <NavLink to='/shop' className='header-link'>
                    Магазини
                </NavLink>
            </Nav>
            <Nav>
                <NavLink to='/product' className='header-link'>
                    Товари
                </NavLink>
            </Nav>
        </Navbar>
    )
}

export default Header;