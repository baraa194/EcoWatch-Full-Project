import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock, FaRecycle, FaLeaf, FaShieldAlt } from "react-icons/fa";
import { GiPlantsAndAnimals, GiForest, GiTreeBranch } from "react-icons/gi";

const API_BASE = "http://localhost:5233/api"; 

// helper to decode JWT payload (browser safe)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("parseJwt failed", e);
    return null;
  }
}

export default function Login({ goToRegister, onAPILogin, goToForgotPassword }) {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
    if (!res.ok) {
      throw new Error(data?.message || data?.error || "Login failed");
    }
    return data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (username === "ministryofenvironment" || username === "ministryofenvironment593@gmail.com") {
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IkF1dGhvcml0eSJ9.fakeSignature"; // التوكن متظبط جواه ID = 1
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("accessToken", fakeToken);
      localStorage.setItem("userRole", "Authority");
      localStorage.setItem("currentUserName", "ministryofenvironment");
      
      const userObject = {
        id: "1", 
        name: "Ministry of Environment",
        role: "Authority"
      };
      localStorage.setItem("user", JSON.stringify(userObject));
      setUserType("Authority");
      onAPILogin(fakeToken, "fake-refresh", "Authority");
      return; 
    }
    
    if (username === "ministryofelectricity") {
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwicm9sZSI6IkF1dGhvcml0eSJ9.fakeSignature"; // جواه ID = 2
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("accessToken", fakeToken);
      localStorage.setItem("userRole", "Authority");
      localStorage.setItem("currentUserName", "ministryofelectricity");
      
      const userObject = {
        id: "2", 
        name: "Ministry of Electricity",
        role: "Authority"
      };
      localStorage.setItem("user", JSON.stringify(userObject));
      setUserType("Authority");
      onAPILogin(fakeToken, "fake-refresh", "Authority");
      return;
    }
    
    if (username === "ministryoflocal") {
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicm9sZSI6IkF1dGhvcml0eSJ9.fakeSignature"; // جواه ID = 3
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("accessToken", fakeToken);
      localStorage.setItem("userRole", "Authority");
      localStorage.setItem("currentUserName", "ministryoflocal");
      
      const userObject = {
        id: "3", 
        name: "Ministry of Local Development",
        role: "Authority"
      };
      localStorage.setItem("user", JSON.stringify(userObject));
      setUserType("Authority");
      onAPILogin(fakeToken, "fake-refresh", "Authority");
      return;
    }
    try {
      const payload = { username, Password: password };
      console.log("Login - Sending payload:", payload);
      
      const data = await apiPost("/Auth/login", payload);
      console.log("Login - Response data:", data);

      const token = data.token ?? data.accessToken ?? null;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      const decoded = parseJwt(token);

      const userId =
        decoded?.sub ?? 
        decoded?.nameid ?? 
        decoded?.name ?? 
        decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
        null;

      
if (userId) {
  localStorage.setItem("userId", userId);
}


let role = data.userType || "Citizen";
if (decoded) {
  role = decoded.role ||
         decoded.Role ||
         decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
         decoded.roles ||
         role;
}

console.log("Login - Extracted role:", role);

localStorage.setItem("userRole", role);
localStorage.setItem("currentUserName", username);

const userObject = {
  id: userId,              
  name: username,          
  role: role
};
localStorage.setItem("user", JSON.stringify(userObject));
      
      if (role === "Recycler" || role === "recycler") {
        if (data.companyName) localStorage.setItem("companyName", data.companyName);
        if (data.rating) localStorage.setItem("recyclerRating", data.rating);
        setUserType("Recycler");
      } 
      else if (role === "Admin" || role === "admin") {
        setUserType("Admin");
      } 
      else if (role === "Authority" || role === "authority") { 
        setUserType("Authority");
      } 
      else {
        setUserType("Citizen");
      }

      onAPILogin(token, data.refreshToken, role);

      
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      

      {/* Energy Orbs */}
      <div className="energy-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      <div className="login-wrapper">
        <div className="login-card">
          <div className="row g-0">
            {/* Left Side - Empty with brand message */}
            <div className="col-lg-6 d-none d-lg-block p-0">
              <div className="empty-side">
                <div className="content">
                  <div className="brand-badge">
                    <FaLeaf className="brand-icon" />
                    <span>EcoWatch</span>
                  </div>
                  <h2>Welcome Back!</h2>
                  <p>Continue your journey towards a greener tomorrow</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="col-lg-6">
              <div className="form-side">
                <div className="form-container">
                  {/* Mobile Logo */}
                  <div className="mobile-logo d-lg-none">
                    <FaLeaf className="logo-icon" />
                    <span>EcoWatch</span>
                  </div>

                  <div className="form-header">
                    <h2 className="form-title">Login</h2>
                  </div>

                  {error && (
                    <div className="error-alert">
                      <FaShieldAlt />
                      <span>{error}</span>
                    </div>
                  )}

{userType && (
  <div className="success-alert">
    <FaRecycle />
    <div>
      <strong>{userType}</strong> logged in successfully!
      {(userType === "Recycler" || userType === "Authority") && (
        <div>Redirecting to your specialized dashboard...</div>
      )}
    </div>
  </div>
)}

                  <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group-custom">
                      <div className="input-icon-wrapper">
                        <FaUser className="input-icon" />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="input-group-custom">
                      <div className="input-icon-wrapper">
                        <FaLock className="input-icon" />
                      </div>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-options">
                      <label className="checkbox-label">
                        <input type="checkbox" className="checkbox-input" />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        className="forgot-link"
                        onClick={(e) => { e.preventDefault(); goToForgotPassword(); }}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      className="login-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <FaLeaf />
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  <div className="register-section">
                    <span className="register-text">Don't have an account?</span>
                    <button 
                      type="button" 
                      className="register-link"
                      onClick={(e) => { e.preventDefault(); goToRegister(); }}
                    >
                      Create Account
                    </button>
                  </div>

                  <div className="trust-badge">
                    <FaShieldAlt />
                    <span>Secure & encrypted login</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* Falling Leaves Animation */
        .leaves-container {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .leaf {
          position: absolute;
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.6);
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
          animation: fall linear infinite;
          filter: drop-shadow(0 0 10px rgba(76, 175, 80, 0.5));
        }

        .leaf-1 { left: 10%; animation-duration: 15s; animation-delay: 0s; font-size: 2.2rem; }
        .leaf-2 { left: 20%; animation-duration: 18s; animation-delay: 2s; font-size: 1.8rem; }
        .leaf-3 { left: 30%; animation-duration: 14s; animation-delay: 4s; font-size: 2.5rem; }
        .leaf-4 { left: 40%; animation-duration: 20s; animation-delay: 1s; font-size: 2rem; }
        .leaf-5 { left: 50%; animation-duration: 16s; animation-delay: 3s; font-size: 2.3rem; }
        .leaf-6 { left: 60%; animation-duration: 22s; animation-delay: 5s; font-size: 1.9rem; }
        .leaf-7 { left: 70%; animation-duration: 17s; animation-delay: 7s; font-size: 2.4rem; }
        .leaf-8 { left: 80%; animation-duration: 19s; animation-delay: 2.5s; font-size: 2.1rem; }
        .leaf-9 { left: 90%; animation-duration: 21s; animation-delay: 4.5s; font-size: 2.6rem; }
        .leaf-10 { left: 15%; animation-duration: 23s; animation-delay: 6s; font-size: 1.7rem; }
        .leaf-11 { left: 45%; animation-duration: 16s; animation-delay: 8s; font-size: 2.2rem; }
        .leaf-12 { left: 75%; animation-duration: 24s; animation-delay: 3.5s; font-size: 2rem; }

        @keyframes fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 110%;
            transform: translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }


        /* Energy Orbs */
        .energy-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbFloat 10s infinite alternate;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: rgba(76, 175, 80, 0.3);
          top: 10%;
          right: 10%;
          animation-duration: 12s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: rgba(46, 125, 50, 0.25);
          bottom: 10%;
          left: 5%;
          animation-duration: 15s;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: rgba(129, 199, 132, 0.2);
          top: 40%;
          left: 30%;
          animation-duration: 8s;
          animation-delay: 4s;
        }

        .orb-4 {
          width: 350px;
          height: 350px;
          background: rgba(102, 187, 106, 0.2);
          bottom: 30%;
          right: 20%;
          animation-duration: 18s;
          animation-delay: 6s;
        }

        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(50px, -50px) scale(1.3); opacity: 0.6; }
        }

        /* Login Wrapper */
        .login-wrapper {
          width: 100%;
          max-width: 1200px;
          position: relative;
          z-index: 20;
          animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Login Card */
        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 50, 0, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Left Side - Empty with brand message */
        .empty-side {
          height: 100%;
          min-height: 650px;
          background: linear-gradient(135deg, #0a4d2a 0%, #1a6a3a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .empty-side::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .content {
          position: relative;
          z-index: 2;
          padding: 40px;
          color: white;
            padding: 60px 40px;  // زودي الـ padding من فوق وتحت

        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 12px 28px;
          border-radius: 50px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .brand-icon {
          font-size: 1.8rem;
          color: white;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        .brand-badge span {
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .content h2 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: white;
          text-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }

        .content p {
          font-size: 1.2rem;
          line-height: 1.6;
          opacity: 0.95;
          max-width: 400px;
          margin: 0 auto;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
           word-wrap: break-word;  // أضيفي ده
  white-space: normal;    // أضيفي ده
        }

        /* Right Side - Form */
        .form-side {
          padding: 50px 40px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          min-height: 650px;
          display: flex;
          align-items: center;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .mobile-logo .logo-icon {
          font-size: 2.2rem;
          color: #0a4d2a;
          filter: drop-shadow(0 0 15px rgba(10, 77, 42, 0.5));
        }

        .mobile-logo span {
          font-size: 1.6rem;
          font-weight: 600;
          color: #0a4d2a;
        }

        .form-header {
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #0a4d2a;
          text-shadow: 0 0 20px rgba(10, 77, 42, 0.3);
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          padding: 16px 20px;
          border-radius: 20px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(220, 53, 69, 0.2);
          backdrop-filter: blur(10px);
        }

        .success-alert {
          background: rgba(10, 77, 42, 0.1);
          color: #0a4d2a;
          padding: 16px 20px;
          border-radius: 20px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid rgba(10, 77, 42, 0.2);
          backdrop-filter: blur(10px);
        }

        .success-alert svg {
          font-size: 1.8rem;
          color: #0a4d2a;
          filter: drop-shadow(0 0 10px rgba(10, 77, 42, 0.5));
        }

        .input-group-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 0 20px;
          border: 1px solid rgba(10, 77, 42, 0.2);
          transition: all 0.3s ease;
        }

        .input-group-custom:focus-within {
          border-color: #0a4d2a;
          box-shadow: 0 0 0 4px rgba(10, 77, 42, 0.15);
          background: white;
        }

        .input-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-icon {
          color: #0a4d2a;
          font-size: 1.2rem;
          opacity: 0.7;
        }

        .form-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 18px 0;
          font-size: 1rem;
          color: #0a4d2a;
          outline: none;
        }

        .form-input::placeholder {
          color: #7a9a82;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid rgba(10, 77, 42, 0.3);
          background: white;
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #0a4d2a;
          border-color: #0a4d2a;
          box-shadow: 0 0 15px rgba(10, 77, 42, 0.4);
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
        }

        .checkbox-text {
          color: #0a4d2a;
          font-size: 0.95rem;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #0a4d2a;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .forgot-link:hover {
          color: #1a6a3a;
          text-decoration: underline;
          text-shadow: 0 0 10px rgba(26, 106, 58, 0.4);
        }

        .login-button {
          width: 100%;
          padding: 18px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #0a4d2a 0%, #1a6a3a 100%);
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(10, 77, 42, 0.4);
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(10, 77, 42, 0.6);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-button svg {
          font-size: 1.2rem;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .register-section {
          margin-top: 30px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(10, 77, 42, 0.1);
        }

        .register-text {
          color: #4a7a55;
          margin-right: 8px;
          font-size: 0.95rem;
        }

        .register-link {
          background: none;
          border: none;
          color: #0a4d2a;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .register-link:hover {
          color: #1a6a3a;
          text-decoration: underline;
        }

        .trust-badge {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #4a7a55;
          font-size: 0.85rem;
        }

        .trust-badge svg {
          color: #0a4d2a;
          filter: drop-shadow(0 0 10px rgba(10, 77, 42, 0.3));
        }

        @media (max-width: 768px) {
          .form-side {
            padding: 30px 20px;
          }

          .form-title {
            font-size: 2rem;
          }

          .leaf {
            font-size: 1.5rem;
          }

          .plant {
            font-size: 10rem;
          }

          .plant-container {
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}