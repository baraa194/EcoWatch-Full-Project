import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaUserTag,
  FaLeaf,
  FaShieldAlt,
  FaRecycle
} from "react-icons/fa";
import { GiPlantsAndAnimals } from "react-icons/gi";

const API_BASE = "http://localhost:5233/api";

export default function RegisterPage({ goToLogin, onAPIRegister }) {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    age: "",
    phone: "",
    role: "Citizen"
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      let backendRole = "citizenUser";
      if (form.role === "Citizen") {
        backendRole = "citizenUser";
      } else if (form.role === "Recycler") {
        backendRole = "Recycler";
      } else if (form.role === "Admin") {
        backendRole = "Admin";
      }

    const payload = {
    UserName: form.userName.trim(),  
    Email: form.email.trim().toLowerCase(),
    Password: form.password,
    Location: form.location?.trim() || "",
    Age: form.age ? parseInt(form.age) : 0,
    Phone: form.phone?.trim() || "",
    Role: backendRole
};

      console.log("Sending payload:", payload);

      const registerRes = await fetch(`${API_BASE}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        let errorMessage = "Registration failed";
        if (registerData.message) errorMessage = registerData.message;
        else if (registerData.title) errorMessage = registerData.title;
        throw new Error(errorMessage);
      }

      setSuccess("Account created successfully! Logging you in...");

      const loginRes = await fetch(`${API_BASE}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          password: form.password
        }),
      });

      const loginData = await loginRes.json();

