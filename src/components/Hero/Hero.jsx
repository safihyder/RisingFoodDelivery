import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { getCurrentPosition, forceLocationPermissionPrompt } from '../../utils/PermissionManager';

const Hero = () => {
    const [deliveryStatus, setDeliveryStatus] = useState({
        checking: true,
        available: false,
        message: "Checking delivery availability...",
        locationName: ""
    });
    const [animateLocation, setAnimateLocation] = useState(false);

    useEffect(() => {
        // Check delivery location on component mount
        checkDeliveryLocation();

        // Animate location ping every 3 seconds
        const animationInterval = setInterval(() => {
            setAnimateLocation(true);
            setTimeout(() => setAnimateLocation(false), 1000);
        }, 3000);

        return () => clearInterval(animationInterval);
    }, []);

    const checkDeliveryLocation = async () => {
        // Check if running on a Capacitor native platform
        const isNativePlatform = Capacitor.isNativePlatform();
        console.log('Is native platform:', isNativePlatform);

        try {
            setDeliveryStatus(prev => ({
                ...prev,
                checking: true
            }));

            let position;

            if (isNativePlatform) {
                // Use our new utility function to get position on native platforms
                console.log('Attempting to use Capacitor Geolocation');
                position = await getCurrentPosition();

                if (!position) {
                    console.log('Position not available');
                    setDeliveryStatus({
                        ...deliveryStatus,
                        checking: false,
                        available: false,
                        message: "Location permission needed"
                    });
                    return;
                }

                // Process the location data
                await processLocationData(position.coords.latitude, position.coords.longitude);
            } else {
                // Using browser geolocation for web
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            processLocationData(position.coords.latitude, position.coords.longitude);
                        },
                        (error) => {
                            console.error("Geolocation error:", error);
                            setDeliveryStatus({
                                ...deliveryStatus,
                                checking: false,
                                available: false,
                                message: "Location unavailable"
                            });
                        }
                    );
                } else {
                    setDeliveryStatus({
                        ...deliveryStatus,
                        checking: false,
                        available: false,
                        message: "Location not supported"
                    });
                }
            }
        } catch (error) {
            console.error("Error in location detection:", error);

            // Fallback to browser geolocation if Capacitor fails
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        processLocationData(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.error("Geolocation fallback error:", error);
                        setDeliveryStatus({
                            ...deliveryStatus,
                            checking: false,
                            available: false,
                            message: "Unable to determine location"
                        });
                    }
                );
            } else {
                setDeliveryStatus({
                    ...deliveryStatus,
                    checking: false,
                    available: false,
                    message: "Location services unavailable"
                });
            }
        }
    };

    const processLocationData = async (latitude, longitude) => {
        // Try to get address from coordinates for better UX
        try {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const geoData = await geoResponse.json();

            let locationName = "";
            if (geoData && geoData.address) {
                const address = geoData.address;
                locationName = address.city || address.town || address.village || address.suburb || "";
            }

            setDeliveryStatus(prev => ({
                ...prev,
                locationName
            }));
        } catch (error) {
            console.error("Error fetching location name:", error);
        }

        checkDeliveryAvailability(latitude, longitude);
    };

    const checkDeliveryAvailability = async (latitude, longitude) => {
        try {
            const response = await axios.post('https://680371d0883fafd90d19.fra.appwrite.run/check-delivery', {
                lat: latitude,
                lng: longitude
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setDeliveryStatus({
                ...deliveryStatus,
                checking: false,
                available: response.data.allowed,
                message: response.data.message
            });
        } catch (error) {
            console.error("Error checking delivery availability:", error);

            let errorMessage = "Delivery check unavailable";
            if (error.code === 'ERR_NETWORK') {
                errorMessage = "Connection issue";
            } else if (error.response) {
                errorMessage = `Service error`;
            }

            setDeliveryStatus({
                ...deliveryStatus,
                checking: false,
                available: false,
                message: errorMessage
            });
        }
    };

    const requestLocationPermission = async () => {
        setDeliveryStatus(prev => ({
            ...prev,
            checking: true,
            message: "Requesting location permission..."
        }));

        try {
            await forceLocationPermissionPrompt();
            // After permission is requested, check delivery location
            checkDeliveryLocation();
        } catch (error) {
            console.error("Error requesting permission:", error);
            setDeliveryStatus(prev => ({
                ...prev,
                checking: false,
                message: "Could not request permission"
            }));
        }
    };

    return (
        <div className="hero-container bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-16 md:py-24 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white order-2 lg:order-1">
                        <div className="inline-block px-3 py-1 bg-yellow-400 text-red-700 rounded-md font-semibold text-sm mb-6 shadow-lg">
                            INTRODUCING RISING DELIVERY
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Business Food <br />
                            <span className="text-yellow-300 drop-shadow-md">Delivery Platform</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-lg text-white/90">
                            Streamline your restaurant operations with our enterprise-grade food delivery platform.
                            Increase revenue, reduce costs, and delight your customers.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/restaurants"
                                className="inline-block bg-white text-red-600 font-semibold px-8 py-4 rounded-md shadow-xl hover:bg-yellow-300 hover:text-red-700 transition duration-300"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/about-us"
                                className="inline-block bg-transparent text-white font-semibold px-8 py-4 rounded-md border-2 border-white hover:bg-white/10 transition duration-300"
                            >
                                Learn More
                            </Link>
                        </div>
                        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white">Enterprise-grade security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white">24/7 Customer support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-white">Real-time analytics</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                        <div className="relative">
                            <img
                                src="/Images/logo.png"
                                alt="Rising Food Delivery Logo"
                                loading="eager"
                                className="w-28 h-28 absolute -top-8 -left-8 z-10 drop-shadow-2xl"
                                onError={(e) => {
                                    e.target.src = "/Images/logo.png";
                                    e.target.onerror = null;
                                }}
                            />
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                                {/* Food Delivery App Interface */}
                                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                                    {/* App Header */}
                                    <div className="p-4 bg-red-600 text-white">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                                </svg>
                                                <h3 className="font-bold">Rising Delivery</h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Content */}
                                    <div className="p-4">
                                        {/* Delivery Status Banner - NEW HIGHLIGHTED SECTION */}
                                        <div className={`mb-4 rounded-lg p-3 animate-fadeIn flex items-center gap-3 shadow-md border ${deliveryStatus.available ? 'border-green-200 bg-green-50' : (deliveryStatus.checking ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50')}`}>
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${deliveryStatus.available ? 'bg-green-500' : (deliveryStatus.checking ? 'bg-yellow-500' : 'bg-red-500')}`}>
                                                    {deliveryStatus.available ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : deliveryStatus.checking ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white animate-spin" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805V10a1 1 0 01-2 0V3a1 1 0 011-1z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.3-.921 1.603-.921 1.902 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className={`absolute top-0 left-0 w-8 h-8 rounded-full bg-${deliveryStatus.available ? 'green' : (deliveryStatus.checking ? 'yellow' : 'red')}-500 animate-ping ${animateLocation ? 'opacity-75' : 'opacity-0'}`}></div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-bold text-base text-${deliveryStatus.available ? 'green' : (deliveryStatus.checking ? 'yellow' : 'red')}-800`}>
                                                    {deliveryStatus.available ? 'We Deliver to Your Area!' : (deliveryStatus.checking ? 'Checking Delivery Availability...' : 'Location Permission Required')}
                                                </h4>
                                                <p className={`text-sm text-${deliveryStatus.available ? 'green' : (deliveryStatus.checking ? 'yellow' : 'red')}-700`}>
                                                    {deliveryStatus.message}
                                                </p>
                                                {deliveryStatus.locationName && deliveryStatus.available && (
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                            Located in {deliveryStatus.locationName}
                                                        </span>
                                                        <span className="ml-2 text-xs text-green-600">
                                                            • Fast Delivery Available
                                                        </span>
                                                    </div>
                                                )}
                                                {!deliveryStatus.available && !deliveryStatus.checking && (
                                                    <button
                                                        onClick={requestLocationPermission}
                                                        className="mt-2 text-xs font-medium bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                                                    >
                                                        Request Permission
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-1 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">Deliver to: <span className="font-medium">123 Main St</span></span>
                                        </div>

                                        {/* Food Categories */}
                                        <div className="flex justify-between mb-6 overflow-x-auto py-2 -mx-1 px-1">
                                            <div className="flex flex-col items-center px-3">
                                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-1">
                                                    <span className="text-xl">🍕</span>
                                                </div>
                                                <span className="text-xs text-gray-600">Pizza</span>
                                            </div>
                                            <div className="flex flex-col items-center px-3">
                                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                                                    <span className="text-xl">🍔</span>
                                                </div>
                                                <span className="text-xs text-gray-600">Burgers</span>
                                            </div>
                                            <div className="flex flex-col items-center px-3">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                                                    <span className="text-xl">🥗</span>
                                                </div>
                                                <span className="text-xs text-gray-600">Healthy</span>
                                            </div>
                                            <div className="flex flex-col items-center px-3">
                                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                                                    <span className="text-xl">🍜</span>
                                                </div>
                                                <span className="text-xs text-gray-600">Asian</span>
                                            </div>
                                        </div>

                                        {/* Featured Restaurant */}
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-800 mb-2">Featured Restaurant</h4>
                                            <div className="bg-gray-50 rounded-lg p-3 flex gap-3">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                                                        alt="Restaurant"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold text-gray-800">Spice Garden</h5>
                                                    <div className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-xs text-gray-600">4.8 (120+)</span>
                                                        <span className="text-xs text-gray-500 ml-2">• 15-20 min</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Indian • Curry • Vegetarian</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Tracking */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-gray-800">Current Order</h4>
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">On the way</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                                                <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Order placed</span>
                                                <span>On the way</span>
                                                <span>Delivered</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -right-6 bg-yellow-300 p-4 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-600 rounded-full p-2 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Fast Delivery</p>
                                        <p className="text-xs text-gray-600">30 min or free</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-6 left-20 bg-white p-3 rounded-xl shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="bg-green-500 rounded-full p-2 shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">1000+ Restaurants</p>
                                        <p className="text-xs text-gray-600">Partner network</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero; 