import React, { useState,useEffect,useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const auth = getAuth();
  const [currUser, setCurrUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState("");
const sidebarRef = useRef(null);

const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const handleLocationSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${location}`);
    }
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);

  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrUser(user);
      if (user) {
        try {
          const { BASE_URL } = await import('../../config');
          const response = await fetch(`${BASE_URL}/myprofile/${user.uid}`);
          const data = await response.json();
          if (data && !data.error) {
            setUserProfile(data);
          }
          
          // Initial fetch of notifications
          fetchNotifications(user.uid);
        } catch (err) {
          console.error("Navbar profile fetch failed", err);
        }
      }
    });

    // Polling for notifications every 30 seconds
    const notifyInterval = setInterval(() => {
      if (auth.currentUser) {
        fetchNotifications(auth.currentUser.uid);
      }
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(notifyInterval);
    };
  }, []);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async (uid) => {
    try {
      const { BASE_URL } = await import('../../config');
      const res = await fetch(`${BASE_URL}/notifications/${uid}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { BASE_URL } = await import('../../config');
      await fetch(`${BASE_URL}/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

    // Close sidebar if clicked outside
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpenSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className='navbar'>
        <div className="nav-logo">
          <a className="navbar-brand" href='/'>Skill Connect</a>
        </div>

        {/* Search bar */}
        
        {/*<div className="location-wrapper">
          <span className="material-symbols-outlined location-icon">search</span>
          <input className="form-control input-btn" type="text" placeholder="Search" />
        </div>*/}
        <form className="location-wrapper" role="search" onSubmit={handleSubmit}>
          <span className="material-symbols-outlined location-icon">search</span>
      <input
        className="form-control  input-btn"
        type="search"
        placeholder="Search the Service"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>



        {/* Location bar */}
        <div className="location-wrapper">
          <span className="material-symbols-outlined location-icon">location_on</span>
          <input 
            className="form-control input-btn" 
            type="text" 
            placeholder="Location (e.g. Noida)" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleLocationSearch}
          />
        </div>

        {/* Right side Icons */}
        <div className="nav-login-signup ">
        {!currUser ? (
          <>
         <Link className="btn custom-btn me-2" to="/signup"><b>Sign Up</b></Link>
         <Link className="btn custom-btn" to="/login"><b>Log In</b></Link>

          </>
        ) : (
          <>
          <div className="nav-icons-group">
            <div className="notification-container">
              <span 
                className="material-symbols-outlined notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </span>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                  </div>
                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <p className="no-notifications">No notifications yet</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          className={`notification-item ${n.read ? 'read' : 'unread'}`}
                          onClick={() => {
                            markAsRead(n._id);
                            navigate(n.link);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="notify-title">{n.title}</div>
                          <div className="notify-msg">{n.message}</div>
                          <div className="notify-time">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span 
              className="material-symbols-outlined profile-icon"
              onClick={() => setOpenSidebar(!openSidebar)}
            >
              account_circle
            </span>
          </div>

              {/* Sidebar Menu */}
              {openSidebar && (
                <div className="profile-sidebar" ref={sidebarRef}>
                  
                  {/* Top User Info */}
                  <div className="profile-header">
                    <span className="material-symbols-outlined profile-avatar">account_circle</span>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        {userProfile ? userProfile.name : (currUser.displayName || "User Name")}
                        <span style={{ 
                            fontSize: '10px', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            background: userProfile?.membership === 'Pro' ? '#f59e0b' : '#e2e8f0',
                            color: userProfile?.membership === 'Pro' ? '#fff' : '#64748b',
                            fontWeight: 'bold'
                        }}>
                            {userProfile?.membership === 'Pro' ? 'PRO' : 'BASIC'}
                        </span>
                    </h4>
                    <p>{userProfile ? userProfile.category : "Member"}</p>
                  </div>

                  <hr />

                  {/* Menu Items */}
                  <div className="profile-menu">

                    <Link to="/profile" className="profile-item">
                      <span className="material-symbols-outlined">person</span>
                      Your Profile
                    </Link>

                    <Link to="/membership" className="profile-item">
                      <span className="material-symbols-outlined">receipt_long</span>
                      Membership
                    </Link>

                    <Link to="/hired" className="profile-item">
                      <span className="material-symbols-outlined">work_history</span>
                      Hired Professionals
                    </Link>

                    <Link to="/my-bookings" className="profile-item">
                      <span className="material-symbols-outlined">assignment_ind</span>
                      My Work Bookings
                    </Link>

                    <Link to="/provider" className="profile-item">
                    <span class="material-symbols-outlined">engineering</span>
                      Become a Provider
                    </Link>

                    <Link to="/settings" className="profile-item">
                      <span className="material-symbols-outlined">settings</span>
                      Account Settings
                    </Link>

                    <div 
                      className="profile-item logout" 
                      onClick={() => auth.signOut()}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Log Out
                    </div>

                  </div>

                </div>
              )}
            </>
        )}
       </div>

      
      </div>
    </>
  );
};

export default Navbar;








/*import React,{useState,useContext}from 'react';
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom';
import {Context} from '../../Context/Context'

const Navbar=()=>{

    return(
    <div className='navbar'>
      <div className="nav-logo">
        {//<img  src={logo} alt="img"/>
        }
        <p>Skill Connect</p>
      </div>
        
  <div className="location-wrapper">
  <span className="material-symbols-outlined location-icon">search</span>

  <input
    className="form-control input-btn"
    type="text"
    placeholder="Search"
    name="search"
  />
</div>


 <div className="location-wrapper">
  <span className="material-symbols-outlined location-icon">location_on</span>

  <input
    className="form-control input-btn"
    type="text"
    placeholder="location"
    name="location"
  />
</div>



  <div className="nav-login-cart">
    <Link to="/cart"><img src={cart_icon} alt="cart"/></Link>
          {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Log Out</button>
        :<Link to="/login"><span class="material-symbols-outlined">account_circle</span></Link>
        }
          
         
        </div>
   </div>
  )
}
export default Navbar */
