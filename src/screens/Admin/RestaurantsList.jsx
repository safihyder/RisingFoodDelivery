import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppwriteResService from '../../appwrite/config';
import { Query } from 'appwrite';

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRestaurants, setTotalRestaurants] = useState(0);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setIsLoading(true);
            const response = await AppwriteResService.getRestaurants([]);

            if (response && response.documents) {
                // Process restaurants data to calculate subscription status and deadlines
                const processedRestaurants = response.documents.map(restaurant => {
                    // Calculate subscription deadline based on creation date and billing cycle
                    const createdAt = new Date(restaurant.$createdAt);
                    let deadline = new Date(createdAt);

                    // Add months based on billing cycle
                    if (restaurant.billingCycle === 'monthly') {
                        deadline.setMonth(deadline.getMonth() + 1);
                    } else if (restaurant.billingCycle === 'yearly') {
                        deadline.setFullYear(deadline.getFullYear() + 1);
                    }

                    // Calculate subscription status
                    const now = new Date();
                    const status = now > deadline ? 'expired' : 'active';

                    // Calculate days remaining until expiration
                    const daysRemaining = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));

                    return {
                        ...restaurant,
                        imagePreview: restaurant.image ?
                            AppwriteResService.getFilePreview(restaurant.image) : null,
                        subscriptionDeadline: deadline,
                        subscriptionStatus: status,
                        daysRemaining
                    };
                });

                setRestaurants(processedRestaurants);
                setTotalRestaurants(response.total);
            } else {
                setRestaurants([]);
                setTotalRestaurants(0);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const restaurant = restaurants.find(r => r.$id === id);
            if (!restaurant) return;

            await AppwriteResService.updateDetail(id, {
                ...restaurant,
                status: newStatus
            });

            // Refresh the list after status change
            fetchRestaurants();
        } catch (error) {
            console.error('Error updating restaurant status:', error);
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-600">Loading restaurants...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Restaurants</h2>
                    <p className="text-gray-500 mt-1">Total: {totalRestaurants} restaurants</p>
                </div>

                <button
                    onClick={fetchRestaurants}
                    className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                    Refresh
                </button>
            </div>

            {restaurants.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No restaurants found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Restaurant</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Address</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Registered</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Subscription</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Deadline</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((restaurant) => (
                                <motion.tr
                                    key={restaurant.$id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            {restaurant.imagePreview ? (
                                                <img
                                                    src={restaurant.imagePreview}
                                                    alt={restaurant.name}
                                                    className="w-10 h-10 rounded object-cover mr-3"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center mr-3">
                                                    <span className="text-gray-500">{restaurant.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <span className="font-medium">{restaurant.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {restaurant.address}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(restaurant.$createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="capitalize">{restaurant.subscriptionPlan || 'Basic'}</p>
                                            <p className="text-gray-500 text-sm capitalize">{restaurant.billingCycle || 'monthly'}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            {restaurant.subscriptionDeadline ? (
                                                <>
                                                    <p>{restaurant.subscriptionDeadline.toLocaleDateString()}</p>
                                                    <p className={`text-sm ${restaurant.daysRemaining <= 7
                                                            ? 'text-red-500 font-medium'
                                                            : restaurant.daysRemaining <= 30
                                                                ? 'text-yellow-500'
                                                                : 'text-gray-500'
                                                        }`}>
                                                        {restaurant.daysRemaining === 0
                                                            ? 'Expired today'
                                                            : restaurant.daysRemaining > 0
                                                                ? `${restaurant.daysRemaining} days left`
                                                                : 'Expired'}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-gray-500">Not set</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${restaurant.subscriptionStatus === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {restaurant.subscriptionStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2">
                                            {restaurant.status !== 'active' ? (
                                                <button
                                                    onClick={() => handleStatusChange(restaurant.$id, 'active')}
                                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors duration-200"
                                                >
                                                    Activate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusChange(restaurant.$id, 'suspended')}
                                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200"
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RestaurantsList; 