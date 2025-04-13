import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Query } from 'appwrite';
import deliveryPartnerService from '../../appwrite/deliveryPartnerConfig';

const DeliveryPartnerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            // Fetch only pending applications
            const response = await deliveryPartnerService.getAllDeliveryPartners([
                Query.equal('status', 'pending')
            ]);

            if (response && response.documents) {
                // Process the applications to get image previews
                const processedApplications = response.documents.map(application => ({
                    ...application,
                    idProofPreview: application.idProof ?
                        deliveryPartnerService.getFilePreview(application.idProof) :
                        null,
                    profilePhotoPreview: application.profilePhoto ?
                        deliveryPartnerService.getFilePreview(application.profilePhoto) :
                        null
                }));
                setApplications(processedApplications);
            } else {
                setApplications([]);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const application = applications.find(app => app.$id === id);
            if (!application) return;

            await deliveryPartnerService.updateDeliveryPartner(id, {
                ...application,
                status: newStatus
            });

            // Refresh the list after status change
            fetchApplications();

            if (isModalOpen && selectedApplication?.$id === id) {
                setIsModalOpen(false);
                setSelectedApplication(null);
            }
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const openApplicationModal = (application) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApplication(null);
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
                <p className="ml-4 text-gray-600">Loading applications...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Delivery Partner Applications</h2>
                <button
                    onClick={fetchApplications}
                    className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                    Refresh
                </button>
            </div>

            {applications.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No pending applications found.</p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {applications.map((application) => (
                            <motion.div
                                key={application.$id}
                                variants={itemVariants}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                layoutId={`application-${application.$id}`}
                            >
                                <div className="p-4">
                                    <div className="flex items-center mb-4">
                                        {application.profilePhotoPreview ? (
                                            <img
                                                src={application.profilePhotoPreview}
                                                alt={application.name}
                                                className="w-12 h-12 rounded-full object-cover mr-4"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                                <span className="text-gray-500 text-xl">{application.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold">{application.name}</h3>
                                            <p className="text-gray-500 text-sm">{application.email}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700">
                                            <span className="font-medium">Phone:</span> {application.phone}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">Location:</span> {application.city}, {application.state}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-medium">Applied:</span> {new Date(application.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleStatusChange(application.$id, 'approved')}
                                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(application.$id, 'rejected')}
                                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => openApplicationModal(application)}
                                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Application Detail Modal */}
            {isModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Application Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Personal Information</h4>
                                    <p><span className="font-medium">Name:</span> {selectedApplication.name}</p>
                                    <p><span className="font-medium">Email:</span> {selectedApplication.email}</p>
                                    <p><span className="font-medium">Phone:</span> {selectedApplication.phone}</p>
                                    <p><span className="font-medium">Address:</span> {selectedApplication.address}</p>
                                    <p><span className="font-medium">City:</span> {selectedApplication.city}</p>
                                    <p><span className="font-medium">State:</span> {selectedApplication.state}</p>
                                    <p><span className="font-medium">ZIP:</span> {selectedApplication.zip}</p>
                                    <p><span className="font-medium">Availability:</span> {selectedApplication.availability}</p>
                                    <p><span className="font-medium">Applied On:</span> {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Documents</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-medium mb-1">Profile Photo:</p>
                                            {selectedApplication.profilePhotoPreview ? (
                                                <img
                                                    src={selectedApplication.profilePhotoPreview}
                                                    alt="Profile"
                                                    className="w-40 h-40 object-cover rounded-md"
                                                />
                                            ) : (
                                                <p className="text-gray-500">No profile photo</p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-medium mb-1">ID Proof:</p>
                                            {selectedApplication.idProofPreview ? (
                                                <img
                                                    src={selectedApplication.idProofPreview}
                                                    alt="ID Proof"
                                                    className="w-full max-h-48 object-contain rounded-md border border-gray-200"
                                                />
                                            ) : (
                                                <p className="text-gray-500">No ID proof</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => handleStatusChange(selectedApplication.$id, 'approved')}
                                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
                                >
                                    Approve Application
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedApplication.$id, 'rejected')}
                                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                                >
                                    Reject Application
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DeliveryPartnerApplications; 