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
    const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled
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
                    console.log(ordersData);
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
                            const separatedOrders = parsedOrderItems.map(orderItem => {
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
                                    status: order.status || 'pending'
                                };
                            }).filter(order => order.items.length > 0); // Only keep orders with items from this restaurant

                            // Sort orders by date (newest first)
                            separatedOrders.sort((a, b) => {
                                return new Date(b.date) - new Date(a.date);
                            });

                            return {
                                id: order.$id,
                                orders: separatedOrders
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
        return orders.map(orderDoc => ({
            ...orderDoc,
            orders: orderDoc.orders.filter(order => order.status.toLowerCase() === filter)
        })).filter(orderDoc => orderDoc.orders.length > 0);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Orders</h1>
                <p className="text-gray-600">Manage all orders for {restaurantData?.name}</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('all')}
                >
                    All Orders
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${filter === 'cancelled' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled
                </button>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {getFilteredOrders().length > 0 ? (
                    getFilteredOrders().map((orderDoc) => (
                        <div key={orderDoc.id} className="space-y-6">
                            {orderDoc.orders.map((order, orderIndex) => (
                                <motion.div
                                    key={`${orderDoc.id}-${orderIndex}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: orderIndex * 0.1, duration: 0.5 }}
                                >
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-white font-semibold">Order #{orderCounter++}</h2>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-white text-sm">
                                                    {order.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {/* Order Items */}
                                        <div className="divide-y divide-gray-100">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex justify-between items-center py-3">
                                                    <div className="flex items-center">
                                                        <span className="font-medium">{item.name}</span>
                                                        <span className="ml-2 text-gray-500">x{item.qty}</span>
                                                    </div>
                                                    <span className="font-medium">₹{item.price.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Total */}
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Order Total:</span>
                                                <span className="text-orange-600">₹{order.total.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                                className="text-orange-600 hover:text-orange-900"
                                                onClick={() => navigate(`/order-details/${orderDoc.id}`)}
                                            >
                                                View Details
                                            </button>
                                            {order.status.toLowerCase() === 'pending' && (
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    onClick={() => {
                                                        // Update order status to completed
                                                        AppwriteOrderService.updateOrder(orderDoc.id, {
                                                            status: 'completed'
                                                        }).then(() => {
                                                            // Refresh orders
                                                            setOrders(orders.map(doc => {
                                                                if (doc.id === orderDoc.id) {
                                                                    return {
                                                                        ...doc,
                                                                        orders: doc.orders.map(o =>
                                                                            o === order ? { ...o, status: 'completed' } : o
                                                                        )
                                                                    };
                                                                }
                                                                return doc;
                                                            }));
                                                        });
                                                    }}
                                                >
                                                    Mark as Completed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-gray-500">There are no {filter !== 'all' ? filter : ''} orders for this restaurant.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RestaurantOrders; 