import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppwriteResService from '../../appwrite/config';
import AppwriteOrderService from '../../appwrite/orderconfig';
import Loading from '../../components/Loading';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const RestaurantOrders = () => {
    const [restaurantData, setRestaurantData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, ready, delivered
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);
    const isManager = restaurantData && userData ? restaurantData.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            // Fetch restaurant data
            AppwriteResService.getRestaurant(slug)
                .then((data) => {
                    if (data) {
                        setRestaurantData(data);

                        // Check if user is the manager of this restaurant
                        if (userData && data.userId !== userData.$id) {
                            navigate('/');
                            return;
                        }

                        // Fetch all orders
                        return AppwriteOrderService.getOrders();
                    } else {
                        navigate('/');
                    }
                })
                .then((ordersData) => {
                    if (ordersData?.documents) {
                        // Process orders similar to UserOrders.jsx
                        const processedOrders = ordersData.documents.map(order => {
                            // Parse all order data
                            const parsedOrderItems = order.orderdata ?
                                order.orderdata.map(orderData => {
                                    try {
                                        return JSON.parse(orderData);
                                    } catch (e) {
                                        console.error('Error parsing order data:', e);
                                        return [];
                                    }
                                }) : [];

                            // Extract each order with its date and filter by restaurant ID
                            const separatedOrders = parsedOrderItems.map((orderItem, index) => {
                                // Extract date from the first item in each order
                                const orderDate = orderItem[0]?.order_date || 'Date not available';

                                // Get order items (excluding the date object)
                                const items = orderItem.slice(1);

                                // Filter items by restaurant ID
                                const restaurantItems = items.filter(item => item.resid === slug);

                                // Calculate total for restaurant items only
                                const total = restaurantItems.reduce((sum, item) => sum + item.price, 0);

                                return {
                                    date: orderDate,
                                    items: restaurantItems,
                                    total: total,
                                    // Only the first item is the latest order, rest are considered delivered
                                    status: index === 0 ? (order.deliveryStatus || 'pending') : 'delivered',
                                    isLatest: index === 0
                                };
                            }).filter(order => order.items.length > 0); // Only keep orders with items from this restaurant

                            // Sort orders by date (newest first)
                            separatedOrders.sort((a, b) => {
                                return new Date(b.date) - new Date(a.date);
                            });

                            return {
                                id: order.$id,
                                orders: separatedOrders,
                                email: order.email,
                                deliveryStatus: order.deliveryStatus || 'pending',
                                deliveryPartnerId: order.deliveryPartnerId || 'none',
                                createdAt: new Date(order.$createdAt).toLocaleString()
                            };
                        }).filter(orderDoc => orderDoc.orders.length > 0); // Only keep documents with orders

                        setOrders(processedOrders);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        } else {
            navigate('/');
        }
    }, [slug, navigate, userData]);

    const getFilteredOrders = () => {
        if (filter === 'all') return orders;

        if (filter === 'pending' || filter === 'ready') {
            // For pending/ready filters, only show orders that:
            // 1. Have deliveryStatus matching the filter
            // 2. Only include the latest orders (no past orders)
            return orders
                .filter(orderDoc => orderDoc.deliveryStatus === filter)
                .map(orderDoc => ({
                    ...orderDoc,
                    // Only keep the latest order in the orders array
                    orders: orderDoc.orders.filter(order => order.isLatest)
                }));
        }

        if (filter === 'delivered') {
            // For delivered filter:
            // 1. Show orders that have deliveryStatus as 'delivered'
            // 2. Include past orders (non-latest orders that are marked as delivered)
            // 3. Do NOT include latest orders that aren't delivered
            return orders
                .filter(orderDoc =>
                    orderDoc.deliveryStatus === 'delivered' ||
                    orderDoc.orders.some(order => !order.isLatest)
                )
                .map(orderDoc => {
                    // Only include latest order if it's delivered
                    const filteredOrders = orderDoc.orders.filter(order =>
                        (!order.isLatest) || // include all past orders
                        (order.isLatest && orderDoc.deliveryStatus === 'delivered') // only include latest if delivered
                    );

                    return {
                        ...orderDoc,
                        orders: filteredOrders
                    };
                })
                .filter(orderDoc => orderDoc.orders.length > 0); // Filter out any empty order documents
        }

        return orders.map(orderDoc => ({
            ...orderDoc,
            orders: orderDoc.orders.filter(order => order.status.toLowerCase() === filter)
        })).filter(orderDoc => orderDoc.orders.length > 0);
    };

    const getDeliveryStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-blue-100 text-blue-800';
            case 'ready':
                return 'bg-yellow-100 text-yellow-800';
            case 'picked':
                return 'bg-indigo-100 text-indigo-800';
            case 'on-the-way':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDeliveryStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Order Received';
            case 'ready':
                return 'Ready for Pickup';
            case 'picked':
                return 'Picked Up';
            case 'on-the-way':
                return 'On the Way';
            case 'delivered':
                return 'Delivered';
            default:
                return 'Processing';
        }
    };

    const getDeliveryStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'ready':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                );
            case 'picked':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                );
            case 'on-the-way':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'delivered':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const updateDeliveryStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            await AppwriteOrderService.updateDeliveryStatus(orderId, newStatus);

            // Refresh orders
            const updatedOrders = orders.map(order => {
                if (order.id === orderId) {
                    return { ...order, deliveryStatus: newStatus };
                }
                return order;
            });

            setOrders(updatedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error updating delivery status:', error);
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (!isManager) return <div className="text-center p-8">You don&apos;t have permission to view this page.</div>;

    // Count total orders across all documents for numbering
    let orderCounter = 1;

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Restaurant Orders
                </h1>
                <p className="text-gray-600">Manage all orders for <span className="font-medium text-orange-600">{restaurantData?.name}</span></p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-lg shadow-sm">
                <button
                    className={`px-4 py-2 rounded-md transition-all ${filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilter('all')}
                >
                    All Orders
                </button>
                <button
                    className={`px-4 py-2 rounded-md transition-all ${filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilter('pending')}
                >
                    New Orders
                </button>
                <button
                    className={`px-4 py-2 rounded-md transition-all ${filter === 'ready' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilter('ready')}
                >
                    Ready for Pickup
                </button>
                <button
                    className={`px-4 py-2 rounded-md transition-all ${filter === 'delivered' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilter('delivered')}
                >
                    Delivered
                </button>
            </div>

            {/* Orders List */}
            {getFilteredOrders().length > 0 ? (
                <div className="space-y-6">
                    {getFilteredOrders().map((orderDoc) => (
                        <motion.div
                            key={orderDoc.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Order Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="bg-white text-orange-600 font-bold px-3 py-1 rounded-full shadow-sm">
                                            #{orderCounter++}
                                        </span>
                                        <div>
                                            <h2 className="text-white font-semibold">
                                                {orderDoc.email}
                                            </h2>
                                            <p className="text-orange-100 text-xs">
                                                Order ID: {orderDoc.id.substring(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDeliveryStatusColor(orderDoc.deliveryStatus)} border border-white/20 shadow-sm`}>
                                            {getDeliveryStatusIcon(orderDoc.deliveryStatus)}
                                            <span>{getDeliveryStatusText(orderDoc.deliveryStatus)}</span>
                                        </div>
                                        <div className="bg-white/10 px-3 py-1 rounded text-white text-xs">
                                            <svg className="inline-block h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {orderDoc.createdAt}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                {filter === 'delivered' && (
                                    <div className="mb-4 pb-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Delivered Orders
                                        </h3>
                                    </div>
                                )}

                                {/* New/Active Orders Section */}
                                {(filter === 'pending' || filter === 'ready' || filter === 'all') && orderDoc.orders.filter(order => order.isLatest && orderDoc.deliveryStatus !== 'delivered').length > 0 && (
                                    <div className="mb-4 pb-2 border-b border-gray-200">
                                        <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Active Order
                                        </h3>
                                    </div>
                                )}

                                {/* Latest Order Section - Only show for non-delivered latest orders */}
                                {orderDoc.orders.filter(order => order.isLatest && orderDoc.deliveryStatus !== 'delivered').map((order, orderIndex) => (
                                    <div key={orderIndex} className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-lg shadow-sm">
                                        <div className="mb-3 pb-2 border-b border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">
                                                Order Date: {order.date}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Latest Order
                                                </span>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDeliveryStatusColor(orderDoc.deliveryStatus)}`}>
                                                    {getDeliveryStatusText(orderDoc.deliveryStatus)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Items Table */}
                                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {order.items.map((item, itemIndex) => (
                                                    <tr key={itemIndex}>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" colSpan="2">Total</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-600 text-right">₹{order.total.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Order Status Management - embedded directly below latest order */}
                                        {['pending', 'ready'].includes(orderDoc.deliveryStatus) && (
                                            <div className="mt-4 pt-4 border-t border-orange-100">
                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                                    <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Manage Order Status
                                                </h4>

                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-gray-700">Current Status:</span>
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDeliveryStatusColor(orderDoc.deliveryStatus)}`}>
                                                                {getDeliveryStatusIcon(orderDoc.deliveryStatus)}
                                                                {getDeliveryStatusText(orderDoc.deliveryStatus)}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {orderDoc.deliveryStatus === 'pending' && (
                                                                <button
                                                                    onClick={() => updateDeliveryStatus(orderDoc.id, 'ready')}
                                                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center gap-1 shadow-sm"
                                                                >
                                                                    {getDeliveryStatusIcon('ready')}
                                                                    Mark Ready for Pickup
                                                                </button>
                                                            )}

                                                            {orderDoc.deliveryStatus === 'ready' && orderDoc.deliveryPartnerId === 'none' && (
                                                                <div className="text-yellow-600 flex items-center px-4 py-2 bg-yellow-50 rounded-md border border-yellow-100">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Waiting for delivery partner...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-3 flex items-center">
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Past orders are automatically marked as delivered.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Latest Order that's delivered */}
                                {orderDoc.orders.filter(order => order.isLatest && orderDoc.deliveryStatus === 'delivered').map((order, orderIndex) => (
                                    <div key={orderIndex} className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm">
                                        <div className="mb-3 pb-2 border-b border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">
                                                Order Date: {order.date}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Delivered
                                                </span>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                                    Latest Order
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Items Table */}
                                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {order.items.map((item, itemIndex) => (
                                                    <tr key={itemIndex}>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900" colSpan="2">Total</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-orange-600 text-right">₹{order.total.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}

                                {/* Past Orders Section */}
                                {(filter === 'all' || filter === 'delivered') &&
                                    orderDoc.orders.filter(order => !order.isLatest).length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2 pb-2 border-b border-gray-200">
                                                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Past Orders
                                            </h3>

                                            <div className="space-y-4">
                                                {orderDoc.orders.filter(order => !order.isLatest).map((order, orderIndex) => (
                                                    <div key={orderIndex} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="mb-3 pb-2 border-b border-gray-100 flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-600">
                                                                Order Date: {order.date}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Delivered
                                                                </span>
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                                                                    Past Order
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Order Items Table */}
                                                        <table className="min-w-full divide-y divide-gray-200 mb-2">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {order.items.map((item, itemIndex) => (
                                                                    <tr key={itemIndex}>
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price.toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr className="bg-gray-50">
                                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900" colSpan="2">Total</td>
                                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{order.total.toFixed(2)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">No orders found</h3>
                    <p className="mt-2 text-gray-500">No orders match your current filter criteria. Try changing the filter or check back later.</p>
                    <button
                        onClick={() => setFilter('all')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        View All Orders
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RestaurantOrders; 