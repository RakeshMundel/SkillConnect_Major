import React, { useState } from "react";
import "./LoginSignup.css";
import { googleSignIn, auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Signup Logic
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (formData.name) {
          await updateProfile(res.user, { displayName: formData.name });
        }
      }
      // Redirect on success
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="subtitle">{isLogin ? "Login to your account" : "Join the Skill Connect community"}</p>

        {error && <div className="error-message">{error}</div>}

        <button className="google-login" onClick={handleGoogleLogin}>
          <img
            src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
            alt="Google"
            className="google-icon"
          />
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form className="login-form" onSubmit={handleAuth}>
          {!isLogin && (
            <div className="form-group">
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
          )}
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p className="toggle-auth">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
