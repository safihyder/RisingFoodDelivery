import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Query } from 'appwrite';
import AppwriteOrderService from '../../appwrite/orderconfig';
import deliveryPartnerService from '../../appwrite/deliveryPartnerConfig';

const OrdersMonitoring = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [partnersMap, setPartnersMap] = useState({});

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);

            // Define the query based on the selected filter
            let queries = [];
            if (statusFilter !== 'all') {
                queries.push(Query.equal('deliveryStatus', statusFilter));
            }

            const response = await AppwriteOrderService.getOrders(queries);

            if (response && response.documents) {
                // Process the orders
                const processedOrders = await Promise.all(response.documents.map(async order => {
                    // Process each document's orderdata array (which contains order history)
                    const processedOrderItems = [];

                    // Parse orderdata (which is an array of JSON strings)
                    if (order.orderdata && Array.isArray(order.orderdata)) {
                        // Process each order string in the array - newest first
                        for (let i = 0; i < order.orderdata.length; i++) {
                            try {
                                const orderData = JSON.parse(order.orderdata[i]);

                                // Handle different data formats
                                if (Array.isArray(orderData)) {
                                    // Old format: array with date object followed by items
                                    const orderDate = orderData[0]?.order_date || 'Date not available';
                                    const items = orderData.slice(1);

                                    processedOrderItems.push({
                                        date: orderDate,
                                        items: items,
                                        total: items.reduce((sum, item) => sum + (item.price || 0), 0),
                                        // Only the first item (latest order) gets the document status
                                        status: i === 0 ? order.deliveryStatus : 'delivered',
                                        deliveryPartnerId: i === 0 ? order.deliveryPartnerId : 'none',
                                        isLatest: i === 0
                                    });
                                } else if (orderData.items) {
                                    // New format: object with items, status, and deliveryPartnerId
                                    processedOrderItems.push({
                                        date: orderData.date || 'Date not available',
                                        items: orderData.items || [],
                                        total: (orderData.items || []).reduce((sum, item) => sum + (item.price || 0), 0),
                                        status: i === 0 ? (orderData.status || order.deliveryStatus) : 'delivered',
                                        deliveryPartnerId: i === 0 ? (orderData.deliveryPartnerId || order.deliveryPartnerId) : 'none',
                                        isLatest: i === 0
                                    });
                                } else {
                                    console.error('Unknown order data format');
                                }
                            } catch (error) {
                                console.error('Error parsing order data:', error);
                            }
                        }
                    }

                    // Get delivery partner info if assigned
                    let partnerInfo = null;
                    if (order.deliveryPartnerId && order.deliveryPartnerId !== 'none') {
                        if (partnersMap[order.deliveryPartnerId]) {
                            partnerInfo = partnersMap[order.deliveryPartnerId];
                        } else {
                            try {
                                const partner = await deliveryPartnerService.getDeliveryPartner(order.deliveryPartnerId);
                                if (partner) {
                                    partnerInfo = {
                                        name: partner.name,
                                        phone: partner.phone,
                                        profilePhoto: partner.profilePhoto ?
                                            deliveryPartnerService.getFilePreview(partner.profilePhoto) :
                                            null
                                    };

                                    // Update partners map for future use
                                    setPartnersMap(prev => ({
                                        ...prev,
                                        [order.deliveryPartnerId]: partnerInfo
                                    }));
                                }
                            } catch (err) {
                                console.error('Error fetching partner info:', err);
                            }
                        }
                    }

                    return {
                        id: order.$id,
                        email: order.email,
                        createdAt: new Date(order.$createdAt),
                        deliveryStatus: order.deliveryStatus || 'pending',
                        deliveryPartnerId: order.deliveryPartnerId || 'none',
                        orderItems: processedOrderItems, // Renamed from parsedOrderData for clarity
                        partnerInfo
                    };
                }));

                // Sort by most recent first
                processedOrders.sort((a, b) => b.createdAt - a.createdAt);
                setOrders(processedOrders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    text: 'Order Received',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'ready':
                return {
                    text: 'Ready for Pickup',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    )
                };
            case 'picked':
                return {
                    text: 'Picked Up',
                    bgColor: 'bg-indigo-100',
                    textColor: 'text-indigo-800',
                    icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    )
                };
            case 'on-the-way':
                return {
                    text: 'On the Way',
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-800',
                    icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )
                };
            case 'delivered':
                return {
                    text: 'Delivered',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            default:
                return {
                    text: 'Unknown',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    icon: (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-600">Loading orders...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Orders Monitoring</h2>

                <div className="flex items-center space-x-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Order Received</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="picked">Picked Up</option>
                        <option value="on-the-way">On the Way</option>
                        <option value="delivered">Delivered</option>
                    </select>

                    <button
                        onClick={fetchOrders}
                        className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No orders found with the selected filter.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            {/* Order header with customer info */}
                            <div className="bg-gray-100 p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-gray-800">
                                        Customer: {order.email}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Order ID: #{order.id.substring(0, 8)} | Created: {order.createdAt.toLocaleString()}
                                    </p>
                                </div>

                                {/* Latest order status */}
                                {order.orderItems.length > 0 && (
                                    <div className="flex items-center">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(order.orderItems[0].status).bgColor} ${getStatusInfo(order.orderItems[0].status).textColor}`}>
                                            <span className="flex items-center gap-1">
                                                {getStatusInfo(order.orderItems[0].status).icon}
                                                {getStatusInfo(order.orderItems[0].status).text}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Order items section - only show if there are items */}
                            {order.orderItems.length > 0 && (
                                <div className="p-4">
                                    {order.orderItems.map((orderItem, orderIndex) => (
                                        <div
                                            key={orderIndex}
                                            className={`p-4 ${orderItem.isLatest ? 'bg-orange-50' : ''}`}
                                        >
                                            {/* Order details */}
                                            <div className="mb-2 flex justify-between items-center">
                                                <p className="text-sm text-gray-600">
                                                    Order date: {orderItem.date}
                                                </p>
                                                {orderItem.isLatest && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        Latest Order
                                                    </span>
                                                )}
                                            </div>

                                            {/* Items table */}
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {orderItem.items && orderItem.items.map((item, itemIndex) => (
                                                        <tr key={itemIndex}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.qty}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Total:</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${orderItem.total}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>

                                            {/* Display current status instead of control buttons */}
                                            {orderItem.isLatest && (
                                                <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-700 mr-2">Current Status:</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusInfo(orderItem.status).bgColor} ${getStatusInfo(orderItem.status).textColor}`}>
                                                            {getStatusInfo(orderItem.status).icon}
                                                            {getStatusInfo(orderItem.status).text}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Delivery partner info - if assigned */}
                            {order.partnerInfo && (
                                <div className="bg-blue-50 p-4 border-t border-blue-100">
                                    <h4 className="font-medium text-blue-800 mb-2">Delivery Partner</h4>
                                    <div className="flex items-center">
                                        {order.partnerInfo.profilePhoto ? (
                                            <img
                                                src={order.partnerInfo.profilePhoto}
                                                alt={order.partnerInfo.name}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                                                <span className="text-blue-800">{order.partnerInfo.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium">{order.partnerInfo.name}</p>
                                            <p className="text-xs text-blue-700">{order.partnerInfo.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersMonitoring; 