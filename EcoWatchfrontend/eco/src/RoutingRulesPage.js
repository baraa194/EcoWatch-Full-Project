import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RoutingRulesPage() {
  const [rules, setRules] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [newRule, setNewRule] = useState({
    category: "",
    region: "",
    authorityId: "",
    priority: 1,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5233/api/rules");
        if (!res.ok) throw new Error("Failed to fetch rules");
        const data = await res.json();
        console.log("📦 Loaded Rules from API:", data);

        const mappedRules = data.map((r) => ({
          id: r.id,
          category: r.category,
          region: r.region === "*" ? "All Regions" : r.region,
          authorityName: r.authorityName,
          authorityEmail: r.authorityEmail,
          priority: r.priority,
          isActive: r.isActive,
        }));

        setRules(mappedRules);

        const uniqueAuthorities = [
          ...new Map(
            data.map((r) => [r.authorityEmail, { id: r.id, name: r.authorityName }])
          ).values(),
        ];
        setAuthorities(uniqueAuthorities);
      } catch (error) {
        console.error("❌ Error loading routing rules:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newRule.category || !newRule.region || !newRule.authorityId) return;

    try {
      setLoading(true);
      setError(null);

      const selectedAuth = authorities.find(
        (a) => a.id === parseInt(newRule.authorityId)
      );

      const payload = {
        category: newRule.category,
        region: newRule.region,
        authorityName: selectedAuth?.name || "Unknown",
        authorityEmail: selectedAuth?.email || "N/A",
        priority: newRule.priority,
        isActive: newRule.isActive,
      };

      const res = await fetch("http://localhost:5233/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create rule");
      const created = await res.json();
      console.log("✅ Added Rule:", created);

      setRules([...rules, created]);
      setNewRule({
        category: "",
        region: "",
        authorityId: "",
        priority: 1,
        isActive: true,
      });
    } catch (err) {
      console.error("❌ Error adding rule:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this routing rule?")) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5233/api/rules/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRules(rules.filter((r) => r.id !== id));
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert("❌ " + (errorData.message || "Failed to delete routing rule"));
      }
    } catch (error) {
      console.error("❌ Error deleting rule:", error);
      alert("❌ An error occurred during deletion: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;

    const newStatus = !rule.isActive;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5233/api/rules/${id}/status?isActive=${newStatus}`, {
        method: "PATCH",
      });

      if (response.ok) {
        setRules((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, isActive: newStatus } : r
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
    <div className="routing-dashboard">
      {/* Header Section */}
      <div className="routing-header">
        <div className="header-content">
          <i className="fas fa-code-branch header-icon"></i>
          <div>
            <h1>Routing Rules Management</h1>
            <p>Configure email routing and distribution rules</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Add Rule Form */}
      <div className="add-form-card">
        <div className="form-header">
          <i className="fas fa-plus-circle"></i>
          <h3>Add New Routing Rule</h3>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-tag"></i>
              Category <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Complaint, Inquiry"
              value={newRule.category}
              onChange={(e) =>
                setNewRule({ ...newRule, category: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-map-marker-alt"></i>
              Region <span className="required-star">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Cairo, * for all"
              value={newRule.region}
              onChange={(e) =>
                setNewRule({ ...newRule, region: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-building"></i>
              Authority <span className="required-star">*</span>
            </label>
            <select
              className="form-select"
              value={newRule.authorityId}
              onChange={(e) =>
                setNewRule({ ...newRule, authorityId: e.target.value })
              }
            >
              <option value="">Select Authority</option>
              {authorities.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-sort-numeric-up"></i>
              Priority
            </label>
            <select
              className="form-select"
              value={newRule.priority}
              onChange={(e) =>
                setNewRule({ ...newRule, priority: parseInt(e.target.value) })
              }
            >
              <option value={1}>1 - Highest</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - Lowest</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newRule.isActive}
                onChange={(e) =>
                  setNewRule({ ...newRule, isActive: e.target.checked })
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
                  Add Rule
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      {loading && rules.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading rules...</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              <i className="fas fa-list"></i>
              <h3>Routing Rules</h3>
            </div>
            <span className="table-count">{rules.length} total</span>
          </div>
          
          <div className="table-responsive">
            <table className="rules-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Region</th>
                  <th>Responsible Authority</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.length > 0 ? (
                  rules.map((r) => (
                    <tr key={r.id}>
                      <td><span className="id-badge">#{r.id}</span></td>
                      <td className="category-cell">
                        <i className="fas fa-tag"></i>
                        {r.category}
                      </td>
                      <td>
                        <span className="region-badge">
                          <i className="fas fa-map-marker-alt"></i>
                          {r.region}
                        </span>
                      </td>
                      <td className="authority-cell">
                        <i className="fas fa-building"></i>
                        <div>
                          <strong>{r.authorityName}</strong>
                          {r.authorityEmail && (
                            <small>{r.authorityEmail}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`priority-badge priority-${r.priority}`}>
                          Priority {r.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${r.isActive ? "active" : "inactive"}`}>
                          {r.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className={`action-btn ${r.isActive ? "deactivate" : "activate"}`}
                            onClick={() => handleToggleActive(r.id)}
                            disabled={loading}
                            title={r.isActive ? "Deactivate" : "Activate"}
                          >
                            <i className={`fas fa-${r.isActive ? "ban" : "check-circle"}`}></i>
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(r.id)}
                            disabled={loading}
                            title="Delete Rule"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <i className="fas fa-code-branch"></i>
                      <p>No routing rules found</p>
                      <p className="empty-sub">Add your first routing rule to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .routing-dashboard {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header Styles */
        .routing-header {
          margin-bottom: 30px;
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          padding: 25px 30px;
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
          grid-template-columns: repeat(3, 1fr);
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

        .form-select {
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(21, 87, 36, 0.15);
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          font-size: 0.95rem;
          color: #2d3f33;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .form-select:focus {
          border-color: #C5A059;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
          outline: none;
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

        .rules-table {
          width: 100%;
          border-collapse: collapse;
        }

        .rules-table th {
          text-align: left;
          padding: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #5a6b5e;
          border-bottom: 2px solid rgba(197, 160, 89, 0.2);
          white-space: nowrap;
        }

        .rules-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(21, 87, 36, 0.1);
          color: #2d3f33;
        }

        .rules-table tbody tr {
          transition: all 0.3s ease;
        }

        .rules-table tbody tr:hover {
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

        .category-cell {
          font-weight: 600;
          color: #1a3f25;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-cell i {
          color: #C5A059;
        }

        .region-badge {
          display: inline-flex;
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
        }

        .authority-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .authority-cell i {
          color: #C5A059;
          font-size: 1.2rem;
        }

        .authority-cell div {
          display: flex;
          flex-direction: column;
        }

        .authority-cell strong {
          color: #1a3f25;
          font-size: 0.95rem;
        }

        .authority-cell small {
          color: #8a9b90;
          font-size: 0.8rem;
        }

        .priority-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .priority-badge.priority-1 {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .priority-badge.priority-2 {
          background: rgba(255, 193, 7, 0.1);
          color: #856404;
        }

        .priority-badge.priority-3 {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
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
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
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
        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .routing-dashboard {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .table-card {
            padding: 20px;
          }

          .rules-table th,
          .rules-table td {
            padding: 12px;
          }

          .authority-cell {
            flex-direction: column;
            align-items: flex-start;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}