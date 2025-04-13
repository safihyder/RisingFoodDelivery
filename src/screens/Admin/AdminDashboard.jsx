import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import DeliveryPartnerApplications from './DeliveryPartnerApplications';
import DeliveryPartnersList from './DeliveryPartnersList';
import RestaurantsList from './RestaurantsList';
import OrdersMonitoring from './OrdersMonitoring';
import { motion } from 'framer-motion';
import authService from '../../appwrite/auth';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('deliveryApplications');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userData = useSelector(state => state.auth.userData);

    useEffect(() => {
        async function checkAdminStatus() {
            if (!userData) {
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                const admin = await authService.isUserAdmin();
                setIsAdmin(admin);
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkAdminStatus();
    }, [userData]);

    const tabVariants = {
        inactive: { opacity: 0.7, y: 0 },
        active: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const contentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                <p className="ml-4 text-gray-600">Checking permissions...</p>
            </div>
        );
    }

    if (!userData || !isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

            {/* Tab navigation */}
            <div className="flex justify-center mb-8">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <motion.button
                        variants={tabVariants}
                        animate={activeTab === 'deliveryApplications' ? 'active' : 'inactive'}
                        onClick={() => setActiveTab('deliveryApplications')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'deliveryApplications'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                            } transition-colors duration-200`}
                    >
                        Delivery Applications
                    </motion.button>

                    <motion.button
                        variants={tabVariants}
                        animate={activeTab === 'deliveryPartners' ? 'active' : 'inactive'}
                        onClick={() => setActiveTab('deliveryPartners')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'deliveryPartners'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                            } transition-colors duration-200`}
                    >
                        Delivery Partners
                    </motion.button>

                    <motion.button
                        variants={tabVariants}
                        animate={activeTab === 'restaurants' ? 'active' : 'inactive'}
                        onClick={() => setActiveTab('restaurants')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'restaurants'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                            } transition-colors duration-200`}
                    >
                        Restaurants
                    </motion.button>

                    <motion.button
                        variants={tabVariants}
                        animate={activeTab === 'orders' ? 'active' : 'inactive'}
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'orders'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                            } transition-colors duration-200`}
                    >
                        Orders
                    </motion.button>
                </div>
            </div>

            {/* Tab content */}
            <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                key={activeTab}
            >
                {activeTab === 'deliveryApplications' && <DeliveryPartnerApplications />}
                {activeTab === 'deliveryPartners' && <DeliveryPartnersList />}
                {activeTab === 'restaurants' && <RestaurantsList />}
                {activeTab === 'orders' && <OrdersMonitoring />}
            </motion.div>
        </div>
    );
};

export default AdminDashboard; 