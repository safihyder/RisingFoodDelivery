import { useEffect } from 'react';

const TermsOfService = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Terms of Service</h1>
                <p className="text-gray-600">Last Updated: {lastUpdated}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                    By accessing or using the Rising Food Delivery platform, including our website, mobile application, and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                </p>
                <p className="text-gray-700 mb-4">
                    We reserve the right to modify these terms at any time. Your continued use of our platform following the posting of changes constitutes your acceptance of such changes.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                    To use certain features of our platform, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
                <p className="text-gray-700 mb-4">
                    You agree to provide accurate and complete information when creating your account and to update your information to keep it accurate and current.
                </p>
                <p className="text-gray-700 mb-4">
                    We reserve the right to suspend or terminate your account if any information provided is found to be inaccurate, false, or outdated.
                </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Ordering and Delivery</h2>
                <p className="text-gray-700 mb-4">
                    Rising Food Delivery acts as a platform connecting users with local restaurants and delivery partners. We strive to ensure accurate representation of menu items, prices, and delivery times, but we cannot guarantee absolute accuracy at all times.
                </p>
                <p className="text-gray-700 mb-4">
                    By placing an order through our platform, you agree to pay the full amount specified at checkout, including the cost of food items, delivery fees, taxes, and any applicable service charges.
                </p>
                <p className="text-gray-700 mb-4">
                    Delivery times are estimates and may vary based on factors such as distance, traffic, weather conditions, and restaurant preparation times.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Cancellations and Refunds</h2>
                <p className="text-gray-700 mb-4">
                    You may cancel an order at any time before the restaurant begins preparing your food. Once preparation has begun, cancellation may not be possible.
                </p>
                <p className="text-gray-700 mb-4">
                    Refunds may be issued in cases where an order is canceled before preparation, if items are missing, or if the food quality doesn&apos;t meet reasonable standards. Refund policies may vary based on the circumstances, and our customer support team will assist you with the process.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Prohibited Activities</h2>
                <p className="text-gray-700 mb-4">
                    When using our platform, you agree not to:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the rights of others</li>
                    <li>Submit false or misleading information</li>
                    <li>Engage in fraudulent activities</li>
                    <li>Interfere with the proper functioning of our platform</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
                <p className="text-gray-700 mb-4">
                    We reserve the right to terminate or suspend your access to our platform for violations of these terms.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                    Rising Food Delivery is not liable for any direct, indirect, incidental, special, or consequential damages arising from your use of our platform or services.
                </p>
                <p className="text-gray-700 mb-4">
                    We do not guarantee the quality, safety, or legality of food items provided by restaurants, nor the reliability or accuracy of delivery services.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                    If you have any questions or concerns about these Terms of Service, please contact us at:
                </p>
                <p className="text-gray-700">
                    Email: <a href="mailto:risingfooddelivery0987@gmail.com" className="text-orange-500 hover:underline">risingfooddelivery0987@gmail.com</a><br />
                    Phone: +91-7889365127
                </p>
            </div>

            <div className="text-center text-gray-500 text-sm mt-8">
                <p> Last updated: {lastUpdated}</p>
            </div>
        </div>
    );
};

export default TermsOfService; 