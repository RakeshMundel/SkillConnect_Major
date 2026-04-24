import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaShoppingBag } from 'react-icons/fa';

const notifications = [
    { name: "Rahul", city: "Noida", service: "Electrician" },
    { name: "Sneha", city: "Delhi", service: "Salon" },
    { name: "Amit", city: "Gurgaon", service: "Plumber" },
    { name: "Priya", city: "Mumbai", service: "Painter" },
    { name: "Vikram", city: "Bangalore", service: "AC Repair" },
    { name: "Anjali", city: "Pune", service: "Pest Control" },
];

const SocialProof = () => {
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        const showNext = () => {
            const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
            setCurrent(randomNotif);
            
            // Hide after 5 seconds
            setTimeout(() => {
                setCurrent(null);
            }, 5000);
        };

        // Initial delay
        const initialDelay = setTimeout(showNext, 3000);
        
        // Loop every 15 seconds
        const interval = setInterval(showNext, 15000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    return (
        <AnimatePresence>
            {current && (
                <motion.div
                    initial={{ opacity: 0, x: -50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.8 }}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '30px',
                        zIndex: 2000,
                        background: 'white',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        borderLeft: '5px solid #28a745'
                    }}
                >
                    <div style={{ background: '#f0f0f0', padding: '8px', borderRadius: '50%' }}>
                        <FaUserCircle size={24} color="#555" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                            {current.name} from {current.city}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                            Just hired an <span style={{ color: '#28a745', fontWeight: '600' }}>{current.service}</span>
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SocialProof;
