import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./login.css";

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", age: "", email: "", occupation: "", password: "" });

  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);

  const navigate = useNavigate();

  const handleLoginChange = (e) => setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSignupChange = (e) => setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validatePassword = (pwd) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(pwd);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(loginData.email)) { setError("Enter a valid email address."); return; }
    if (!loginData.password) { setError("Please enter your password."); return; }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      //console.log(data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/onboarding");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.name.trim().length < 3) {
        setError("Name must be at least 3 characters.");
        return;
    }
    if (!signupData.age || signupData.age < 13 || signupData.age > 100) {
        setError("Enter a valid age (13 - 100).");
        return;
    }
    if (!emailRegex.test(signupData.email)) {
        setError("Enter a valid email address.");
        return;
    }
    if (!signupData.occupation) {
        setError("Please select your status.");
        return;
    }
    if (!validatePassword(signupData.password)) {
        setError("Password must contain letters and numbers.");
        return;
    }
    if (signupData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();
      //console.log(data);

      if (res.ok) {
        setIsLogin(true);

        setSignupData({
          name: "",
          age: "",
          email: "",
          occupation: "",
          password: ""
        });

        setError("Account created! Please login.");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  const switchMode = () => { setIsLogin((prev) => !prev); setError(""); };

  return (
    <div className={`auth-container ${isLogin ? "login-mode" : "signup-mode"}`}>

      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Build Your Future</h1>
          <p>{isLogin ? "Login to continue building your portfolio journey." : "Sign up to start building your developer identity."}</p>
          <button className="switch-btn" onClick={switchMode}>
            {isLogin ? "← Create Account" : "Login Instead →"}
          </button>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="forms-wrapper">
            
            <form onSubmit={handleLoginSubmit} className="form login-form">
              <h2>Welcome back</h2>

              <div className="form-section">
                <h3>Enter your credentials</h3>
                <input type="email" name="email" placeholder="Email Address" value={loginData.email} onChange={handleLoginChange} required />

                <div className="password-wrapper">
                  <input type={showLoginPwd ? "text" : "password"} name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
                  <button type="button" className="eye-btn" onClick={() => setShowLoginPwd((prev) => !prev)} aria-label="Toggle password visibility">
                    {showLoginPwd ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn">Login</button>
            </form>

            <form onSubmit={handleSignupSubmit} className="form signup-form">
              <h2>Get started</h2>

              <div className="form-section">
                <h3>Personal Details</h3>
                <input type="text" name="name" placeholder="Full Name" value={signupData.name} onChange={handleSignupChange} required />
                <input type="text" name="age" placeholder="Age" inputMode="numeric" pattern="[0-9]*" value={signupData.age} onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleSignupChange(e); }} required />
                <input type="email" name="email" placeholder="Email Address" value={signupData.email} onChange={handleSignupChange} required />
              </div>

              <div className="form-section">
                <h3>Professional Details</h3>
                <select name="occupation" value={signupData.occupation} onChange={handleSignupChange} required>
                  <option value="">Select your status</option>
                  <option value="student">Student</option>
                  <option value="working">Working Professional</option>
                  <option value="seeking">Looking for Work</option>
                </select>
              </div>

              <div className="form-section">
                <h3>Account Setup</h3>
                <div className="password-wrapper">
                  <input type={showSignupPwd ? "text" : "password"} name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} required />
                  <button type="button" className="eye-btn" onClick={() => setShowSignupPwd((prev) => !prev)} aria-label="Toggle password visibility">
                    {showSignupPwd ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-btn">Create Account</button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}