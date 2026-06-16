import React, { useState, useEffect } from "react";
import * as signalR from '@microsoft/signalr';
import "bootstrap/dist/css/bootstrap.min.css";

export default function EmailQueuePage() {
  const [emails, setEmails] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [connection, setConnection] = useState(null);

  const GET_EMAILS_URL = "http://localhost:5233/api/EmailQueue";
  const REPORTS_API_URL = "http://localhost:5233/api/reports";

  const ReportStatus = {
    Pending: 0,
    InProgress: 1,
    Resolved: 2,
    Rejected: 3
  };

  const getReportStatusString = (status) => {
    const statusMap = {
      [ReportStatus.Pending]: "Pending",
      [ReportStatus.InProgress]: "InProgress",
      [ReportStatus.Resolved]: "Resolved",
      [ReportStatus.Rejected]: "Rejected"
    };
    return statusMap[status] || "Pending";
  };

  const getReportStatusLabel = (status) => {
    const statusMap = {
      [ReportStatus.Pending]: "Pending",
      [ReportStatus.InProgress]: "In Progress",
      [ReportStatus.Resolved]: "Resolved",
      [ReportStatus.Rejected]: "Rejected"
    };
    return statusMap[status] || "Unknown";
  };

  const getReportStatusBadge = (status) => {
    const badgeMap = {
      [ReportStatus.Pending]: "pending",
      [ReportStatus.InProgress]: "in-progress",
      [ReportStatus.Resolved]: "resolved",
      [ReportStatus.Rejected]: "rejected"
    };
    return badgeMap[status] || "";
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // ========== fetch emails from queue ==========
  const fetchEmails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(GET_EMAILS_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📧 Emails fetched:", data);
      setEmails(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showNotification("Failed to fetch emails", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========== SignalR Connection ==========
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5233/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("accessToken")
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("✅ SignalR connected successfully");
          
          const userId = localStorage.getItem("userId");
          if (userId) {
            connection.invoke("JoinUserGroup", userId)
              .then(() => console.log(`✅ Joined group: ${userId}`))
              .catch(err => console.error("Failed to join group:", err));
          }
        })
        .catch(err => console.error("SignalR connection failed:", err));

      connection.on("NotifyReportStatus", (payload) => {
        console.log("📢 Notification received:", payload);
        showNotification(`Report #${payload.reportId}: ${payload.Message}`, "info");
        fetchEmails(); 
      });

      connection.onreconnecting((error) => {
        console.warn("SignalR reconnecting:", error);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected:", connectionId);
        const userId = localStorage.getItem("userId");
        if (userId) {
          connection.invoke("JoinUserGroup", userId);
        }
      });
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  // ========== Initial fetch ==========
  useEffect(() => {
    fetchEmails();
  }, []);

  // ========== Update status summary ==========
  useEffect(() => {
    const summary = {
      pending: emails.filter(x => x.status === "Pending" || x.status === 0).length,
      inProgress: emails.filter(x => x.status === "InProgress" || x.status === 1 || x.status === "In Progress").length,
      resolved: emails.filter(x => x.status === "Resolved" || x.status === 2).length,
      rejected: emails.filter(x => x.status === "Rejected" || x.status === 3).length,
    };
    setStatusSummary(summary);
  }, [emails]);

  // ========== handle report status change (using Reports API) ==========
  const handleStatusChange = async (emailId, reportId, newStatusValue) => {
    const newStatusInt = parseInt(newStatusValue, 10);
    const newStatusString = getReportStatusString(newStatusInt);
    
    const prevEmails = [...emails];
    const emailIndex = prevEmails.findIndex(e => e.id === emailId);
    const oldStatus = prevEmails[emailIndex]?.status;
    
    setEmails(prev => prev.map(e => 
      e.id === emailId ? { ...e, status: newStatusString } : e
    ));
    
    setUpdatingStatus(prev => ({ ...prev, [emailId]: true }));
    
    try {
      const token = localStorage.getItem("accessToken");
      
      const fullUrl = `${REPORTS_API_URL}/${reportId}/status`;
      console.debug("PUT ->", fullUrl, { status: newStatusString });
      
      const res = await fetch(fullUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatusString })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      console.log("✅ Status updated:", result);
      
      showNotification(`Report status updated to ${getReportStatusLabel(newStatusInt)}`, "success");
      
      await fetchEmails();
      
    } catch (err) {
      console.error("Update status error:", err);
      setEmails(prevEmails);
      showNotification("Failed to update status. Changes rolled back.", "error");
    } finally {
      setUpdatingStatus(prev => {
        const copy = { ...prev };
        delete copy[emailId];
        return copy;
      });
    }
  };

  const getReportStatusFromEmail = (email) => {
    if (email.reportStatus !== undefined) {
      return email.reportStatus;
    }
    const statusStr = String(email.status || "").toLowerCase();
    if (statusStr === "pending") return ReportStatus.Pending;
    if (statusStr === "inprogress" || statusStr === "in progress") return ReportStatus.InProgress;
    if (statusStr === "resolved") return ReportStatus.Resolved;
    if (statusStr === "rejected") return ReportStatus.Rejected;
    return ReportStatus.Pending;
  };

  return (
    <div className="email-dashboard">
      {/* Header Section */}
      <div className="email-header">
        <div className="header-content">
          <i className="fas fa-envelope header-icon"></i>
          <div>
            <h1>Email Queue Dashboard</h1>
            <p>Monitor and manage email queue and report status</p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${notification.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
          <span>{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification({ show: false, message: "", type: "" })}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Status Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{statusSummary.pending || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{statusSummary.inProgress || 0}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{statusSummary.resolved || 0}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{statusSummary.rejected || 0}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      {/* Email Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading emails...</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              <i className="fas fa-list"></i>
              <h3>Email Queue</h3>
            </div>
            <span className="table-count">{emails.length} total</span>
          </div>
          
          <div className="table-responsive">
            <table className="email-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Authority</th>
                  <th>Report Title</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.length > 0 ? (
                  emails.map((e) => {
                    const currentStatus = getReportStatusFromEmail(e);
                    const reportId = e.reportId || e.ReportId;
                    
                    return (
                      <tr key={e.id}>
                        <td><span className="id-badge">#{e.id}</span></td>
                        <td>
                          <a href={`mailto:${e.recipient}`} className="email-link">
                            <i className="fas fa-envelope"></i>
                            {e.recipient}
                          </a>
                        </td>
                        <td className="email-subject">
                          <strong>{e.subject}</strong>
                          {e.body && (
                            <p className="email-preview">
                              {e.body.length > 50 ? e.body.substring(0, 50) + "..." : e.body}
                            </p>
                          )}
                        </td>
                        <td>
                          {e.authorityName ? (
                            <span className="authority-badge">
                              <i className="fas fa-building"></i>
                              {e.authorityName}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {e.reportTitle ? (
                            <span className="report-badge">
                              <i className="fas fa-file-alt"></i>
                              {e.reportTitle}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <span className="date-badge">
                            <i className="fas fa-calendar"></i>
                            {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "N/A"}
                            <small>{e.createdAt ? new Date(e.createdAt).toLocaleTimeString() : ""}</small>
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${getReportStatusBadge(currentStatus)}`}>
                            {getReportStatusLabel(currentStatus)}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={currentStatus}
                            onChange={(event) => handleStatusChange(e.id, reportId, event.target.value)}
                            disabled={!!updatingStatus[e.id] || !reportId}
                          >
                            <option value={ReportStatus.Pending}>Pending</option>
                            <option value={ReportStatus.InProgress}>In Progress</option>
                            <option value={ReportStatus.Resolved}>Resolved</option>
                            <option value={ReportStatus.Rejected}>Rejected</option>
                          </select>
                          {updatingStatus[e.id] && (
                            <span className="updating-spinner"></span>
                          )}
                          {!reportId && (
                            <span className="text-muted ms-2" style={{ fontSize: "0.7rem" }}>No report ID</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <i className="fas fa-envelope-open"></i>
                      <p>No emails found</p>
                      <p className="empty-sub">The email queue is empty</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .email-dashboard {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .email-header {
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

        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: slideIn 0.3s ease;
          background: white;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #28a745;
        }

        .notification.error {
          border-left-color: #dc3545;
        }

        .notification i {
          font-size: 1.2rem;
        }

        .notification.success i {
          color: #28a745;
        }

        .notification.error i {
          color: #dc3545;
        }

        .notification-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #5a6b5e;
          margin-left: 20px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 24px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 15px 30px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 40px rgba(197, 160, 89, 0.15);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .stat-card.pending .stat-icon {
          background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
          color: #856404;
        }

        .stat-card.in-progress .stat-icon {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          color: #0c5460;
        }

        .stat-card.resolved .stat-icon {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #155724;
        }

        .stat-card.rejected .stat-icon {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #0a2f1a;
          line-height: 1.2;
        }

        .stat-label {
          color: #5a6b5e;
          font-size: 0.9rem;
        }

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

        .email-table {
          width: 100%;
          border-collapse: collapse;
        }

        .email-table th {
          text-align: left;
          padding: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #5a6b5e;
          border-bottom: 2px solid rgba(197, 160, 89, 0.2);
          white-space: nowrap;
        }

        .email-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(21, 87, 36, 0.1);
          color: #2d3f33;
        }

        .email-table tbody tr:hover {
          background: #f8f9fa;
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

        .email-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1a4d2a;
          text-decoration: none;
        }

        .email-link:hover {
          color: #C5A059;
        }

        .email-subject {
          max-width: 300px;
        }

        .email-subject strong {
          display: block;
          margin-bottom: 4px;
          color: #1a3f25;
        }

        .email-preview {
          margin: 0;
          font-size: 0.85rem;
          color: #8a9b90;
        }

        .authority-badge,
        .report-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(197, 160, 89, 0.05);
          border-radius: 50px;
          font-size: 0.85rem;
          color: #1a3f25;
        }

        .date-badge {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.85rem;
          color: #5a6b5e;
        }

        .date-badge i {
          margin-right: 4px;
          color: #C5A059;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-badge.pending {
          background: rgba(255, 193, 7, 0.1);
          color: #856404;
        }

        .status-badge.in-progress {
          background: rgba(23, 162, 184, 0.1);
          color: #0c5460;
        }

        .status-badge.resolved {
          background: rgba(40, 167, 69, 0.1);
          color: #155724;
        }

        .status-badge.rejected {
          background: rgba(220, 53, 69, 0.1);
          color: #721c24;
        }

        .status-select {
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(197, 160, 89, 0.3);
          background: white;
          font-size: 0.85rem;
          cursor: pointer;
          min-width: 120px;
        }

        .status-select:focus {
          border-color: #C5A059;
          outline: none;
        }

        .status-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .updating-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-left: 8px;
          border: 2px solid rgba(197, 160, 89, 0.3);
          border-top-color: #C5A059;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 32px;
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

        .text-muted {
          color: #8a9b90;
        }

        .ms-2 {
          margin-left: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .email-dashboard {
            padding: 10px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .table-card {
            padding: 15px;
          }

          .email-table th,
          .email-table td {
            padding: 10px;
          }

          .status-select {
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
}