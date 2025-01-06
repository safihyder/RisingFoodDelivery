import { useState, useEffect } from 'react';
import "./Navbar.css";
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import Modal from '../../Modal';
import Cart from '../../screens/cart/Cart';
import Badge from '@mui/material/Badge';
import AuthService from "../../appwrite/auth"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import AppwriteResService from '../../appwrite/config';

// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
const Navbar = () => {
  const foodItems = useSelector(state => state.order.userorder)
  const [restaurant, setrestaurant] = useState(null)
  const userData = useSelector(state => state.auth.userData)
  useEffect(() => {
    AppwriteResService.getRestaurants([Query.contains('userId', userData?.$id)])
      .then((restData) => {
        if (restData) {
          setrestaurant(restData.documents[0])
        }
      })
  }, [userData, restaurant])
  const authStatus = useSelector((state) => state.auth.status)
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [cartView, setCartView] = useState(false)
  const loadCart = () => {
    setCartView(true)
  }
  const logoutHandler = async () => {
    await AuthService.logout();
    dispatch(logout())
  }
  return (
    <div>
      <nav className="navbar" >
        <Link to="/">
          <div className="logo">
            <img src="/Images/logo.png" alt="Food Delivery Logo" />
          </div>
        </Link>
        <div>
          <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
            {restaurant ? <li><Link to={`/restaurant/${restaurant?.$id}`}>Your Restaurant</Link></li>
              :
              <li><Link to={`${authStatus ? "/addrestaurant" : "/loginuser"}`}>Add a Restaurant</Link></li>}
            {!authStatus && <li><Link to="/loginuser">Login</Link></li>}
            {!authStatus && <li><Link to="/signupuser">Signup</Link></li>}
            {authStatus && <li onClick={logoutHandler}>Logout</li>}
            {/* Add more links as needed */}
            <li className="cta-button">
              {/* <a href="#order-now">Cart <img src="/Images/cart.png" alt="" /></a>  */}
              {authStatus && <button onClick={loadCart}>Cart &nbsp;    <Badge badgeContent={foodItems.length} color='error'>
                <img src="/Images/cart.png" alt="" />
              </Badge> </button>}
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