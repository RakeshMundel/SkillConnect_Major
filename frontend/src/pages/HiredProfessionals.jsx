import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserTie, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { BASE_URL } from '../config';

const HiredProfessionals = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [hiredList, setHiredList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHired = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`${BASE_URL}/hired-professionals/${currentUser.uid}`);
                    const data = await response.json();
                    setHiredList(data);
                } catch (error) {
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchHired();
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
                <FaUserTie style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }} />
                <h2>Please Log In to View Your Hired List</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>You need to be logged in to track your hired professionals and payments.</p>
                <Link to="/login" style={{ 
                    padding: '12px 30px', 
                    background: '#0d6efd', 
                    color: 'white', 
                    borderRadius: '8px', 
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    const isExpired = (item) => {
        try {
            const [hours, minutes] = (item.scheduledTime || '23:59').split(':').map(Number);
            const scheduled = new Date(item.scheduledDate);
            scheduled.setHours(hours, minutes, 0, 0);
            return new Date() > scheduled;
        } catch {
            return false;
        }
    };

    return (
        <div style={{ padding: '40px 10%', minHeight: '80vh' }}>
            <h1 style={{ marginBottom: '30px', color: '#333' }}>Your Hired Professionals</h1>
            {hiredList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <h3>You haven't hired anyone yet.</h3>
                    <p>Browse our professionals to get started!</p>
                    <Link to="/" style={{ color: '#0d6efd', fontWeight: 'bold' }}>Find Professionals</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {hiredList.map((item) => {
                        const expired = isExpired(item);
                        return (
                        <div key={item._id} style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            background: expired ? '#f9fafb' : 'white',
                            opacity: expired && item.status !== 'fully_paid' ? 0.75 : 1
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ 
                                    background: '#e9ecef', 
                                    padding: '15px', 
                                    borderRadius: '50%', 
                                    marginRight: '15px' 
                                }}>
                                    <FaUserTie style={{ fontSize: '24px', color: '#0d6efd' }} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0 }}>{item.professionalName}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                                        {item.status === 'fully_paid' ? '✅ Fully Paid' : expired ? '⌛ Booking Expired' : '⏳ Deposit Paid (1/3)'}
                                    </p>
                                </div>
                            </div>
                            
                            {item.completionImage && (
                                <div style={{ marginBottom: '15px', padding: '10px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                    <p style={{ margin: '0 0 10px', color: '#16a34a', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        ✅ Work Completed (Proof below)
                                    </p>
                                    <img 
                                        src={item.completionImage} 
                                        alt="Work Proof" 
                                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
                                    />
                                </div>
                            )}
                            
                            {item.status !== 'fully_paid' && (
                                <button 
                                    disabled={expired}
                                    onClick={async () => {
                                        if (expired) return;
                                        try {
                                            const response = await fetch(`${BASE_URL}/create-balance-checkout-session`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    hiringId: item._id,
                                                    professionalName: item.professionalName,
                                                    fullPrice: item.amount * 3 // Since amount stored was 1/3
                                                })
                                            });
                                            const session = await response.json();
                                            if (session.url) window.location.href = session.url;
                                        } catch (error) {
                                            alert("Payment failed");
                                        }
                                    }}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        background: expired ? '#9ca3af' : item.completionImage ? '#28a745' : '#f59e0b', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        fontWeight: 'bold', 
                                        marginBottom: '15px',
                                        cursor: expired ? 'not-allowed' : 'pointer',
                                        boxShadow: !expired && item.completionImage ? '0 4px 12px rgba(40, 167, 69, 0.2)' : 'none'
                                    }}
                                >
                                    {expired ? '🔒 Payment Locked (Booking Expired)' : item.completionImage ? '💰 Pay Final Balance (2/3)' : '💰 Final Payment (Pay when work is done)'}
                                </button>
                            )}
                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                                    <FaCalendarAlt style={{ marginRight: '10px' }} />
                                    <span>{new Date(item.hiredAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                                    <FaDollarSign style={{ marginRight: '10px' }} />
                                    <span>Hiring Fee: ${item.amount}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: expired ? '#ef4444' : '#28a745', fontWeight: 'bold' }}>
                                    <FaCalendarAlt style={{ marginRight: '10px' }} />
                                    <span>{expired ? '⏰ Was scheduled:' : 'Scheduled:'} {item.scheduledDate} at {item.scheduledTime}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button 
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!item.professionalId) {
                                            alert("Chat not available for this legacy record. Please hire a new professional to test chat!");
                                            return;
                                        }
                                        try {
                                            const { getOrCreateChat } = await import('../Components/Chat/getOrCreateChat');
                                            const chatId = await getOrCreateChat(currentUser.uid, item.professionalId);
                                            if (chatId) {
                                                localStorage.setItem('activeChatId', chatId);
                                                navigate('/chat', { state: { chatId } });
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to start chat. Please try again.");
                                        }
                                    }}
                                    style={{ 
                                        flex: 1, 
                                        padding: '10px', 
                                        background: '#0d6efd', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    💬 Chat
                                </button>
                                <button 
                                    onClick={() => window.location.href = `tel:${item.professionalPhone || "+919876543210"}`}
                                    style={{ 
                                        flex: 1, 
                                        padding: '10px', 
                                        background: '#28a745', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    📞 Call
                                </button>
                            </div>

                            <Link 
                                to={`/propage/${item.profileId}`} 
                                style={{ 
                                    display: 'block', 
                                    textAlign: 'center', 
                                    marginTop: '10px', 
                                    padding: '8px', 
                                    color: '#666', 
                                    textDecoration: 'none', 
                                    fontSize: '13px'
                                }}
                            >
                                View Profile
                            </Link>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HiredProfessionals;