if (loginRes.ok && loginData.token) {
  localStorage.setItem("accessToken", loginData.token);
  localStorage.setItem("refreshToken", loginData.refreshToken || "");
  localStorage.setItem("currentUserName", form.userName);
  localStorage.setItem("userRole", form.role);
  
  try {
    const tokenParts = loginData.token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log("Token payload:", payload); 
      
      const userId = payload.sub || 
                     payload.nameid || 
                     payload.userId || 
                     payload.id || 
                     payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      
      if (userId) {
        localStorage.setItem("userId", userId);
        console.log("UserId stored:", userId);
      } else {
        console.warn("No userId found in token");
      }
    }
  } catch (e) {
    console.error("Error extracting userId:", e);
  }

  onAPIRegister(loginData.token, loginData.refreshToken, form.role);

      } else {
        setTimeout(() => goToLogin(), 2000);
      }

    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      {/* Floating Particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Glowing Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-3"></div>

      {/* Falling Leaves */}
      <div className="leaves-container">
        <div className="leaf leaf-1">☘️</div>
        <div className="leaf leaf-2">🌿</div>
        <div className="leaf leaf-3">☘️</div>
        <div className="leaf leaf-4">☘️</div>
        <div className="leaf leaf-5">☘️</div>
        <div className="leaf leaf-6">🌿</div>
      </div>

      {/* Plant Icon */}
      <div className="plant-icon-container">
        <GiPlantsAndAnimals className="plant-icon" />
      </div>

      <div className="register-wrapper">
        <div className="register-card">
          <div className="row g-0">
            {/* Left Side - Form */}
            <div className="col-lg-6">
              <div className="form-side">
                <div className="form-container">
                  
                  <div className="form-header">
                    <h2 className="form-title">Create Account</h2>
                    <p className="form-subtitle">Join the green revolution today</p>
                  </div>

                  {error && (
                    <div className="error-alert">
                      <FaShieldAlt />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="success-alert">
                      <FaRecycle />
                      <div>
                        <strong>Success!</strong> {success}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="register-form">
                    <div className="two-column">
                      {/* Username */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaUser className="input-icon" />
                        </div>
                        <input
                          name="userName"
                          className="form-input"
                          placeholder="Username *"
                          value={form.userName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaEnvelope className="input-icon" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          className="form-input"
                          placeholder="Email *"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Password */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaLock className="input-icon" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          className="form-input"
                          placeholder="Password *"
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaLock className="input-icon" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-input"
                          placeholder="Confirm Password *"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaPhone className="input-icon" />
                        </div>
                        <input
                          name="phone"
                          className="form-input"
                          placeholder="Phone (optional)"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Location */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaMapMarkerAlt className="input-icon" />
                        </div>
                        <input
                          name="location"
                          className="form-input"
                          placeholder="Location (optional)"
                          value={form.location}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Age */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaCalendar className="input-icon" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          name="age"
                          className="form-input"
                          placeholder="Age (optional)"
                          value={form.age}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Role */}
                      <div className="input-group-custom">
                        <div className="input-icon-wrapper">
                          <FaUserTag className="input-icon" />
                        </div>
                        <select
                          name="role"
                          className="form-input"
                          value={form.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="Citizen">Citizen</option>
                          <option value="Recycler">Recycler</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="register-button" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <FaLeaf />
                          Create Account
                        </>
                      )}
                    </button>
                  </form>

                  <div className="login-link">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      className="login-button-link"
                      onClick={(e) => {
                        e.preventDefault();
                        goToLogin();
                      }}
                    >
                      Login here
                    </button>
                  </div>

                  <div className="trust-badge">
                    <FaShieldAlt />
                    <span>Secure & encrypted registration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Brand Message */}
            <div className="col-lg-6 d-none d-lg-block p-0">
              <div className="empty-side">
                <div className="content">
                  <div className="brand-badge">
                    <FaLeaf className="brand-icon" />
                    <span>EcoWatch</span>
                  </div>
                  <h2>Join Us Today!</h2>
                  <p>Start your journey towards a greener tomorrow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        }

        /* Floating Particles */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 15s infinite ease-in-out;
        }

        .particle:nth-child(1) { width: 200px; height: 200px; top: 10%; left: 5%; animation-delay: 0s; }
        .particle:nth-child(2) { width: 150px; height: 150px; top: 60%; right: 10%; animation-delay: 2s; }
        .particle:nth-child(3) { width: 300px; height: 300px; bottom: 10%; left: 15%; animation-delay: 4s; }
        .particle:nth-child(4) { width: 100px; height: 100px; top: 30%; right: 20%; animation-delay: 6s; }
        .particle:nth-child(5) { width: 250px; height: 250px; bottom: 30%; right: 25%; animation-delay: 8s; }
        .particle:nth-child(6) { width: 180px; height: 180px; top: 70%; left: 20%; animation-delay: 10s; }

        /* Glowing Orbs */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 1;
          animation: pulse 8s infinite alternate;
        }

        .orb-1 { width: 400px; height: 400px; background: rgba(76, 175, 80, 0.3); top: -100px; right: -100px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(46, 125, 50, 0.25); bottom: -150px; left: -150px; animation-delay: 2s; }
        .orb-3 { width: 300px; height: 300px; background: rgba(102, 187, 106, 0.2); top: 40%; left: 40%; animation-delay: 4s; }

        /* Falling Leaves */
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
          color: rgba(255, 255, 255, 0.4);
          animation: fall linear infinite;
        }

        .leaf-1 { left: 10%; animation-duration: 15s; animation-delay: 0s; }
        .leaf-2 { left: 30%; animation-duration: 18s; animation-delay: 2s; }
        .leaf-3 { left: 50%; animation-duration: 14s; animation-delay: 4s; }
        .leaf-4 { left: 70%; animation-duration: 20s; animation-delay: 1s; }
        .leaf-5 { left: 90%; animation-duration: 16s; animation-delay: 3s; }
        .leaf-6 { left: 20%; animation-duration: 22s; animation-delay: 5s; }

        @keyframes fall {
          0% { top: -10%; opacity: 0; transform: translateX(0) rotate(0deg); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; transform: translateX(100px) rotate(360deg); }
        }

        /* Plant Icon */
        .plant-icon-container {
          position: absolute;
          bottom: 10%;
          right: 5%;
          z-index: 1;
          animation: floatPlant 6s ease-in-out infinite;
        }

        .plant-icon {
          font-size: 12rem;
          color: rgba(255, 255, 255, 0.15);
          transform: rotate(-10deg);
        }

        @keyframes floatPlant {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.1); }
        }

        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.7; transform: scale(1.2); }
        }

        /* Register Wrapper */
        .register-wrapper {
          width: 100%;
          max-width: 1200px;
          position: relative;
          z-index: 20;
          animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Register Card */
        .register-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 50, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Form Side */
        .form-side {
          padding: 50px 40px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          min-height: 800px;
          display: flex;
          align-items: center;
        }

        .form-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .form-header {
          margin-bottom: 30px;
        }

        .form-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #0a4d2a;
          text-shadow: 0 0 20px rgba(10, 77, 42, 0.3);
        }

        .form-subtitle {
          color: #2a6a3a;
          font-size: 1rem;
        }

        /* Error & Success Alerts */
        .error-alert, .success-alert {
          padding: 16px 20px;
          border-radius: 20px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(10px);
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .success-alert {
          background: rgba(10, 77, 42, 0.1);
          color: #0a4d2a;
          border: 1px solid rgba(10, 77, 42, 0.2);
        }

        /* Form */
        .register-form {
          width: 100%;
        }

        .two-column {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }

        .input-group-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 0 16px;
          border: 1px solid rgba(10, 77, 42, 0.2);
          transition: all 0.3s ease;
        }

        .input-group-custom:focus-within {
          border-color: #0a4d2a;
          box-shadow: 0 0 0 4px rgba(10, 77, 42, 0.15);
          background: white;
        }

        .input-group-custom.full-width {
          grid-column: span 2;
        }

        .input-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-icon {
          color: #0a4d2a;
          font-size: 1rem;
          opacity: 0.7;
        }

        .form-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 15px 0;
          font-size: 0.95rem;
          color: #0a4d2a;
          outline: none;
          width: 100%;
        }

        .form-input::placeholder {
          color: #7a9a82;
        }

        select.form-input {
          cursor: pointer;
        }

        /* Register Button */
        .register-button {
          width: 100%;
          padding: 16px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #0a4d2a 0%, #1a6a3a 100%);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(10, 77, 42, 0.4);
          margin-top: 20px;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(10, 77, 42, 0.6);
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        /* Login Link */
        .login-link {
          margin-top: 25px;
          text-align: center;
          color: #2a6a3a;
        }

        .login-button-link {
          background: none;
          border: none;
          color: #0a4d2a;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          margin-left: 5px;
        }

        .login-button-link:hover {
          color: #1a6a3a;
          text-decoration: underline;
        }

        /* Trust Badge */
        .trust-badge {
          margin-top: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #2a6a3a;
          font-size: 0.85rem;
        }

        .trust-badge svg {
          color: #0a4d2a;
        }

        /* Right Side - Empty with brand message */
        .empty-side {
          height: 100%;
          min-height: 800px;
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
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-side {
            padding: 30px 20px;
          }

          .two-column {
            grid-template-columns: 1fr;
          }

          .form-title {
            font-size: 2rem;
          }

          .plant-icon {
            font-size: 8rem;
          }

          .leaf {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}