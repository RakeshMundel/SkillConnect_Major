// src/components/TrustSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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
  return (
    <div className="trust-section-container container-fluid ">
      {/* Header and Rating */}
      <div className="row">
        <div className="col-md-6">
          <h1 className="trust-section-header">Trusted by Millions</h1>
          <h4 style={{ color: 'white' }}>No Intermediary - Pay Only for Services</h4>
          <h4 style={{ color: 'white' }}>100% Secure Payments through Stripe</h4>
          <br></br>
          <div className="content">
            <div className="trust-section-rating-box">
              <span className="trust-section-rating">4.9/5 Stars</span>
            </div>
            <div className="trust-section-rating-details">
              <p className="trust-section-customer-count">
                Join <CountUp to={1000000} />+ Happy Customers
              </p>
            </div>
          </div>

        </div>

        <div className="col-md-6">
          <div className="trust-section-profile-grid">
            <img src={ig1} alt="img1" />
            <img src={ig2} alt="img2" />
            <img src={ig3} alt="img3" />
            <img src={ig4} alt="img4" />
          </div>
        </div>
      </div>
    </div>

  );
};

export default TrustSection;
