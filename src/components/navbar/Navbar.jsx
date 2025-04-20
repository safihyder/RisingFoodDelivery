import { useState, useEffect } from 'react';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import Modal from '../../Modal';
import Cart from '../../screens/cart/Cart';
import Badge from '@mui/material/Badge';
import AuthService from "../../appwrite/auth"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import AppwriteResService from '../../appwrite/config';
import AppwriteOrderService from '../../appwrite/orderconfig';
import deliveryPartnerService from '../../appwrite/deliveryPartnerConfig';
import axios from 'axios';
const Navbar = () => {
  const foodItems = useSelector(state => state.order.userorder)
  const [restaurant, setrestaurant] = useState(null)
  const [hasOrders, setHasOrders] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDeliveryPartner, setIsDeliveryPartner] = useState(false)
  const userData = useSelector(state => state.auth.userData)
  const [deliveryStatus, setDeliveryStatus] = useState({
    checking: true,
    available: false,
    message: "Checking delivery availability..."
  });

  useEffect(() => {
    // Check delivery availability based on geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude, position.coords.longitude)
          checkDeliveryAvailability(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setDeliveryStatus({
            checking: false,
            available: false,
            message: "Unable to determine your location."
          });
        }
      );
    } else {
      setDeliveryStatus({
        checking: false,
        available: false,
        message: "Geolocation is not supported by your browser."
      });
    }

    AppwriteResService.getRestaurants([Query.contains('userId', userData?.$id)])
      .then((restData) => {
        if (restData) {
          setrestaurant(restData.documents[0])
        }
      })

    if (userData && userData.$id) {
      AppwriteOrderService.getOrders([Query.equal('email', userData.email)])
        .then((orderData) => {
          if (orderData && orderData.documents.length > 0) {
            setHasOrders(true)
          } else {
            setHasOrders(false)
          }
        })
        .catch(error => {
          console.error("Error checking orders:", error)
          setHasOrders(false)
        })

      // Check if user is admin
      AuthService.isUserAdmin()
        .then(adminStatus => {
          setIsAdmin(adminStatus)
        })
        .catch(error => {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        })

      // Check if user is a delivery partner
      deliveryPartnerService.getDeliveryPartnerByUserId(userData.$id)
        .then(partner => {
          if (partner && partner.status === 'approved') {
            setIsDeliveryPartner(true)
          } else {
            setIsDeliveryPartner(false)
          }
        })
        .catch(error => {
          console.error("Error checking delivery partner status:", error)
          setIsDeliveryPartner(false)
        })
    }
  }, [userData, restaurant])

  const checkDeliveryAvailability = async (latitude, longitude) => {
    try {
      const response = await axios.post('https://680371d0883fafd90d19.fra.appwrite.run/check-delivery', {
        lat: latitude,
        lng: longitude
      });
      setDeliveryStatus({
        checking: false,
        available: response.data.allowed,
        message: response.data.message
      });
    } catch (error) {
      console.error("Error checking delivery availability:", error);

      let errorMessage = "Error checking delivery availability.";
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "Unable to connect to delivery service. Please check your internet connection.";
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status}`;
      }

      setDeliveryStatus({
        checking: false,
        available: false,
        message: errorMessage
      });
    }
  };

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
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center px-2 py-1 sm:px-4 sm:py-2 md:px-8 backdrop-blur-md bg-white/20 border-b border-white/10 shadow-lg">
        <Link to="/" className="transition-transform hover:scale-105">
          <div className="ml-0 sm:ml-2 md:ml-4">
            <img src="/Images/logo.png" alt="Food Delivery Logo" className="h-10 sm:h-12 w-auto" />
          </div>
        </Link>

        {/* Delivery Status Indicator */}
        <div className={`hidden md:flex items-center px-3 py-1 rounded-full text-sm font-medium ${deliveryStatus.checking
          ? 'bg-gray-200 text-gray-800'
          : deliveryStatus.available
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }`}>
          {deliveryStatus.checking ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
              Checking delivery...
            </div>
          ) : (
            <>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${deliveryStatus.available ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
              {deliveryStatus.message}
            </>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex items-center space-x-8 font-medium text-gray-800">
            {restaurant ? (
              <li>
                <Link
                  to={`/restaurants/${restaurant?.$id}`}
                  className="hover:text-orange-500 transition-colors"
                >
                  Your Restaurant
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to={`${authStatus ? "/addrestaurant" : "/loginuser"}`}
                  className="hover:text-orange-500 transition-colors"
                >
                  Add a Restaurant
                </Link>
              </li>
            )}

            {authStatus && hasOrders && (
              <li>
                <Link
                  to="/user-orders"
                  className="hover:text-orange-500 transition-colors"
                >
                  Your Orders
                </Link>
              </li>
            )}

            {authStatus && isDeliveryPartner && (
              <li>
                <Link
                  to="/delivery-partner-dashboard"
                  className="hover:text-orange-500 transition-colors font-semibold text-orange-600"
                >
                  Delivery Dashboard
                </Link>
              </li>
            )}

            {authStatus && !isDeliveryPartner && (
              <li>
                <Link
                  to="/delivery-partner-registration"
                  className="hover:text-orange-500 transition-colors"
                >
                  Become a Delivery Partner
                </Link>
              </li>
            )}

            {authStatus && isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="hover:text-orange-500 transition-colors font-semibold text-orange-600"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}

            {!authStatus && (
              <>
                <li>
                  <Link
                    to="/loginuser"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signupuser"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}

            {authStatus && (
              <li>
                <button
                  onClick={logoutHandler}
                  className="hover:text-orange-500 transition-colors font-medium"
                >
                  Logout
                </button>
              </li>
            )}

            <li>
              {authStatus && (
                <button
                  onClick={loadCart}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Cart
                  <Badge badgeContent={foodItems.length} color='error'>
                    <img src="/Images/cart.png" alt="" className="h-6 w-6" />
                  </Badge>
                </button>
              )}
              {cartView ? <Modal onClose={() => setCartView(false)}><Cart></Cart></Modal> : ""}
            </li>
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Burger Menu Button */}
          <button
            className="relative z-50 flex flex-col justify-center items-center w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`block h-0.5 w-5 sm:w-6 bg-gray-800 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}
            ></span>
            <span
              className={`block h-0.5 w-5 sm:w-6 bg-gray-800 transition-all duration-300 ease-in-out my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            ></span>
            <span
              className={`block h-0.5 w-5 sm:w-6 bg-gray-800 transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}
            ></span>
          </button>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}></div>
            <div
              className={`absolute right-0 top-0 h-screen w-64 bg-gradient-to-b from-red-600/90 to-orange-500/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-6 pt-20">
                {/* Mobile Delivery Status */}
                <div className={`mb-6 px-3 py-2 rounded-lg text-sm font-medium ${deliveryStatus.checking
                  ? 'bg-white/20 text-white'
                  : deliveryStatus.available
                    ? 'bg-green-500/30 text-white'
                    : 'bg-red-500/30 text-white'
                  }`}>
                  {deliveryStatus.checking ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Checking delivery...
                    </div>
                  ) : (
                    <>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${deliveryStatus.available ? 'bg-green-300' : 'bg-red-300'
                        }`}></span>
                      {deliveryStatus.message}
                    </>
                  )}
                </div>

                <ul className="flex flex-col space-y-6 font-medium text-white">
                  {restaurant ? (
                    <li>
                      <Link
                        to={`/restaurant/${restaurant?.$id}`}
                        className="block py-2 hover:text-yellow-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Your Restaurant
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        to={`${authStatus ? "/addrestaurant" : "/loginuser"}`}
                        className="block py-2 hover:text-yellow-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Add a Restaurant
                      </Link>
                    </li>
                  )}

                  {authStatus && hasOrders && (
                    <li>
                      <Link
                        to="/user-orders"
                        className="block py-2 hover:text-yellow-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Your Orders
                      </Link>
                    </li>
                  )}

                  {authStatus && isDeliveryPartner && (
                    <li>
                      <Link
                        to="/delivery-partner-dashboard"
                        className="block py-2 hover:text-yellow-300 transition-colors font-semibold"
                        onClick={() => setIsOpen(false)}
                      >
                        Delivery Dashboard
                      </Link>
                    </li>
                  )}

                  {authStatus && !isDeliveryPartner && (
                    <li>
                      <Link
                        to="/delivery-partner-registration"
                        className="block py-2 hover:text-yellow-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Become a Delivery Partner
                      </Link>
                    </li>
                  )}

                  {authStatus && isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="block py-2 hover:text-yellow-300 transition-colors font-semibold"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}

                  {!authStatus && (
                    <>
                      <li>
                        <Link
                          to="/loginuser"
                          className="block py-2 hover:text-yellow-300 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signupuser"
                          className="block py-2 hover:text-yellow-300 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Signup
                        </Link>
                      </li>
                    </>
                  )}

                  {authStatus && (
                    <li>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logoutHandler();
                        }}
                        className="block w-full text-left py-2 hover:text-yellow-300 transition-colors"
                      >
                        Logout
                      </button>
                    </li>
                  )}

                  <li>
                    {authStatus && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          loadCart();
                        }}
                        className="block w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Cart</span>
                        <Badge badgeContent={foodItems.length} color="error">
                          <img src="/Images/cart-white.png" alt="Cart" className="h-5 w-5" />
                        </Badge>
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
