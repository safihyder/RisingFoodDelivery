import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
import AppwriteOrderService from '../../appwrite/orderconfig';
import Loading from '../../components/Loading';
import { motion } from 'framer-motion';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = useSelector(state => state.auth.userData);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userData || !userData.email) {
                setLoading(false);
                return;
            }

            try {
                const response = await AppwriteOrderService.getOrders([
                    Query.equal('email', userData.email)
                ]);

                if (response && response.documents.length > 0) {
                    const processedOrders = response.documents.map(order => {
                        // Parse all order data
                        const parsedOrderItems = [];

                        if (order.orderdata && Array.isArray(order.orderdata)) {
                            // Process each order string in the array
                            for (let i = 0; i < order.orderdata.length; i++) {
                                try {
                                    const orderData = JSON.parse(order.orderdata[i]);

                                    // Handle different data formats
                                    if (Array.isArray(orderData)) {
                                        // Old format: array with date object followed by items
                                        const orderDate = orderData[0]?.order_date || 'Date not available';
                                        const items = orderData.slice(1);

                                        parsedOrderItems.push({
                                            date: orderDate,
                                            items: items,
                                            total: items.reduce((sum, item) => sum + item.price, 0),
                                            // Only the first item (latest order) gets the status, others are considered delivered
                                            status: i === 0 ? order.deliveryStatus : 'delivered',
                                            deliveryPartnerId: i === 0 ? order.deliveryPartnerId : 'none',
                                            isLatest: i === 0
                                        });
                                    } else if (orderData.items) {
                                        // New format: object with items, status, and deliveryPartnerId
                                        parsedOrderItems.push({
                                            date: orderData.date || 'Date not available',
                                            items: orderData.items || [],
                                            total: (orderData.items || []).reduce((sum, item) => sum + item.price, 0),
                                            status: i === 0 ? (orderData.status || order.deliveryStatus) : 'delivered',
                                            deliveryPartnerId: i === 0 ? (orderData.deliveryPartnerId || order.deliveryPartnerId) : 'none',
                                            isLatest: i === 0
                                        });
                                    }
                                } catch (error) {
                                    console.error("Error parsing order data:", error);
                                }
                            }
                        }

                        return {
                            id: order.$id,
                            orders: parsedOrderItems,
                            deliveryStatus: order.deliveryStatus || 'pending',
                            deliveryPartnerId: order.deliveryPartnerId || 'none',
                            createdAt: new Date(order.$createdAt).toLocaleString()
                        };
                    });

                    setOrders(processedOrders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userData]);

    // Helper function to get delivery status text and styles
    const getDeliveryStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    text: 'Order Received',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800'
                };
            case 'ready':
                return {
                    text: 'Ready for Pickup',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800'
                };
            case 'picked':
                return {
                    text: 'Picked Up by Delivery Partner',
                    bgColor: 'bg-indigo-100',
                    textColor: 'text-indigo-800'
                };
            case 'on-the-way':
                return {
                    text: 'On the Way',
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-800'
                };
            case 'delivered':
                return {
                    text: 'Delivered',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800'
                };
            default:
                return {
                    text: 'Processing',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800'
                };
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen p-4 sm:p-6 lg:p-8 mt-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Your Orders</h1>

                <div className="space-y-10">
                    {orders.map((orderDoc) => {
                        return (
                            <div key={orderDoc.id} className="space-y-6">
                                <motion.div
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-white font-semibold">Order History</h2>
                                            <span className="text-white text-sm">
                                                Created: {orderDoc.createdAt}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {/* Order Items Section */}
                                        {orderDoc.orders.map((order, orderIndex) => {
                                            const statusInfo = getDeliveryStatusInfo(order.status);

                                            return (
                                                <div key={orderIndex} className={`mb-6 p-4 rounded-lg ${order.isLatest ? 'bg-orange-50' : 'bg-white'} ${orderIndex > 0 ? 'border-t border-gray-200 pt-6' : ''}`}>
                                                    {/* Order Header */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">
                                                                Order #{orderIndex + 1}
                                                                {order.isLatest && (
                                                                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                                        Latest
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                Date: {order.date}
                                                            </p>
                                                        </div>

                                                        {/* Status Badge */}
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                                            {statusInfo.text}
                                                        </span>
                                                    </div>

                                                    {/* Show delivery partner for latest order if available */}
                                                    {order.isLatest && order.deliveryPartnerId && order.deliveryPartnerId !== 'none' && (
                                                        <div className="mb-4 p-3 bg-indigo-50 rounded-md">
                                                            <div className="flex items-center">
                                                                <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                                <span className="text-indigo-800">
                                                                    Delivery Partner ID: {order.deliveryPartnerId}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Order Items */}
                                                    <div className="divide-y divide-gray-100">
                                                        {order.items.map((item, itemIndex) => (
                                                            <div key={itemIndex} className="flex justify-between items-center py-3">
                                                                <div className="flex items-center">
                                                                    <span className="font-medium">{item.name}</span>
                                                                    <span className="ml-2 text-gray-500">x{item.qty}</span>
                                                                    {item.size && (
                                                                        <span className="ml-2 text-gray-500">({item.size})</span>
                                                                    )}
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
                                                </div>
                                            );
                                        })}

                                        {/* Delivery Timeline - Only show for latest order */}
                                        {orderDoc.orders.length > 0 && orderDoc.orders[0].isLatest && orderDoc.orders[0].status !== 'pending' && (
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <h3 className="font-medium text-gray-700 mb-3">Delivery Timeline</h3>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

                                                    {/* Order Received */}
                                                    <div className="relative flex items-center mb-4">
                                                        <div className="absolute left-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-12">
                                                            <span className="font-medium">Order Received</span>
                                                            <p className="text-sm text-gray-500">Your order has been received</p>
                                                        </div>
                                                    </div>

                                                    {/* Ready for Pickup */}
                                                    <div className="relative flex items-center mb-4">
                                                        <div className={`absolute left-0 h-8 w-8 rounded-full ${orderDoc.orders[0].status === 'pending' ? 'bg-gray-300' : 'bg-yellow-500'} flex items-center justify-center`}>
                                                            {orderDoc.orders[0].status !== 'pending' ? (
                                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-white font-bold">?</span>
                                                            )}
                                                        </div>
                                                        <div className="ml-12">
                                                            <span className={`font-medium ${orderDoc.orders[0].status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>Ready for Pickup</span>
                                                            <p className="text-sm text-gray-500">Food is being prepared</p>
                                                        </div>
                                                    </div>

                                                    {/* Picked Up */}
                                                    <div className="relative flex items-center mb-4">
                                                        <div className={`absolute left-0 h-8 w-8 rounded-full ${orderDoc.orders[0].status === 'pending' || orderDoc.orders[0].status === 'ready' ? 'bg-gray-300' : 'bg-indigo-500'} flex items-center justify-center`}>
                                                            {orderDoc.orders[0].status !== 'pending' && orderDoc.orders[0].status !== 'ready' ? (
                                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-white font-bold">?</span>
                                                            )}
                                                        </div>
                                                        <div className="ml-12">
                                                            <span className={`font-medium ${orderDoc.orders[0].status === 'pending' || orderDoc.orders[0].status === 'ready' ? 'text-gray-400' : 'text-gray-800'}`}>Picked Up</span>
                                                            <p className="text-sm text-gray-500">Order picked up by delivery partner</p>
                                                        </div>
                                                    </div>

                                                    {/* On the Way */}
                                                    <div className="relative flex items-center mb-4">
                                                        <div className={`absolute left-0 h-8 w-8 rounded-full ${orderDoc.orders[0].status === 'pending' || orderDoc.orders[0].status === 'ready' || orderDoc.orders[0].status === 'picked' ? 'bg-gray-300' : 'bg-purple-500'} flex items-center justify-center`}>
                                                            {orderDoc.orders[0].status === 'on-the-way' || orderDoc.orders[0].status === 'delivered' ? (
                                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-white font-bold">?</span>
                                                            )}
                                                        </div>
                                                        <div className="ml-12">
                                                            <span className={`font-medium ${orderDoc.orders[0].status === 'pending' || orderDoc.orders[0].status === 'ready' || orderDoc.orders[0].status === 'picked' ? 'text-gray-400' : 'text-gray-800'}`}>On the Way</span>
                                                            <p className="text-sm text-gray-500">Order is on the way to your location</p>
                                                        </div>
                                                    </div>

                                                    {/* Delivered */}
                                                    <div className="relative flex items-center">
                                                        <div className={`absolute left-0 h-8 w-8 rounded-full ${orderDoc.orders[0].status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                                                            {orderDoc.orders[0].status === 'delivered' ? (
                                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-white font-bold">?</span>
                                                            )}
                                                        </div>
                                                        <div className="ml-12">
                                                            <span className={`font-medium ${orderDoc.orders[0].status === 'delivered' ? 'text-gray-800' : 'text-gray-400'}`}>Delivered</span>
                                                            <p className="text-sm text-gray-500">Order has been delivered</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default UserOrders; 