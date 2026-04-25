import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const auth = getAuth();
  const [currUser, setCurrUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set("query", search.trim());
    if (locationInput.trim()) params.set("location", locationInput.trim());

    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

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
    <div className='navbar'>
      <div className="nav-logo">
        <a className="navbar-brand" href='/'>Skill Connect</a>
      </div>

      <form className="location-wrapper" role="search" onSubmit={handleSubmit}>
        <span className="material-symbols-outlined location-icon">search</span>
        <input
          className="form-control input-btn"
          type="search"
          placeholder="Search the Service"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <form className="location-wrapper" onSubmit={handleSubmit}>
        <span className="material-symbols-outlined location-icon">location_on</span>
        <input
          className="form-control input-btn"
          type="text"
          placeholder="Location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
      </form>

      <div className="nav-login-signup ">
        {!currUser ? (
          <>
            <Link className="btn custom-btn me-2" to="/signup"><b>Sign Up</b></Link>
            <Link className="btn custom-btn" to="/login"><b>Log In</b></Link>
          </>
        ) : (
          <>
            <span
              className="material-symbols-outlined profile-icon"
              onClick={() => setOpenSidebar(!openSidebar)}
            >
              account_circle
            </span>

            {openSidebar && (
              <div className="profile-sidebar" ref={sidebarRef}>
                <div className="profile-header">
                  <span className="material-symbols-outlined profile-avatar">account_circle</span>
                  <h4>{currUser.displayName || "User Name"}</h4>
                  <p>Profession</p>
                </div>

                <hr />

                <div className="profile-menu">
                  <Link to="/profile" className="profile-item">
                    <span className="material-symbols-outlined">person</span>
                    Your Profile
                  </Link>

                  <Link to="/membership" className="profile-item">
                    <span className="material-symbols-outlined">receipt_long</span>
                    Membership
                  </Link>

                  <Link to="/provider" className="profile-item">
                    <span className="material-symbols-outlined">engineering</span>
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
  );
};

export default Navbar;
