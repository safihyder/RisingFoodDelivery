import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from "../../appwrite/auth";
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';

const SignupUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      // Calculate password strength
      let strength = 0;
      if (value.length >= 8) strength += 0.25;
      if (value.match(/[A-Z]/)) strength += 0.25;
      if (value.match(/[0-9]/)) strength += 0.25;
      if (value.match(/[^A-Za-z0-9]/)) strength += 0.25;
      setPasswordStrength(strength);
    }
  };

  useEffect(() => {
    if (formError || formSuccess) {
      const timer = setTimeout(() => {
        setFormError('');
        setFormSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formError, formSuccess]);

  useEffect(() => {
    if (showAddressModal) {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB1ocpr-b2TRmAjqoMWdKnRZobxBUyvvxU&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [showAddressModal]);

  const initMap = () => {
    const mapOptions = {
      center: { lat: 37.4221, lng: -122.0841 },
      zoom: 11,
      mapId: 'DEMO_MAP_ID'
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    const marker = new window.google.maps.Marker({
      map: map,
      draggable: true
    });

    markerRef.current = marker;

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('address-input'),
      { types: ['address'] }
    );

    autocompleteRef.current = autocomplete;
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert(`No details available for input: '${place.name}'`);
        return;
      }

      // Set marker position
      if (place.geometry.location) {
        map.setCenter(place.geometry.location);
        marker.setPosition(place.geometry.location);
      } else {
        marker.setPosition(null);
      }

      // Fill in address form fields
      fillInAddress(place);
    });
  };

  const fillInAddress = (place) => {
    const addressComponents = {
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      postal_code: '',
      country: ''
    };

    // Get each component of the address from the place details
    for (const component of place.address_components || []) {
      const type = component.types[0];
      if (type in addressComponents) {
        addressComponents[type] = component.long_name;
      }
    }

    // Update form data
    setFormData({
      ...formData,
      address: `${addressComponents.street_number} ${addressComponents.route}`.trim(),
      city: addressComponents.locality,
      state: addressComponents.administrative_area_level_1,
      zipCode: addressComponents.postal_code,
      country: addressComponents.country
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    if (formData.password !== formData.cpassword) {
      setFormError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = await AuthService.createAccount(formData.name, formData.email, formData.password);
      if (userData) {
        setFormSuccess('Account created successfully! Logging you in...');
        dispatch(login({ userData }));
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Signup Error:', error);
      setFormError(error.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 2px #ff6b6b",
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 1px #ddd",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 5px 15px rgba(211, 47, 47, 0.3)"
    },
    tap: { scale: 0.98 },
    disabled: {
      opacity: 0.7,
      cursor: "not-allowed"
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const handleAddressSelection = () => {
    setShowAddressModal(true);
  };

  const confirmAddress = () => {
    setShowAddressModal(false);
  };

  return (
    <>
      <motion.div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-orange-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-8 py-12">
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <img src="/Images/logo.png" alt="" className="h-16 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Sign Up for Rising
              </h2>
            </motion.div>

            <AnimatePresence>
              {(formError || formSuccess) && (
                <motion.div
                  className={`mb-6 p-4 rounded-lg text-center ${formError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {formError || formSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <motion.label
                    htmlFor="name"
                    className="block text-sm font-medium"
                    animate={{ color: focusedField === 'name' ? '#d32f2f' : '#374151' }}
                  >
                    Full Name<span className="text-red-500 ml-1">*</span>
                  </motion.label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    variants={inputVariants}
                    animate={focusedField === 'name' ? 'focused' : 'unfocused'}
                  />
                </div>

                <div>
                  <motion.label
                    htmlFor="email"
                    className="block text-sm font-medium"
                    animate={{ color: focusedField === 'email' ? '#d32f2f' : '#374151' }}
                  >
                    Email<span className="text-red-500 ml-1">*</span>
                  </motion.label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    variants={inputVariants}
                    animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                  />
                </div>
              </div>

              {/* Address field that opens the modal */}
              <div>
                <motion.label
                  htmlFor="address-display"
                  className="block text-sm font-medium"
                  animate={{ color: focusedField === 'address-display' ? '#d32f2f' : '#374151' }}
                >
                  Address<span className="text-red-500 ml-1">*</span>
                </motion.label>
                <div className="flex gap-3">
                  <motion.input
                    type="text"
                    id="address-display"
                    readOnly
                    value={formData.address ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`.replace(/^, |, ,|, $/, '') : ''}
                    placeholder="Click to add your address"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer bg-gray-50"
                    onClick={handleAddressSelection}
                  />
                  <motion.button
                    type="button"
                    onClick={handleAddressSelection}
                    className="mt-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <motion.label
                    htmlFor="password"
                    className="block text-sm font-medium"
                    animate={{ color: focusedField === 'password' ? '#d32f2f' : '#374151' }}
                  >
                    Password<span className="text-red-500 ml-1">*</span>
                  </motion.label>
                  <motion.input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    variants={inputVariants}
                    animate={focusedField === 'password' ? 'focused' : 'unfocused'}
                  />
                  {passwordStrength > 0 && (
                    <div className="mt-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${passwordStrength <= 0.25
                            ? 'bg-red-500' : passwordStrength <= 0.5
                              ? 'bg-orange-500' : passwordStrength <= 0.75
                                ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${passwordStrength * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1 text-gray-500">
                        {passwordStrength <= 0.25
                          ? 'Weak'
                          : passwordStrength <= 0.5
                            ? 'Fair'
                            : passwordStrength <= 0.75
                              ? 'Good'
                              : 'Strong'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <motion.label
                    htmlFor="cpassword"
                    className="block text-sm font-medium"
                    animate={{ color: focusedField === 'cpassword' ? '#d32f2f' : '#374151' }}
                  >
                    Confirm Password<span className="text-red-500 ml-1">*</span>
                  </motion.label>
                  <motion.input
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    value={formData.cpassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('cpassword')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    variants={inputVariants}
                    animate={focusedField === 'cpassword' ? 'focused' : 'unfocused'}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                animate={isSubmitting ? "disabled" : ""}
              >
                {isSubmitting ? (
                  <>
                    <motion.svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </motion.svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Sign Up'
                )}
              </motion.button>
            </form>

            <motion.p
              className="mt-6 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{' '}
              <motion.span whileHover={{ color: '#ff4b4b' }}>
                <Link to="/loginuser" className="font-medium text-red-600 hover:text-red-500">
                  Login
                </Link>
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Address Selection Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Address Selection</h3>
                </div>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row h-[500px]">
                {/* Address form panel */}
                <div className="p-6 flex flex-col space-y-4 w-full md:w-2/5 bg-white">
                  <input
                    type="text"
                    id="address-input"
                    className="border-b border-gray-300 p-2 focus:border-red-500 focus:outline-none"
                    placeholder="Enter your address"
                  />

                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 focus:border-red-500 focus:outline-none"
                    placeholder="Apt, Suite, etc (optional)"
                  />

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 focus:border-red-500 focus:outline-none"
                    placeholder="City"
                  />

                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="border-b border-gray-300 p-2 focus:border-red-500 focus:outline-none w-1/2"
                      placeholder="State/Province"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="border-b border-gray-300 p-2 focus:border-red-500 focus:outline-none w-1/2"
                      placeholder="Zip/Postal code"
                    />
                  </div>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border-b border-gray-300 p-2 focus:border-red-500 focus:outline-none"
                    placeholder="Country"
                  />

                  <div className="mt-auto">
                    <motion.button
                      onClick={confirmAddress}
                      className="w-full py-3 px-4 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Confirm Address
                    </motion.button>
                  </div>
                </div>

                {/* Map panel */}
                <div className="h-full w-full md:w-3/5 bg-gray-100" ref={mapRef}></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignupUser;
