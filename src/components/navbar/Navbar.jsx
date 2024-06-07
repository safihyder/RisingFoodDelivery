import React, { useState } from 'react';
import "./Navbar.css";
import { Link } from 'react-router-dom';
import Modal from '../../Modal';
import Cart from '../../screens/cart/Cart';
// import Badge from "@material-ui/core/Badge";
// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartView, setCartView] = useState(false)
  const loadCart = () => {
    setCartView(true)
}
  return (
    <div>
      <nav className="navbar" style={{position:props.position}}>
      <Link to="/">
        <div className="logo">
        <img src="Images/logo.png" alt="Food Delivery Logo" />
      </div>
        </Link>
    <div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/addrestaurant">Add a Restaurant</Link></li>
        <li><Link to="/loginuser">Login</Link></li>
        <li><Link to="/signupuser">Signup</Link></li>
        <li><Link to="/logout">Logout</Link></li>
        {/* Add more links as needed */}
        <li className="cta-button">
          {/* <a href="#order-now">Cart <img src="/Images/cart.png" alt="" /></a>  */}
          <button  onClick={loadCart}>Cart &nbsp; <img src="/Images/cart.png" alt="" /></button>
          {cartView ? <Modal onClose={() => setCartView(false)}><Cart></Cart></Modal> : ""}
        </li>
      </ul>
    </div>
      <div className={`burger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
    </div>
  )
}

export default Navbar