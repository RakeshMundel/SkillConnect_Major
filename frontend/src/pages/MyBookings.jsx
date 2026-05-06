import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { FaUser, FaCalendarCheck, FaCamera, FaCheckCircle, FaClock } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(null); // ID of booking being updated

    useEffect(() => {
        const fetchBookings = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`${BASE_URL}/my-bookings/${currentUser.uid}`);
                    const data = await response.json();
                    setBookings(data);
                } catch (error) {
                    console.error("Error fetching bookings:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookings();
    }, [currentUser]);

    const handleImageUpload = async (e, hiringId) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(hiringId);
        const formData = new FormData();
        formData.append('profile', file);

        try {
            // Use existing upload endpoint
            const uploadRes = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                // Update task as complete
                await fetch(`${BASE_URL}/complete-task`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        hiringId,
                        completionImage: uploadData.image_url
                    })
                });

                // Update local state
                setBookings(prev => prev.map(b => 
                    b._id === hiringId ? { ...b, completionImage: uploadData.image_url, completedAt: new Date() } : b
                ));
                alert("Task marked as complete!");
            }
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(null);
        }
    };

    if (loading) return <div className="bookings-loading">Loading your bookings...</div>;

    const isExpired = (booking) => {
        try {
            const [hours, minutes] = (booking.scheduledTime || '23:59').split(':').map(Number);
            const scheduled = new Date(booking.scheduledDate);
            scheduled.setHours(hours, minutes, 0, 0);
            return new Date() > scheduled;
        } catch {
            return false;
        }
    };

    return (
        <div className="my-bookings-container">
            <div className="bookings-header">
                <h1>My Work Bookings</h1>
                <p>Track who hired you and manage task completion.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <FaClock className="no-bookings-icon" />
                    <h3>No bookings yet</h3>
                    <p>When someone hires you, it will appear here.</p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((booking) => {
                        const expired = isExpired(booking);
                        return (
                        <div key={booking._id} className="booking-card" style={expired ? { opacity: 0.75, background: '#f9fafb' } : {}}>
                            <div className="booking-card-header">
                                <div className="client-info">
                                    <FaUser className="client-icon" />
                                    <div>
                                        <h3>Client: {booking.userName || "Client"}</h3>
                                        <span className={`status-badge ${booking.completionImage ? 'completed' : expired ? 'expired' : 'pending'}`}>
                                            {booking.completionImage ? 'Completed' : expired ? 'Booking Expired' : 'Active Job'}
                                        </span>
                                    </div>
                                </div>
                                <div className="booking-price">
                                    ${booking.amount} <span>(Deposit)</span>
                                </div>
                            </div>

                            <div className="booking-details">
                                <div className="detail-item">
                                    <FaCalendarCheck />
                                    <span style={expired ? { color: '#ef4444' } : {}}>
                                        {expired ? '⏰ Was scheduled:' : 'Scheduled:'} {booking.scheduledDate} at {booking.scheduledTime}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <FaCheckCircle />
                                    <span>Payment: {booking.status === 'fully_paid' ? 'Full Payment Received' : 'Deposit Received (Pending Final)'}</span>
                                </div>
                            </div>

                            <div className="booking-actions">
                                {booking.completionImage ? (
                                    <div className="completion-proof">
                                        <p>✅ Work Completed</p>
                                        <img src={booking.completionImage} alt="Completion Proof" className="proof-img" />
                                    </div>
                                ) : expired ? (
                                    <div className="complete-task-zone" style={{ opacity: 0.6 }}>
                                        <div className="upload-label" style={{ cursor: 'not-allowed', background: '#9ca3af' }}>
                                            🔒 Upload Locked (Booking Expired)
                                        </div>
                                    </div>
                                ) : (
                                    <div className="complete-task-zone">
                                        <label className="upload-label">
                                            {uploading === booking._id ? 'Uploading...' : (
                                                <>
                                                    <FaCamera /> Mark as Complete (Upload Photo)
                                                    <input 
                                                        type="file" 
                                                        hidden 
                                                        accept="image/*" 
                                                        onChange={(e) => handleImageUpload(e, booking._id)} 
                                                        disabled={uploading === booking._id}
                                                    />
                                                </>
                                            )}
                                        </label>
                                    </div>
                                )}
                                
                                <button 
                                    className="chat-client-btn"
                                    onClick={async () => {
                                        const { getOrCreateChat } = await import('../Components/Chat/getOrCreateChat');
                                        const chatId = await getOrCreateChat(currentUser.uid, booking.userId);
                                        navigate('/chat', { state: { chatId } });
                                    }}
                                >
                                    💬 Chat with Client
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
