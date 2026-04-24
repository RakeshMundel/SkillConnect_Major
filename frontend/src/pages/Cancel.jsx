import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const Cancel = () => {
    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
            <FaTimesCircle style={{ fontSize: '80px', color: '#dc3545', marginBottom: '20px' }} />
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Payment Cancelled</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                Your payment process was cancelled. No charges were made.
            </p>
            <Link 
                to="/" 
                style={{ 
                    padding: '12px 30px', 
                    background: '#6c757d', 
                    color: 'white', 
                    borderRadius: '5px', 
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}
            >
                Return to Home
            </Link>
        </div>
    );
};

export default Cancel;
