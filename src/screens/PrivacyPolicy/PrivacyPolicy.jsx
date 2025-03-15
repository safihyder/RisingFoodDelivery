const PrivacyPolicy = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Privacy Policy</h1>
                <p className="text-gray-600">Last Updated: {lastUpdated}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                    At Rising Food Delivery, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services.
                </p>
                <p className="text-gray-700 mb-4">
                    By accessing or using our platform, you consent to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                    We collect several types of information from and about users of our platform, including:
                </p>
                <h3 className="text-lg font-medium mb-2 text-gray-800">Personal Information</h3>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Contact information (name, email address, phone number)</li>
                    <li>Delivery address</li>
                    <li>Payment information (processed securely through our payment processors)</li>
                    <li>Account credentials</li>
                </ul>
                <h3 className="text-lg font-medium mb-2 text-gray-800">Usage Information</h3>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Order history and preferences</li>
                    <li>Device information (IP address, browser type, device type)</li>
                    <li>Location data (with your permission)</li>
                    <li>Usage patterns and interactions with our platform</li>
                </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                    We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Processing and fulfilling your orders</li>
                    <li>Managing your account and providing customer support</li>
                    <li>Improving our services and user experience</li>
                    <li>Communicating with you about orders, promotions, and updates</li>
                    <li>Analyzing usage patterns and trends</li>
                    <li>Protecting against fraudulent or unauthorized transactions</li>
                    <li>Complying with legal obligations</li>
                </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">
                    We may share your information with:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Restaurants to fulfill your orders</li>
                    <li>Delivery partners to deliver your orders</li>
                    <li>Payment processors to process transactions</li>
                    <li>Service providers who assist in operating our platform</li>
                    <li>Legal authorities when required by law or to protect our rights</li>
                </ul>
                <p className="text-gray-700 mb-4">
                    We do not sell your personal information to third parties.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Data Security</h2>
                <p className="text-gray-700 mb-4">
                    We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
                <p className="text-gray-700 mb-4">
                    You are responsible for maintaining the confidentiality of your account credentials and for restricting access to your devices.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Your Choices and Rights</h2>
                <p className="text-gray-700 mb-4">
                    You have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                    <li>Accessing and updating your personal information</li>
                    <li>Opting out of marketing communications</li>
                    <li>Requesting deletion of your account and personal information</li>
                    <li>Controlling location tracking and notifications through your device settings</li>
                </ul>
                <p className="text-gray-700 mb-4">
                    To exercise these rights, please contact us using the information provided at the end of this policy.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                    We use cookies and similar tracking technologies to enhance your experience on our platform, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features of our platform.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on our platform or through other communication channels.
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">9. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-gray-700">
                    Email: <a href="mailto:risingfooddelivery0987@gmail.com" className="text-orange-500 hover:underline">risingfooddelivery0987@gmail.com</a><br />
                    Phone: +91-7889365127
                </p>
            </div>

            <div className="text-center text-gray-500 text-sm mt-8">
                <p>Last updated: {lastUpdated}</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 