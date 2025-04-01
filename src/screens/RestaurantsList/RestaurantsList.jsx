import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppwriteResService from '../../appwrite/config';
import { Query } from 'appwrite';

const RestaurantsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await AppwriteResService.getRestaurants([Query.limit(20)]);
                const formattedData = data.documents?.map(item => ({
                    ...item,
                    image: AppwriteResService.getFilePreview(item.image)
                })) || [];
                setRestaurants(formattedData);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setRestaurants([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (!Array.isArray(restaurants)) {
            setFilteredRestaurants([]);
            return;
        }

        if (searchQuery.trim() === '') {
            setFilteredRestaurants(restaurants);
        } else {
            const filtered = restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRestaurants(filtered);
        }
    }, [searchQuery, restaurants]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-600">Loading restaurants...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-3xl font-bold text-gray-800 mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Restaurants
            </motion.h1>

            <div className="max-w-3xl mx-auto mb-12">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for your favorite restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-6 py-4 pr-16 text-lg rounded-full border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-lg transition-all duration-300"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                    {filteredRestaurants.length} restaurants found
                </p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {Array.isArray(filteredRestaurants) && filteredRestaurants.map((restaurant) => (
                        <motion.div
                            key={restaurant.$id}
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <Link to={`/restaurants/${restaurant.$id}`}>
                                <div className="relative h-48">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {restaurant.name}
                                    </h3>
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            <svg
                                                className="h-5 w-5 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="ml-1 text-gray-600">4.5</span>
                                        </div>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-gray-600">{restaurant.cuisine}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <svg
                                            className="h-5 w-5 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>25-35 min</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span>₹2.99 delivery</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {(!Array.isArray(filteredRestaurants) || filteredRestaurants.length === 0) && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No restaurants found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search query</p>
                </motion.div>
            )}
        </div>
    );
};

export default RestaurantsList; 