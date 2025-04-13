import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Query } from 'appwrite';
import deliveryPartnerService from '../../appwrite/deliveryPartnerConfig';
import AppwriteOrderService from '../../appwrite/orderconfig';
import { toast } from 'react-hot-toast';

const DeliveryPartnerDashboard = () => {
    const userData = useSelector(state => state.auth.userData);
    const [partnerData, setPartnerData] = useState(null);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loadingAvailable, setLoadingAvailable] = useState(true);
    const [loadingActive, setLoadingActive] = useState(true);
    const [loadingCompleted, setLoadingCompleted] = useState(true);
    const [activeTab, setActiveTab] = useState('available');
    const [errorAvailable, setErrorAvailable] = useState(null);
    const [errorActive, setErrorActive] = useState(null);
    const [errorCompleted, setErrorCompleted] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userData) return;

        const fetchPartnerData = async () => {
            try {
                setIsInitialLoading(true);
                const partner = await deliveryPartnerService.getDeliveryPartnerByUserId(userData.$id);

                if (!partner || partner.status !== 'approved') {
                    setError('You are not an approved delivery partner');
                    setIsInitialLoading(false);
                    return;
                }

                setPartnerData(partner);

                // Get orders based on status
                await fetchAllOrders();
            } catch (err) {
                console.error('Error fetching partner data:', err);
                setError('Failed to load partner data');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchPartnerData();
    }, [userData]);

    // Refresh data when tab changes
    useEffect(() => {
        if (!userData || !partnerData) return;

        // Only fetch data for the active tab to minimize API calls
        if (activeTab === 'available') {
            fetchAvailableOrders();
        } else if (activeTab === 'active') {
            fetchActiveOrders();
        } else if (activeTab === 'completed') {
            fetchCompletedOrders();
        }
    }, [activeTab, userData]);

    const fetchAllOrders = async () => {
        await Promise.all([
            fetchAvailableOrders(),
            fetchActiveOrders(),
            fetchCompletedOrders()
        ]);
    };

    const fetchAvailableOrders = async () => {
        setLoadingAvailable(true);
        setErrorAvailable(null);
        try {
            // Get orders that are ready for pickup and not assigned to any delivery partner
            const response = await AppwriteOrderService.getAvailableOrders();

            if (!response) {
                throw new Error("Failed to fetch available orders");
            }

            // Extract orders with their parsed order data
            const orders = response.documents.map(doc => {
                // Safely parse the order data
                let parsedOrderData = [];
                try {
                    // Check if orderdata exists and is a string
                    if (doc.orderdata && typeof doc.orderdata === 'string') {
                        parsedOrderData = JSON.parse(doc.orderdata);
                    } else if (Array.isArray(doc.orderdata)) {
                        // If orderdata is an array, try parsing each element
                        parsedOrderData = doc.orderdata.map(item => {
                            if (typeof item === 'string') {
                                try {
                                    return JSON.parse(item);
                                } catch (e) {
                                    console.warn(`Could not parse order data item: ${e.message}`);
                                    return null;
                                }
                            }
                            return item;
                        }).filter(Boolean); // Remove null values
                    }
                } catch (err) {
                    console.warn(`Error parsing JSON for order ${doc.$id}: ${err.message}`);
                    // Continue with empty order data rather than breaking completely
                }

                return {
                    ...doc,
                    parsedOrderData
                };
            });

            setAvailableOrders(orders);
        } catch (err) {
            console.error("Error fetching available orders: ", err);
            setErrorAvailable("Failed to load available orders. Please try again later.");
        } finally {
            setLoadingAvailable(false);
        }
    };

    const fetchActiveOrders = async () => {
        setLoadingActive(true);
        setErrorActive(null);
        try {
            // Get orders assigned to this delivery partner with status 'picked' or 'on-the-way'
            const response = await AppwriteOrderService.getOrders([
                Query.equal('deliveryPartnerId', userData.$id),
                Query.or([
                    Query.equal('deliveryStatus', 'picked'),
                    Query.equal('deliveryStatus', 'on-the-way')
                ])
            ]);

            if (!response) {
                throw new Error("Failed to fetch active orders");
            }

            // Extract orders with their parsed order data
            const orders = response.documents.map(doc => {
                // Safely parse the order data
                let parsedOrderData = [];
                try {
                    if (doc.orderdata && typeof doc.orderdata === 'string') {
                        parsedOrderData = JSON.parse(doc.orderdata);
                    } else if (Array.isArray(doc.orderdata)) {
                        parsedOrderData = doc.orderdata.map(item => {
                            if (typeof item === 'string') {
                                try {
                                    return JSON.parse(item);
                                } catch (e) {
                                    console.warn(`Could not parse order data item: ${e.message}`);
                                    return null;
                                }
                            }
                            return item;
                        }).filter(Boolean);
                    }
                } catch (err) {
                    console.warn(`Error parsing JSON for order ${doc.$id}: ${err.message}`);
                }

                return {
                    ...doc,
                    parsedOrderData
                };
            });

            setActiveOrders(orders);
        } catch (err) {
            console.error("Error fetching active orders: ", err);
            setErrorActive("Failed to load active orders. Please try again later.");
        } finally {
            setLoadingActive(false);
        }
    };

    const fetchCompletedOrders = async () => {
        setLoadingCompleted(true);
        setErrorCompleted(null);
        try {
            // Get orders completed by this delivery partner
            const response = await AppwriteOrderService.getOrders([
                Query.equal('deliveryPartnerId', userData.$id),
                Query.equal('deliveryStatus', 'delivered')
            ]);

            if (!response) {
                throw new Error("Failed to fetch completed orders");
            }

            // Extract orders with their parsed order data
            const orders = response.documents.map(doc => {
                // Safely parse the order data
                let parsedOrderData = [];
                try {
                    if (doc.orderdata && typeof doc.orderdata === 'string') {
                        parsedOrderData = JSON.parse(doc.orderdata);
                    } else if (Array.isArray(doc.orderdata)) {
                        parsedOrderData = doc.orderdata.map(item => {
                            if (typeof item === 'string') {
                                try {
                                    return JSON.parse(item);
                                } catch (e) {
                                    console.warn(`Could not parse order data item: ${e.message}`);
                                    return null;
                                }
                            }
                            return item;
                        }).filter(Boolean);
                    }
                } catch (err) {
                    console.warn(`Error parsing JSON for order ${doc.$id}: ${err.message}`);
                }

                return {
                    ...doc,
                    parsedOrderData
                };
            });

            setCompletedOrders(orders);
        } catch (err) {
            console.error("Error fetching completed orders: ", err);
            setErrorCompleted("Failed to load completed orders. Please try again later.");
        } finally {
            setLoadingCompleted(false);
        }
    };

    const acceptOrder = async (orderId) => {
        try {
            await AppwriteOrderService.updateOrder(
                orderId,
                {
                    deliveryStatus: 'picked',
                    deliveryPartnerId: userData.$id
                }
            );

            // Update local state
            const acceptedOrder = availableOrders.find(order => order.$id === orderId);
            if (acceptedOrder) {
                const updatedOrder = { ...acceptedOrder, deliveryStatus: 'picked', deliveryPartnerId: userData.$id };
                setActiveOrders([...activeOrders, updatedOrder]);
                setAvailableOrders(availableOrders.filter(order => order.$id !== orderId));

                // Switch to active tab to show the accepted order
                setActiveTab('active');

                toast.success('Order accepted successfully');
            }
        } catch (err) {
            console.error("Error accepting order: ", err);
            toast.error('Failed to accept order. Please try again.');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await AppwriteOrderService.updateOrder(
                orderId,
                {
                    deliveryStatus: newStatus,
                }
            );

            // Update local state based on the new status
            if (newStatus === 'on-the-way') {
                setActiveOrders(activeOrders.map(order =>
                    order.$id === orderId ? { ...order, deliveryStatus: newStatus } : order
                ));
                toast.success('Order status updated to On The Way');
            }
            else if (newStatus === 'delivered') {
                const deliveredOrder = activeOrders.find(order => order.$id === orderId);
                if (deliveredOrder) {
                    const updatedOrder = { ...deliveredOrder, deliveryStatus: 'delivered' };
                    setCompletedOrders([updatedOrder, ...completedOrders]);
                    setActiveOrders(activeOrders.filter(order => order.$id !== orderId));
                }
                toast.success('Order marked as delivered');
            }
        } catch (err) {
            console.error("Error updating order status: ", err);
            toast.error('Failed to update order status. Please try again.');
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    if (!userData) {
        return <Navigate to="/loginuser" />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-5 rounded-lg text-center">
                        <h3 className="text-xl font-semibold mb-2">Error</h3>
                        <p>{error}</p>
                        <div className="mt-6">
                            <a
                                href="/delivery-partner-registration"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Go to Registration
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800">Delivery Partner Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {partnerData?.name}!</p>
                </motion.div>

                <div className="bg-white shadow rounded-lg">
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'available' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('available')}
                        >
                            Available Orders
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Active Orders
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed Orders
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {/* Available Orders */}
                        <div className={`tab-content ${activeTab === 'available' ? 'block' : 'hidden'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Available Orders</h2>
                                <button
                                    onClick={fetchAvailableOrders}
                                    className="text-blue-500 hover:text-blue-600 flex items-center"
                                    disabled={loadingAvailable}
                                >
                                    <svg className={`h-5 w-5 mr-1 ${loadingAvailable ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                            {loadingAvailable ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                </div>
                            ) : errorAvailable ? (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                    <p>{errorAvailable}</p>
                                </div>
                            ) : availableOrders.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">There are no available orders at the moment.</p>
                            ) : (
                                <div className="space-y-4">
                                    {availableOrders.map(order => (
                                        <div
                                            key={order.$id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">Order #{order.$id.substring(0, 8)}</h3>

                                                    {/* Restaurant Information Section */}
                                                    {order.restaurantInfo && (
                                                        <div className="mt-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                                            <h4 className="text-sm font-medium text-orange-800 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                Pickup Location
                                                            </h4>
                                                            <p className="text-sm font-medium mt-1">{order.restaurantInfo.name}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{order.restaurantInfo.address}</p>
                                                            <div className="mt-2 flex items-center text-sm text-blue-600">
                                                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                <a href={`tel:${order.restaurantInfo.phone}`} className="hover:underline">
                                                                    {order.restaurantInfo.phone}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Customer and Date Info */}
                                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {order.email}
                                                        </div>
                                                        <span className="hidden sm:inline">•</span>
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(order.$createdAt).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    {order.parsedOrderData?.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                Order Items:
                                                            </p>
                                                            <ul className="mt-1 space-y-1">
                                                                {order.parsedOrderData[0]?.items?.slice(0, 3)?.map((item, index) => (
                                                                    <li key={index} className="text-sm text-gray-600">
                                                                        {item.name} x{item.quantity || item.qty || 1}
                                                                    </li>
                                                                ))}
                                                                {order.parsedOrderData[0]?.items?.length > 3 && (
                                                                    <li className="text-xs text-gray-500">
                                                                        +{order.parsedOrderData[0]?.items?.length - 3} more items
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Order Status and Action */}
                                                    <div className="mt-3 flex flex-wrap items-center justify-between">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Status:</h4>
                                                            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Awaiting Pickup
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <button
                                                                onClick={() => acceptOrder(order.$id)}
                                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-1"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Accept Order
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Delivery Destination */}
                                                    <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                        <h4 className="text-sm font-medium text-blue-800 flex items-center gap-1">
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            Delivery Destination
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-2">Customer: {order.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Orders */}
                        <div className={`tab-content ${activeTab === 'active' ? 'block' : 'hidden'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">My Active Orders</h2>
                                <button
                                    onClick={fetchActiveOrders}
                                    className="text-blue-500 hover:text-blue-600 flex items-center"
                                    disabled={loadingActive}
                                >
                                    <svg className={`h-5 w-5 mr-1 ${loadingActive ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                            {loadingActive ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                </div>
                            ) : errorActive ? (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                    <p>{errorActive}</p>
                                </div>
                            ) : activeOrders.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">You don't have any active orders.</p>
                            ) : (
                                <div className="space-y-4">
                                    {activeOrders.map(order => (
                                        <div
                                            key={order.$id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">Order #{order.$id.substring(0, 8)}</h3>

                                                    {/* Restaurant Information Section */}
                                                    {order.restaurantInfo && (
                                                        <div className="mt-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                                            <h4 className="text-sm font-medium text-orange-800 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                Pickup Location
                                                            </h4>
                                                            <p className="text-sm font-medium mt-1">{order.restaurantInfo.name}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{order.restaurantInfo.address}</p>
                                                            <div className="mt-2 flex items-center text-sm text-blue-600">
                                                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                <a href={`tel:${order.restaurantInfo.phone}`} className="hover:underline">
                                                                    {order.restaurantInfo.phone}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Customer and Date Info */}
                                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {order.email}
                                                        </div>
                                                        <span className="hidden sm:inline">•</span>
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(order.$createdAt).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    {order.parsedOrderData?.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                Order Items:
                                                            </p>
                                                            <ul className="mt-1 space-y-1">
                                                                {order.parsedOrderData[0]?.items?.slice(0, 3)?.map((item, index) => (
                                                                    <li key={index} className="text-sm text-gray-600">
                                                                        {item.name} x{item.quantity || item.qty || 1}
                                                                    </li>
                                                                ))}
                                                                {order.parsedOrderData[0]?.items?.length > 3 && (
                                                                    <li className="text-xs text-gray-500">
                                                                        +{order.parsedOrderData[0]?.items?.length - 3} more items
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Order Status */}
                                                    <div className="mt-3">
                                                        <div className="mb-3">
                                                            <div className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${order.deliveryStatus === 'on-the-way' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {order.deliveryStatus === 'on-the-way' ? 'On The Way' : 'Picked Up'}
                                                            </div>
                                                        </div>

                                                        {/* Delivery Details */}
                                                        <div className="mb-3">
                                                            <h4 className="font-semibold text-sm border-b pb-1 mb-2">Delivery Destination</h4>
                                                            <p className="text-sm">{order.customerName || order.email}</p>
                                                            <p className="text-sm">{order.customerPhone}</p>
                                                            <p className="text-sm">{order.deliveryAddress}</p>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-end mt-3 space-x-2">
                                                            {order.deliveryStatus === 'picked' && (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.$id, 'on-the-way')}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition-colors"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                    </svg>
                                                                    On The Way
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => updateOrderStatus(order.$id, 'delivered')}
                                                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Delivered
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Completed Orders */}
                        <div className={`tab-content ${activeTab === 'completed' ? 'block' : 'hidden'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Completed Orders</h2>
                                <button
                                    onClick={fetchCompletedOrders}
                                    className="text-blue-500 hover:text-blue-600 flex items-center"
                                    disabled={loadingCompleted}
                                >
                                    <svg className={`h-5 w-5 mr-1 ${loadingCompleted ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                            {loadingCompleted ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                </div>
                            ) : errorCompleted ? (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                    <p>{errorCompleted}</p>
                                </div>
                            ) : completedOrders.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">You haven't completed any orders yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {completedOrders.map(order => (
                                        <div
                                            key={order.$id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium">Order #{order.$id.substring(0, 8)}</h3>

                                                    {/* Restaurant Information Section */}
                                                    {order.restaurantInfo && (
                                                        <div className="mt-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                                            <h4 className="text-sm font-medium text-orange-800 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                Pickup Location
                                                            </h4>
                                                            <p className="text-sm font-medium mt-1">{order.restaurantInfo.name}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{order.restaurantInfo.address}</p>
                                                        </div>
                                                    )}

                                                    {/* Customer and Date Info */}
                                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {order.email}
                                                        </div>
                                                        <span className="hidden sm:inline">•</span>
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(order.$createdAt).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    {order.parsedOrderData?.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                Order Items:
                                                            </p>
                                                            <ul className="mt-1 space-y-1">
                                                                {order.parsedOrderData[0]?.items?.slice(0, 3)?.map((item, index) => (
                                                                    <li key={index} className="text-sm text-gray-600">
                                                                        {item.name} x{item.quantity || item.qty || 1}
                                                                    </li>
                                                                ))}
                                                                {order.parsedOrderData[0]?.items?.length > 3 && (
                                                                    <li className="text-xs text-gray-500">
                                                                        +{order.parsedOrderData[0]?.items?.length - 3} more items
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Delivery Status */}
                                                    <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100">
                                                        <div className="flex items-center">
                                                            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <h4 className="text-sm font-medium text-green-800">Successfully Delivered</h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-2 ml-7">
                                                            This order was successfully delivered. Thank you!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPartnerDashboard;
