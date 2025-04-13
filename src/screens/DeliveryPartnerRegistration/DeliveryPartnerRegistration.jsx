import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import deliveryPartnerService from '../../appwrite/deliveryPartnerConfig';

const DeliveryPartnerRegistration = () => {
    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();
    const [partnerStatus, setPartnerStatus] = useState(null);

    useEffect(() => {
        // Check if user is already a delivery partner
        if (userData && userData.$id) {
            deliveryPartnerService.getDeliveryPartnerByUserId(userData.$id)
                .then(partner => {
                    if (partner) {
                        // User is already registered as a delivery partner
                        setPartnerStatus(partner.status);
                        setFormStatus({
                            submitted: true,
                            success: true,
                            message: partner.status === 'approved'
                                ? "Congratulations! Your application has been approved. You can now access the delivery partner dashboard."
                                : partner.status === 'rejected'
                                    ? "Your application has been reviewed and was not approved at this time. Please contact support for more information."
                                    : "Your application is pending review. We will notify you once it's processed."
                        });
                    }
                })
                .catch(error => {
                    console.error("Error checking delivery partner status:", error);
                });
        }
    }, [userData]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        availability: [],
        idProof: null,
        profilePhoto: null,
        agreeToTerms: false
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Prefill name and email if user is logged in
        if (userData) {
            setFormData(prevData => ({
                ...prevData,
                name: userData.name || '',
                email: userData.email || ''
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox' && name === 'agreeToTerms') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked
            }));
        } else if (type === 'checkbox' && name.startsWith('availability')) {
            const day = name.split('-')[1];
            const newAvailability = [...formData.availability];

            if (checked && !newAvailability.includes(day)) {
                newAvailability.push(day);
            } else if (!checked && newAvailability.includes(day)) {
                const index = newAvailability.indexOf(day);
                newAvailability.splice(index, 1);
            }

            setFormData(prevState => ({
                ...prevState,
                availability: newAvailability
            }));
        } else if (type === 'file') {
            setFormData(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
        if (!formData.idProof) newErrors.idProof = 'ID proof is required';
        if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
        if (formData.availability.length === 0) newErrors.availability = 'Please select at least one day of availability';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        if (!userData) {
            setFormStatus({
                submitted: false,
                success: false,
                message: 'You must be logged in to register as a delivery partner'
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload ID proof
            const idProofFile = await deliveryPartnerService.uploadFile(formData.idProof);

            // Upload profile photo
            const profilePhotoFile = await deliveryPartnerService.uploadFile(formData.profilePhoto);

            // Register delivery partner
            await deliveryPartnerService.registerDeliveryPartner({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                availability: formData.availability,
                idProof: idProofFile.$id,
                profilePhoto: profilePhotoFile.$id,
                userId: userData.$id
            });

            // Update form status
            setFormStatus({
                submitted: true,
                success: true,
                message: 'Thank you for registering as a delivery partner! We will review your application and contact you soon.'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                availability: [],
                idProof: null,
                profilePhoto: null,
                agreeToTerms: false
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            setFormStatus({
                submitted: false,
                success: false,
                message: 'There was an error submitting your application. Please try again.'
            });

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const availabilityDays = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' },
    ];

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Become a Delivery Partner</h1>
                    <p className="text-lg text-gray-600">Join our team and start earning on your own schedule. Fill out the form below to get started.</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-lg shadow-sm p-6 md:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {formStatus.submitted && formStatus.success ? (
                        <div className={`${partnerStatus === 'approved'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : partnerStatus === 'rejected'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            } border px-4 py-5 rounded-lg`}>
                            <div className="flex justify-center mb-4">
                                {partnerStatus === 'approved' ? (
                                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : partnerStatus === 'rejected' ? (
                                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-2">
                                {partnerStatus === 'approved'
                                    ? 'Application Approved!'
                                    : partnerStatus === 'rejected'
                                        ? 'Application Not Approved'
                                        : partnerStatus === 'pending'
                                            ? 'Application Pending Review'
                                            : 'Application Submitted!'}
                            </h3>
                            <p className="text-center">{formStatus.message}</p>

                            <div className="mt-6 text-center">
                                {partnerStatus === 'approved' ? (
                                    <Link
                                        to="/delivery-partner-dashboard"
                                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => navigate('/')}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                    >
                                        Go to Home
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Personal Information</h2>

                            {formStatus.message && !formStatus.success && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                                    <p>{formStatus.message}</p>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                                    <h3 className="font-medium">Please fix the following errors:</h3>
                                    <ul className="list-disc ml-5 mt-2 text-sm">
                                        {Object.values(errors).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name*</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address*</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number*</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address*</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City*</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State*</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="zip" className="block text-gray-700 font-medium mb-2">ZIP Code*</label>
                                        <input
                                            type="text"
                                            id="zip"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.zip ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        />
                                        {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                                    </div>
                                </div>

                                {/* Document Upload */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Documents</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="idProof" className="block text-gray-700 font-medium mb-2">ID Proof (Aadhar/PAN/Voter ID)*</label>
                                            <input
                                                type="file"
                                                id="idProof"
                                                name="idProof"
                                                onChange={handleChange}
                                                accept="image/*, application/pdf"
                                                className={`w-full px-4 py-2 border ${errors.idProof ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Upload a clear image or PDF (max 5MB)</p>
                                            {errors.idProof && <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="profilePhoto" className="block text-gray-700 font-medium mb-2">Profile Photo*</label>
                                            <input
                                                type="file"
                                                id="profilePhoto"
                                                name="profilePhoto"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className={`w-full px-4 py-2 border ${errors.profilePhoto ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Upload a clear photo of yourself (max 5MB)</p>
                                            {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Availability</h2>
                                    <p className="text-gray-600 mb-4">Please select the days you are available to work:</p>

                                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 ${errors.availability ? 'border border-red-500 rounded-md p-3' : ''}`}>
                                        {availabilityDays.map(day => (
                                            <div key={day.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`availability-${day.id}`}
                                                    name={`availability-${day.id}`}
                                                    checked={formData.availability.includes(day.id)}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`availability-${day.id}`} className="ml-2 block text-sm text-gray-700">
                                                    {day.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.availability && <p className="text-red-500 text-sm">{errors.availability}</p>}
                                </div>

                                {/* Terms and Conditions */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="agreeToTerms"
                                                name="agreeToTerms"
                                                type="checkbox"
                                                checked={formData.agreeToTerms}
                                                onChange={handleChange}
                                                className={`h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="agreeToTerms" className="font-medium text-gray-700">I agree to the <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>*</label>
                                            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium text-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>

                <div className="mt-10 text-center text-sm text-gray-600">
                    <p>Already registered as a delivery partner? <a href="/loginuser" className="text-orange-500 hover:underline">Login here</a></p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPartnerRegistration; 