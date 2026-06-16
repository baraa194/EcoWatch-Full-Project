import React, { useState } from "react";

export default function ForgotPassword({ goToVerifyToken }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendToken = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === email) {
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("resetToken", JSON.stringify({ email, token }));
      setMessage(`Verification token sent! (Check console for demo)`);
      console.log(`Token for ${email}: ${token}`);
      goToVerifyToken();
    } else {
      setMessage(" Email not found ");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg">
        <h3 className="mb-3">Forgot Password</h3>
        {message && <div className="mb-3">{message}</div>}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleSendToken}>
          Send Verification Code
        </button>
      </div>
    </div>
  );
}