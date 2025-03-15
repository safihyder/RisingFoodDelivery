import { useState, useEffect } from 'react';
import './Pricing.css';

const Pricing = ({ onSelectPlan, initialPlan = null }) => {
    const [selectedPlanType, setSelectedPlanType] = useState(initialPlan);

    const plans = {
        basic: {
            billingCycle: 'monthly',
            price: 999,
            features: ['Basic restaurant listing', 'Customer reviews', 'Menu management']
        },
        premium: {
            billingCycle: 'yearly',
            price: 19990,
            features: ['All Basic features', 'Priority listing', 'Analytics dashboard', '24/7 support']
        }
    };

    // Set initial plan if provided
    useEffect(() => {
        if (initialPlan && plans[initialPlan]) {
            handlePlanSelect(initialPlan);
        }
    }, [initialPlan]);

    const handlePlanSelect = (plan) => {
        setSelectedPlanType(plan);
        if (onSelectPlan) {
            onSelectPlan({
                plan,
                billingCycle: plans[plan].billingCycle,
                price: plans[plan].price
            });
        }
    };

    return (
        <div className="pricing-container">
            <div className="pricing-header">
                <h3>Choose Your Subscription Plan</h3>
            </div>

            <div className="pricing-plans">
                <div
                    className={`pricing-plan ${selectedPlanType === 'basic' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('basic')}
                >
                    <div className="plan-header">
                        <h4>Basic Plan (Monthly)</h4>
                        <div className="plan-price">
                            <span className="currency">₹</span>
                            <span className="amount">{plans.basic.price}</span>
                            <span className="period">/month</span>
                        </div>
                    </div>
                    <ul className="plan-features">
                        {plans.basic.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <div className={`plan-select-indicator ${selectedPlanType === 'basic' ? 'selected' : ''}`}>
                        {selectedPlanType === 'basic' ? 'Selected' : 'Select Plan'}
                    </div>
                </div>

                <div
                    className={`pricing-plan recommended ${selectedPlanType === 'premium' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('premium')}
                >
                    <div className="plan-badge">Recommended</div>
                    <div className="plan-header">
                        <h4>Premium Plan (Yearly)</h4>
                        <div className="plan-price">
                            <span className="currency">₹</span>
                            <span className="amount">{plans.premium.price}</span>
                            <span className="period">/year</span>
                        </div>
                    </div>
                    <ul className="plan-features">
                        {plans.premium.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <div className={`plan-select-indicator premium ${selectedPlanType === 'premium' ? 'selected' : ''}`}>
                        {selectedPlanType === 'premium' ? 'Selected' : 'Select Plan'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing; 