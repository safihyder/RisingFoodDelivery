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
                        const parsedOrderItems = order.orderdata.map(orderData => JSON.parse(orderData));

                        // Extract each order with its date
                        const separatedOrders = parsedOrderItems.map(orderItem => {
                            // Extract date from the first item in each order
                            const orderDate = orderItem[0]?.order_date || 'Date not available';
                            // Get order items (excluding the date object)
                            const items = orderItem.slice(1);

                            return {
                                date: orderDate,
                                items: items,
                                total: items.reduce((sum, item) => sum + item.price, 0)
                            };
                        });

                        // Sort orders by date (newest first)
                        separatedOrders.sort((a, b) => {
                            return new Date(b.date) - new Date(a.date);
                        });

                        return {
                            id: order.$id,
                            orders: separatedOrders
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

    // Count total orders across all documents for numbering
    let orderCounter = 1;

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
                    {orders.map((orderDoc) => (
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
                                            <span className="text-white text-sm">
                                                {order.date}
                                            </span>
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
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default UserOrders; 