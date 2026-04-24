// src/components/TrustSection.jsx
import React from 'react';
import { FaStar } from "react-icons/fa";
import ig1 from '../Assets/ig1.jpg'
import ig2 from '../Assets/ig2.jpg'
import ig3 from '../Assets/ig3.jpg'
import ig4 from '../Assets/ig4.jpg'
import './TrustSection.css'; 

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
            1,000,000+ Happy Customers
          </span>
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
