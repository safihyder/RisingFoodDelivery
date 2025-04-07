import React, { useState } from 'react';

const AboutUs = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Rising Food Delivery</h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            We're on a mission to transform how people experience food delivery, one order at a time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-4">
                                Founded in 2020, Rising Food Delivery began with a simple idea: to connect people with their favorite local restaurants in a way that's convenient, reliable, and enjoyable.
                            </p>
                            <p className="text-gray-600 mb-4">
                                What started as a small operation serving just a few neighborhoods has quickly grown into one of the most trusted food delivery services in the region. Our journey has been fueled by our passion for great food and exceptional service.
                            </p>
                            <p className="text-gray-600">
                                Today, we partner with hundreds of restaurants, employ a dedicated team of delivery professionals, and serve thousands of satisfied customers daily. But despite our growth, our core values remain the same: quality, reliability, and community.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                            <img
                                src="/Images/about-story.jpg"
                                alt="Rising Food Delivery Story"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1664&q=80";
                                    e.target.onerror = null;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            At Rising Food Delivery, we're committed to connecting people with the food they love from their favorite local restaurants.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h3>
                            <p className="text-gray-600 mb-6">
                                We provide a seamless platform that connects hungry customers with local restaurants, ensuring that delicious meals are delivered quickly and reliably. Our technology makes ordering food as simple as a few taps, while our dedicated delivery partners ensure your food arrives fresh and on time.
                            </p>
                            <p className="text-gray-600">
                                Last updated: {lastUpdated}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Goals</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Support Local Restaurants</h3>
                                        <p className="text-gray-600">Help local restaurants thrive by expanding their customer reach.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Deliver On Time, Every Time</h3>
                                        <p className="text-gray-600">Ensure reliable, timely delivery of fresh, hot meals.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Promote Sustainability</h3>
                                        <p className="text-gray-600">We're committed to reducing our environmental footprint through eco-friendly packaging.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Our Team Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Join Our Delivery Team</h2>
                            <p className="text-lg mb-6">
                                Looking for flexible work with competitive pay? Join our team of delivery partners and be part of our mission to deliver exceptional food experiences.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-white mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Flexible hours - work when it suits you</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-white mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Competitive earnings with bonus opportunities</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-white mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Weekly payouts directly to your bank account</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-white mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Opportunity to grow with a rapidly expanding company</span>
                                </li>
                            </ul>
                            <a
                                href="/delivery-partner-registration"
                                className="inline-block bg-white text-red-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            >
                                Apply Now
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <img
                                src="/Images/delivery-partner.jpg"
                                alt="Delivery Partner"
                                className="rounded-lg shadow-2xl max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1240&q=80";
                                    e.target.onerror = null;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">The passionate people behind Rising Food Delivery</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/"
                                    alt="Safi Hyder"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">Safi Hyder</h3>
                                <p className="text-red-600 font-medium mb-3">Founder & CEO</p>
                                <p className="text-gray-600">A food enthusiast with a vision to revolutionize food delivery.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/"
                                    alt="Priya Sharma"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/women/44.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">Priya Sharma</h3>
                                <p className="text-red-600 font-medium mb-3">Head of Operations</p>
                                <p className="text-gray-600">Ensures smooth operations and timely deliveries across all locations.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/"
                                    alt="Rahul Verma"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/men/68.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">Rahul Verma</h3>
                                <p className="text-red-600 font-medium mb-3">Chief Technology Officer</p>
                                <p className="text-gray-600">The tech genius behind our seamless ordering platform.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="/"
                                    alt="Ananya Patel"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/women/65.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">Ananya Patel</h3>
                                <p className="text-red-600 font-medium mb-3">Restaurant Partnership Manager</p>
                                <p className="text-gray-600">Works closely with restaurant partners to ensure quality service.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">What People Say About Us</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Hear from our satisfied customers and restaurant partners</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300">
                            <div className="mb-6">
                                <svg className="h-10 w-10 text-red-500 mb-4" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                                <p className="text-gray-600 italic">
                                    "Rising Food Delivery has transformed our restaurant business. We've seen a 40% increase in orders since partnering with them!"
                                </p>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src=""
                                    alt="Vikram Singh"
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/men/41.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Vikram Singh</h4>
                                    <p className="text-gray-600 text-sm">Owner, Spice Garden Restaurant</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300">
                            <div className="mb-6">
                                <svg className="h-10 w-10 text-red-500 mb-4" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                                <p className="text-gray-600 italic">
                                    "The food always arrives hot and fresh. Their delivery partners are so professional and friendly. Best food delivery service in town!"
                                </p>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src="/"
                                    alt="Meera Kapoor"
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/women/63.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Meera Kapoor</h4>
                                    <p className="text-gray-600 text-sm">Regular Customer</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition duration-300">
                            <div className="mb-6">
                                <svg className="h-10 w-10 text-red-500 mb-4" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                                <p className="text-gray-600 italic">
                                    "I love the variety of restaurants available on Rising Food Delivery. Their app is so easy to use, and the delivery is always on time."
                                </p>
                            </div>
                            <div className="flex items-center">
                                <img
                                    src="/"
                                    alt="Arjun Mehta"
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                    onError={(e) => {
                                        e.target.src = "https://randomuser.me/api/portraits/men/75.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Arjun Mehta</h4>
                                    <p className="text-gray-600 text-sm">Food Enthusiast</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Us Section */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-orange-500 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
                    <h2 className="text-3xl font-bold mb-4 text-center">Join the Rising Food Delivery Family</h2>
                    <p className="text-xl max-w-2xl mx-auto mb-8 text-center">
                        Whether you're a food lover, restaurant owner, or looking for a career opportunity, we'd love to connect with you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/signupuser"
                            className="inline-block bg-white text-red-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                        >
                            Sign Up as Customer
                        </a>
                        <a
                            href="/addrestaurant"
                            className="inline-block bg-transparent text-white font-semibold px-8 py-3 rounded-lg border-2 border-white hover:bg-white hover:text-red-600 transition duration-300 transform hover:scale-105"
                        >
                            Partner Your Restaurant
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs; 