import React from 'react';

const Cookies = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

            <div className="space-y-6 text-gray-600">
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">1. What Are Cookies</h2>
                    <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience and enable certain features to function properly.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Types of Cookies We Use</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800">Essential Cookies</h3>
                            <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Analytics Cookies</h3>
                            <p>We use analytics cookies to help us understand how visitors interact with our website. This helps us improve our services.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Functionality Cookies</h3>
                            <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences and login information.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Marketing Cookies</h3>
                            <p>These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How to Control Cookies</h2>
                    <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Third-Party Cookies</h2>
                    <p>We use services from third parties that may also set cookies on your device. These include:</p>
                    <ul className="list-disc ml-6 mt-2">
                        <li>Google Analytics</li>
                        <li>Payment processors</li>
                        <li>Social media platforms</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Updates to This Policy</h2>
                    <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
                    <p>If you have any questions about our use of cookies, please contact us at:</p>
                    <p className="mt-2">Email: privacy@risingfooddelivery.com</p>
                </section>
            </div>
        </div>
    );
};

export default Cookies; 