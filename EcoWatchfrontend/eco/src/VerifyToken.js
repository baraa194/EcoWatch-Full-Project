import React, { useState } from "react";

export default function VerifyToken({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = () => {
    const storedToken = JSON.parse(localStorage.getItem("resetToken"));
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedToken &&
      storedToken.email === email &&
      storedToken.token === token &&
      storedUser &&
      storedUser.email === email
    ) {
      storedUser.password = newPassword;
      localStorage.setItem("user", JSON.stringify(storedUser));
      localStorage.removeItem("resetToken");
      setMessage("Password reset successfully");
      setTimeout(() => goToLogin(), 1500);
    } else {
      setMessage("Invalid email or token");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg">
        <h3 className="mb-3">Reset Password</h3>
        {message && <div className="mb-3">{message}</div>}
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter verification code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="btn btn-success w-100" onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}
