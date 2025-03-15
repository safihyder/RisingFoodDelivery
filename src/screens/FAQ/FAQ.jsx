import { useState, useEffect } from 'react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I place an order?",
            answer: "Placing an order is easy! Simply browse restaurants in your area, select the items you want, add them to your cart, and proceed to checkout. You can pay online using various payment methods or choose cash on delivery where available."
        },
        {
            question: "What are the delivery hours?",
            answer: "Our delivery hours typically match the operating hours of our partner restaurants. Most restaurants are available for delivery from 10:00 AM to 10:00 PM, but specific hours may vary by restaurant and location."
        },
        {
            question: "How long does delivery take?",
            answer: "Delivery times vary depending on your distance from the restaurant, the time of day, weather conditions, and order volume. On average, deliveries take between 30-45 minutes. You can track your order in real-time through our app."
        },
        {
            question: "Is there a minimum order amount?",
            answer: "Minimum order amounts vary by restaurant. The specific minimum order amount, if any, will be displayed on the restaurant's page before you place your order."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is confirmed, you can track its status in real-time through our app or website. You'll receive notifications when your order is being prepared, when it's out for delivery, and when it's about to arrive."
        },
        {
            question: "What if I need to cancel my order?",
            answer: "You can cancel your order through our app or website as long as the restaurant hasn't started preparing your food. Once the restaurant begins preparing your order, cancellation may not be possible. Please contact our customer support for assistance with cancellations."
        },
        {
            question: "How do I report an issue with my order?",
            answer: "If you experience any issues with your order, you can report them through our app or website by going to your order history and selecting 'Report an Issue.' You can also contact our customer support team directly for immediate assistance."
        },
        {
            question: "Do you offer refunds?",
            answer: "Yes, we offer refunds in cases where the order was not delivered, items were missing, or the quality was significantly below expectations. Refund requests are evaluated on a case-by-case basis and can be initiated through our app or website."
        },
        {
            question: "How can I become a delivery partner?",
            answer: "To become a delivery partner, visit the 'Become a Delivery Partner' section on our website or app. You'll need to provide some basic information, valid identification, and vehicle details. Our team will review your application and guide you through the onboarding process."
        },
        {
            question: "How can I list my restaurant on Rising Food Delivery?",
            answer: "Restaurant owners can partner with us by visiting the 'Add Your Restaurant' section on our website. You'll need to provide details about your restaurant, menu, and operating hours. Our team will review your application and help you get set up on our platform."
        }
    ];

    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Frequently Asked Questions</h1>
                <p className="text-lg text-gray-600">Find answers to common questions about Rising Food Delivery</p>
            </div>

            <div className="mb-10 space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div
                            className={`flex justify-between items-center p-4 cursor-pointer ${activeIndex === index ? 'bg-orange-500 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="font-medium text-lg">{faq.question}</div>
                            <div className="text-2xl transition-transform duration-200 ease-in-out">
                                {activeIndex === index ? '−' : '+'}
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out bg-white ${activeIndex === index ? 'max-h-96 p-4' : 'max-h-0'
                                }`}
                        >
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-3 text-gray-800">Still Have Questions?</h2>
                <p className="text-gray-700 mb-4">
                    If you couldn't find the answer to your question, our customer support team is here to help.
                    Feel free to reach out to us through any of the following channels:
                </p>
                <p className="text-gray-700">
                    Email: <a href="mailto:risingfooddelivery0987@gmail.com" className="text-orange-500 hover:underline">risingfooddelivery0987@gmail.com</a><br />
                    Phone: +91-7889365127<br />
                    Or visit our <a href="/contact-us" className="text-orange-500 hover:underline">Contact Us</a> page
                </p>
            </div>

            <div className="text-center text-gray-500 text-sm mt-8">
                Last updated: {lastUpdated}
            </div>
        </div>
    );
};

export default FAQ; 