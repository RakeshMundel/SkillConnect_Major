// src/components/TrustSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { FaStar } from "react-icons/fa";
import ig1 from '../Assets/ig1.jpg'
import ig2 from '../Assets/ig2.jpg'
import ig3 from '../Assets/ig3.jpg'
import ig4 from '../Assets/ig4.jpg'
import './TrustSection.css';

const CountUp = ({ to, duration = 2 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, to, { duration });
    return controls.stop;
  }, [to]);

  return <motion.span>{rounded}</motion.span>;
};

const TrustSection = () => {
  const professionals = [
    { image: ig1, label: "Salon" },
    { image: ig2, label: "Repair" },
    { image: ig3, label: "Cleaning" },
    { image: ig4, label: "Plumbing" }
  ];

  return (
    <section className="trust-section-container">
      <div className="trust-section-copy">
        <h1 className="trust-section-header">Trusted by Millions of Homes</h1>
        <div className="trust-section-rating-row">
          <FaStar className="trust-section-star" />
          <strong className="trust-section-rating">4.9/5 Stars</strong>
          <span className="trust-section-customer-count">
            Join <CountUp to={1000000} />+ Happy Customers
          </span>
        </div>
        <div className="trust-section-benefits" style={{ marginTop: '10px' }}>
          <h4 style={{ color: 'white', fontSize: '1.1rem' }}>No Intermediary - Pay Only for Services</h4>
          <h4 style={{ color: 'white', fontSize: '1.1rem' }}>100% Secure Payments through Stripe</h4>
        </div>
      </div>

      <div className="trust-section-profile-grid">
        {professionals.map((profile) => (
          <div className="trust-section-profile-card" key={profile.label}>
            <img src={profile.image} alt={profile.label} />
            <span>{profile.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;
