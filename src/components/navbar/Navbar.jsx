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
    <div className="sticky top-0 z-50">
      <nav className="navbar backdrop-blur-md bg-white/30 shadow-lg">
        <Link to="/" className="transition-transform hover:scale-105">
          <div className="logo">
            <img src="/Images/logo.png" alt="Food Delivery Logo" className="h-12 w-auto" />
          </div>
        </Link>
        <div>
          <ul className={`nav-links ${isOpen ? 'open' : ''} font-medium text-gray-800`}>
            {restaurant ? 
              <li className="hover:text-orange-500 transition-colors">
                <Link to={`/restaurant/${restaurant?.$id}`}>Your Restaurant</Link>
              </li>
              :
              <li className="hover:text-orange-500 transition-colors">
                <Link to={`${authStatus ? "/addrestaurant" : "/loginuser"}`}>Add a Restaurant</Link>
              </li>
            }
            {!authStatus && 
              <li className="hover:text-orange-500 transition-colors">
                <Link to="/loginuser">Login</Link>
              </li>
            }
            {!authStatus && 
              <li className="hover:text-orange-500 transition-colors">
                <Link to="/signupuser">Signup</Link>
              </li>
            }
            {authStatus && 
              <li className="hover:text-orange-500 transition-colors cursor-pointer" onClick={logoutHandler}>
                Logout
              </li>
            }
            <li className="cta-button">
              {authStatus && 
                <button 
                  onClick={loadCart}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Cart
                  <Badge badgeContent={foodItems.length} color='error'>
                    <img src="/Images/cart.png" alt="" className="h-6 w-6" />
                  </Badge>
                </button>
              }
              {cartView ? <Modal onClose={() => setCartView(false)}><Cart></Cart></Modal> : ""}
            </li>
          </ul>
        </div>
        <div 
          className={`burger ${isOpen ? 'open' : ''} z-50`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="line1 bg-gray-800"></div>
          <div className="line2 bg-gray-800"></div>
          <div className="line3 bg-gray-800"></div>
        </div>
      </nav>
    </div>
  )
}
export default Navbar
