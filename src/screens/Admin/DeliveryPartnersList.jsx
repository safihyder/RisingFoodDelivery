import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Query } from 'appwrite';
import deliveryPartnerService from '../../appwrite/deliveryPartnerConfig';

const DeliveryPartnersList = () => {
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [totalPartners, setTotalPartners] = useState(0);

    useEffect(() => {
        fetchDeliveryPartners();
    }, [selectedStatus]);

    const fetchDeliveryPartners = async () => {
        try {
            setIsLoading(true);
            let queries = [];

            // Add status filter if not "all"
            if (selectedStatus !== 'all') {
                queries.push(Query.equal('status', selectedStatus));
            } else {
                // For "all", we still want to exclude pending status
                queries.push(Query.notEqual('status', 'pending'));
            }

            const response = await deliveryPartnerService.getAllDeliveryPartners(queries);

            if (response && response.documents) {
                // Process partners to get image previews
                const processedPartners = response.documents.map(partner => ({
                    ...partner,
                    profilePhotoPreview: partner.profilePhoto ?
                        deliveryPartnerService.getFilePreview(partner.profilePhoto) :
                        null
                }));
                setPartners(processedPartners);
                setTotalPartners(response.total);
            } else {
                setPartners([]);
                setTotalPartners(0);
            }
        } catch (error) {
            console.error('Error fetching delivery partners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const partner = partners.find(p => p.$id === id);
            if (!partner) return;

            await deliveryPartnerService.updateDeliveryPartner(id, {
                ...partner,
                status: newStatus
            });

            // Refresh the list after status change
            fetchDeliveryPartners();
        } catch (error) {
            console.error('Error updating partner status:', error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
                <p className="ml-4 text-gray-600">Loading delivery partners...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Delivery Partners</h2>
                    <p className="text-gray-500 mt-1">Total: {totalPartners} partners</p>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="all">All Partners</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button
                        onClick={fetchDeliveryPartners}
                        className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {partners.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No delivery partners found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Partner</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Contact</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Location</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Availability</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Joined</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((partner) => (
                                <motion.tr
                                    key={partner.$id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            {partner.profilePhotoPreview ? (
                                                <img
                                                    src={partner.profilePhotoPreview}
                                                    alt={partner.name}
                                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                    <span className="text-gray-500">{partner.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <span className="font-medium">{partner.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p>{partner.email}</p>
                                            <p className="text-gray-500">{partner.phone}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {partner.city}, {partner.state}
                                    </td>
                                    <td className="py-3 px-4">
                                        {partner.availability}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${partner.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : partner.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(partner.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex space-x-2">
                                            {partner.status === 'rejected' ? (
                                                <button
                                                    onClick={() => handleStatusChange(partner.$id, 'approved')}
                                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors duration-200"
                                                >
                                                    Approve
                                                </button>
                                            ) : partner.status === 'approved' ? (
                                                <button
                                                    onClick={() => handleStatusChange(partner.$id, 'rejected')}
                                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200"
                                                >
                                                    Reject
                                                </button>
                                            ) : null}
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

export default DeliveryPartnersList; 