import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuthoritiesPage({ goToHome }) {
  const [authorities, setAuthorities] = useState([]);
  const [newAuthority, setNewAuthority] = useState({
    name: "",
    contactEmail: "",
    password: "",
    contactPhone: "",
    region: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5233/api/Authorities";

  useEffect(() => {
    const fetchAuthorities = async () => {
      console.log("📡 Fetching authorities from:", API_URL);
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(API_URL);
        console.log("📡 Response status:", response.status);
        
        if (!response.ok) throw new Error(`Failed to fetch authorities: ${response.status}`);
        
        const data = await response.json();
        console.log("📦 Received data:", data);
        setAuthorities(data);
      } catch (error) {
        console.error("❌ Error fetching authorities:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuthorities();
  }, []);

  const handleAdd = async () => {
    if (!newAuthority.name.trim()) {
      alert("Please enter a valid name");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Adding authority:", newAuthority);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAuthority),
      });

      console.log("📡 Add response status:", response.status);

      if (!response.ok) throw new Error("Failed to add authority");

      const created = await response.json();
      console.log("✅ Created authority:", created);
      
      setAuthorities((prev) => [...prev, created]);
      setNewAuthority({
        name: "",
        contactEmail: "",
        contactPhone: "",
        region: "",
        isActive: true,
      });
    } catch (error) {
      console.error("❌ Error adding authority:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteById = async (id) => {
    if (!window.confirm("Are you sure you want to delete this authority?")) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Deleting authority:", id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      console.log("📡 Delete response status:", response.status);

      if (response.ok) {
        setAuthorities((prev) => prev.filter((a) => a.id !== id));
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert("❌ " + (errorData.message || "Failed to delete authority"));
      }
    } catch (error) {
      console.error("❌ Error deleting authority:", error);
      alert("❌ An error occurred during deletion: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    const authority = authorities.find(a => a.id === id);
    if (!authority) return;

    const newStatus = !authority.isActive;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Toggling authority status:", id, "to", newStatus);
      const response = await fetch(`${API_URL}/${id}/status?active=${newStatus}`, {
        method: "PATCH",
      });

      console.log("📡 Toggle response status:", response.status);

      if (response.ok) {
        setAuthorities((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, isActive: newStatus } : a
          )
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert("❌ " + (errorData.message || "Failed to update status."));
      }
    } catch (error) {
      console.error("❌ Error toggling status:", error);
      alert("❌ An error occurred while updating the status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authorities-container">
      {/* Header Section */}
      <div className="authorities-header">
        <div className="header-content">
          <i className="fas fa-building header-icon"></i>
          <div>
            <h1>Authorities Management</h1>
            <p>Manage regulatory authorities and their permissions</p>
          </div>
        </div>
        {goToHome && (
          <button className="back-btn" onClick={goToHome}>
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Add New Authority Form */}
      <div className="add-form-card">
        <div className="form-header">
          <i className="fas fa-plus-circle"></i>
          <h3>Add New Authority</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-tag"></i>
              Authority Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Environmental Agency"
              value={newAuthority.name}
              onChange={(e) =>
                setNewAuthority({ ...newAuthority, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="contact@agency.gov"
              value={newAuthority.contactEmail}
              onChange={(e) =>
                setNewAuthority({ ...newAuthority, contactEmail: e.target.value })
              }
            />
          </div>
          <div className="form-group">
  <label className="form-label">
    <i className="fas fa-lock"></i>
    Password <span className="required-star">*</span>
  </label>
  <input
    type="password"
    className="form-input"
    placeholder="Enter temporary password"
    value={newAuthority.password}
    onChange={(e) =>
      setNewAuthority({ ...newAuthority, password: e.target.value })
    }
  />
</div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-phone"></i>
              Phone Number
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="+20 123 456 7890"
              value={newAuthority.contactPhone}
              onChange={(e) =>
                setNewAuthority({ ...newAuthority, contactPhone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-map-marker-alt"></i>
              Region
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Cairo"
              value={newAuthority.region}
              onChange={(e) =>
                setNewAuthority({ ...newAuthority, region: e.target.value })
              }
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newAuthority.isActive}
                onChange={(e) =>
                  setNewAuthority({ ...newAuthority, isActive: e.target.checked })
                }
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Set as active</span>
            </label>
          </div>

          <div className="form-group button-group">
            <button
              className="add-btn"
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Add Authority
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Authorities Table */}
      {loading && authorities.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading authorities...</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              <i className="fas fa-list"></i>
              <h3>All Authorities</h3>
            </div>
            <span className="table-count">{authorities.length} total</span>
          </div>
          
          <div className="table-responsive">
            <table className="authorities-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Authority Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Region</th>
                  <th>Status</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {authorities.length > 0 ? (
                  authorities.map((a) => (
                    <tr key={a.id}>
                      <td><span className="id-badge">#{a.id}</span></td>
                      <td className="authority-name">
                        <i className="fas fa-building"></i>
                        {a.name}
                      </td>
                      <td>
                        <a href={`mailto:${a.contactEmail}`} className="email-link">
                          <i className="fas fa-envelope"></i>
                          {a.contactEmail || "—"}
                        </a>
                      </td>
                      <td>
                        {a.contactPhone ? (
                          <a href={`tel:${a.contactPhone}`} className="phone-link">
                            <i className="fas fa-phone"></i>
                            {a.contactPhone}
                          </a>
                        ) : "—"}
                      </td>
                      <td>
                        <span className="region-badge">
                          <i className="fas fa-map-marker-alt"></i>
                          {a.region || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${a.isActive ? "active" : "inactive"}`}>
                          {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {a.userId ? (
                          <span className="user-id">{a.userId}</span>
                        ) : "—"}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className={`action-btn ${a.isActive ? "deactivate" : "activate"}`}
                            onClick={() => handleToggleActive(a.id)}
                            disabled={loading}
                            title={a.isActive ? "Deactivate" : "Activate"}
                          >
                            <i className={`fas fa-${a.isActive ? "ban" : "check-circle"}`}></i>
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteById(a.id)}
                            disabled={loading}
                            title="Delete Authority"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <i className="fas fa-building"></i>
                      <p>No authorities found</p>
                      <p className="empty-sub">Add your first authority to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .authorities-container {
  padding: 20px; /* قلليها شوية بدل 30px */
  max-width: 1400px;
  margin: 0 auto;
}
        /* Header Styles */
        .authorities-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          padding: 10px 30px;
          border-radius: 28px;
          box-shadow: 0 10px 30px rgba(0, 40, 0, 0.06);
          border: 1px solid rgba(21, 87, 36, 0.08);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          font-size: 2.5rem;
          color: #C5A059;
          filter: drop-shadow(0 5px 15px rgba(197, 160, 89, 0.3));
        }

        .header-content h1 {
          font-size: 1.8rem;
          margin: 0 0 5px 0;
          background: linear-gradient(135deg, #0a2f1a 0%, #1a4d2a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-content p {
          margin: 0;
          color: #5a6b5e;
          font-size: 1rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 50px;
          border: 1px solid rgba(21, 87, 36, 0.15);
          background: white;
          color: #1a4d2a;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(21, 87, 36, 0.05);
          border-color: #155724;
          transform: translateX(-3px);
        }

        /* Error Message */
        .error-message {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
          padding: 16px 20px;
          border-radius: 20px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        /* Add Form Card */
        .add-form-card {
          background: white;
          border-radius: 32px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .form-header i {
          font-size: 2rem;
          color: #C5A059;
        }

        .form-header h3 {
          font-size: 1.4rem;
          margin: 0;
          color: #1a3f25;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a3f25;
          margin-bottom: 8px;
        }

        .form-label i {
          color: #C5A059;
          font-size: 0.9rem;
        }

        .required-star {
          color: #dc3545;
          margin-left: 2px;
        }

        .form-input {
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(21, 87, 36, 0.15);
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #C5A059;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
          outline: none;
          background: white;
        }

        .checkbox-group {
          justify-content: flex-end;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 12px 0;
        }

        .checkbox-label input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 2px solid rgba(21, 87, 36, 0.3);
          background: white;
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-label input:checked + .checkbox-custom {
          background: #C5A059;
          border-color: #C5A059;
        }

        .checkbox-label input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
        }

        .checkbox-text {
          color: #1a3f25;
          font-size: 0.95rem;
        }

        .button-group {
          justify-content: flex-end;
        }

        .add-btn {
          padding: 12px 24px;
          border-radius: 50px;
          border: none;
          background: linear-gradient(135deg, #C5A059 0%, #E5C687 100%);
          color: #0a2f1a;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(197, 160, 89, 0.3);
          width: 100%;
        }

        .add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(197, 160, 89, 0.4);
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10, 47, 26, 0.3);
          border-top-color: #0a2f1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Table Card */
        .table-card {
          background: white;
          border-radius: 32px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .table-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-title i {
          font-size: 1.5rem;
          color: #C5A059;
        }

        .table-title h3 {
          font-size: 1.2rem;
          margin: 0;
          color: #1a3f25;
        }

        .table-count {
          padding: 6px 16px;
          background: rgba(197, 160, 89, 0.1);
          border-radius: 50px;
          color: #C5A059;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .authorities-table {
          width: 100%;
          border-collapse: collapse;
        }

        .authorities-table th {
          text-align: left;
          padding: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #5a6b5e;
          border-bottom: 2px solid rgba(197, 160, 89, 0.2);
          white-space: nowrap;
        }

        .authorities-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(21, 87, 36, 0.1);
          color: #2d3f33;
        }

        .authorities-table tbody tr {
          transition: all 0.3s ease;
        }

        .authorities-table tbody tr:hover {
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          transform: scale(1.01);
          box-shadow: 0 5px 15px rgba(197, 160, 89, 0.1);
        }

        .id-badge {
          display: inline-block;
          padding: 4px 8px;
          background: rgba(197, 160, 89, 0.1);
          border-radius: 8px;
          color: #C5A059;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .authority-name {
          font-weight: 600;
          color: #1a3f25;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .authority-name i {
          color: #C5A059;
        }

        .email-link, .phone-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #1a4d2a;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .email-link:hover, .phone-link:hover {
          color: #C5A059;
        }

        .region-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(197, 160, 89, 0.05);
          border-radius: 50px;
          font-size: 0.85rem;
          color: #1a3f25;
        }

        .region-badge i {
          color: #C5A059;
          font-size: 0.8rem;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .status-badge.inactive {
          background: rgba(108, 117, 125, 0.1);
          color: #6c757d;
        }

        .user-id {
          font-family: monospace;
          font-size: 0.85rem;
          color: #1a4d2a;
          background: rgba(197, 160, 89, 0.05);
          padding: 4px 8px;
          border-radius: 8px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .action-btn.activate {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .action-btn.activate:hover {
          background: #28a745;
          color: white;
          transform: translateY(-2px);
        }

        .action-btn.deactivate {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }

        .action-btn.deactivate:hover {
          background: #ffc107;
          color: white;
          transform: translateY(-2px);
        }

        .action-btn.delete {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .action-btn.delete:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 32px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
        }

        .loading-state .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 20px;
          border: 3px solid rgba(197, 160, 89, 0.1);
          border-top-color: #C5A059;
        }

        .loading-state p {
          color: #5a6b5e;
          font-size: 1rem;
          margin: 0;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px !important;
        }

        .empty-state i {
          font-size: 3rem;
          color: #C5A059;
          opacity: 0.5;
          margin-bottom: 15px;
          display: block;
        }

        .empty-state p {
          font-size: 1.1rem;
          color: #1a3f25;
          margin-bottom: 5px;
        }

        .empty-sub {
          font-size: 0.9rem !important;
          color: #8a9b90 !important;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .authorities-container {
            padding: 20px;
          }

          .authorities-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .header-content {
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .checkbox-group {
            justify-content: flex-start;
          }

          .table-card {
            padding: 20px;
          }

          .authorities-table th,
          .authorities-table td {
            padding: 12px;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}