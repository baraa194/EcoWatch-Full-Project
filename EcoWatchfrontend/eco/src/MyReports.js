// MyReports.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaLeaf,
  FaFileAlt,
  FaArrowLeft,
  FaSearch,
  FaPlus,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFile,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaClipboardList
} from "react-icons/fa";

export default function MyReports({ goToHome, goToReportForm }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    pageSize: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: 10
  });

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: filters.page,
        pageSize: filters.pageSize
      });
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(
        `http://localhost:5233/api/Reports/my?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      setReports(data.items || []);
      setPagination({
        total: data.total || 0,
        currentPage: data.currentPage || filters.page,
        pageSize: data.pageSize || filters.pageSize
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err.message || "Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1
    }));
  };

  const handlePageChange = (pageNumber) => {
    setFilters(prev => ({
      ...prev,
      page: pageNumber
    }));
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: { bg: "warning-badge", icon: FaHourglassHalf },
      InProgress: { bg: "info-badge", icon: FaSyncAlt },
      Resolved: { bg: "success-badge", icon: FaCheckCircle },
      Rejected: { bg: "danger-badge", icon: FaTimesCircle }
    };
    return statusStyles[status] || { bg: "default-badge", icon: FaFile };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="my-reports-page min-vh-100">
      {/* Main Content */}
      <div className="main-content py-5 px-4 px-md-5 px-xl-6 position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            
            {/* Header Section */}
            <div className="header-section mb-5">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="header-title-wrapper">
                  <h1 className="page-title">
                    My <span className="gradient-text">Environmental Reports</span>
                  </h1>
                  <p className="page-subtitle">
                    Track and manage all your submitted reports in one place
                  </p>
                </div>
                <div className="total-badge">
                  <span className="badge-number">{pagination.total}</span>
                  <span className="badge-label">Total Reports</span>
                </div>
              </div>
            </div>

            {/* Filters Card */}
            <div className="filters-card mb-4">
              <div className="filters-body">
                <div className="filters-grid">
                  <div className="filter-item">
                    <label className="filter-label">
                      <span className="filter-icon"><FaSearch /></span>
                      Filter by Status
                    </label>
                    <select
                      className="filter-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="">All Reports</option>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="filter-action">
                    <button
                      className="create-btn"
                      onClick={goToReportForm}
                    >
                      <span className="btn-icon"><FaPlus /></span>
                      <span>Create New Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert-custom alert-error mb-4" role="alert">
                <span className="alert-icon"><FaExclamationTriangle /></span>
                <span className="alert-text">{error}</span>
                <button
                  type="button"
                  className="alert-close"
                  onClick={() => setError("")}
                >
                  ×
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="loading-state">
                <div className="spinner-custom">
                  <FaSpinner className="spinner-icon" />
                </div>
                <p className="loading-text">Loading your reports...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && reports.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon"><FaClipboardList /></div>
                <h3 className="empty-title">No reports found</h3>
                <p className="empty-description">
                  You haven't submitted any environmental reports yet.
                </p>
                <button
                  className="empty-action-btn"
                  onClick={goToReportForm}
                >
                  Submit Your First Report
                </button>
              </div>
            )}

            {/* Reports Grid */}
            {!loading && reports.length > 0 && (
              <div className="reports-grid">
                {reports.map((report) => {
                  const statusStyle = getStatusBadge(report.status);
                  const StatusIcon = statusStyle.icon;
                  return (
                    <div key={report.id} className="report-card-wrapper">
                      <div className="report-card">
                        <div className="report-card-header">
                          <div className="report-title-wrapper">
                            <h3 className="report-title">{report.title}</h3>
                            <div className={`status-badge ${statusStyle.bg}`}>
                              <span className="status-icon"><StatusIcon /></span>
                              <span className="status-text">{report.status}</span>
                            </div>
                          </div>
                          {report.category && (
                            <span className="report-category">{report.category}</span>
                          )}
                        </div>
                        
                        <div className="report-card-body">
                          <p className="report-description">
                            {report.description || "No description provided"}
                          </p>
                        </div>
                        
                        <div className="report-card-footer">
                          <div className="report-meta">
                            <span className="meta-item">
                              <span className="meta-icon"><FaCalendarAlt /></span>
                              {formatDate(report.createdAt)}
                            </span>
                            {report.location && (
                              <span className="meta-item">
                                <span className="meta-icon"><FaMapMarkerAlt /></span>
                                {report.location}
                              </span>
                            )}
                          </div>
                          {report.severity && (
                            <span className="severity-badge">
                              <FaExclamationCircle /> Severity: {report.severity}
                            </span>
                          )}
                        </div>

                        {/* Hover Details */}
                        <div className="report-hover-details">
                          <div className="hover-content">
                            <h4>Report Details</h4>
                            <p><strong>ID:</strong> {report.id}</p>
                            <p><strong>Created:</strong> {formatDate(report.createdAt)}</p>
                            {report.updatedAt && (
                              <p><strong>Last Updated:</strong> {formatDate(report.updatedAt)}</p>
                            )}
                            <button className="view-details-btn">View Full Details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <nav className="pagination-wrapper mt-5">
                <ul className="pagination-list">
                  <li className={`pagination-item ${filters.page === 1 ? "disabled" : ""}`}>
                    <button
                      className="pagination-link prev"
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                      <span className="pagination-icon"><FaChevronLeft /></span>
                      <span>Previous</span>
                    </button>
                  </li>

                  <div className="pagination-numbers">
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index + 1}
                        className={`pagination-number ${filters.page === index + 1 ? "active" : ""}`}
                      >
                        <button
                          className="number-btn"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </div>

                  <li className={`pagination-item ${filters.page === totalPages ? "disabled" : ""}`}>
                    <button
                      className="pagination-link next"
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      <span>Next</span>
                      <span className="pagination-icon"><FaChevronRight /></span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ====== Base Styles ====== */
        .my-reports-page {
          position: relative;
          overflow-x: hidden;
        }

        /* ====== Main Content ====== */
        .main-content {
          position: relative;
          z-index: 10;
        }

        /* ====== Header Section ====== */
        .header-section {
          animation: fadeInUp 1s ease-out;
        }

        .page-title {
          color: #1a2e1a;
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1b5e20, #2e7d32, #388e3c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-subtitle {
          color: #2c4a3e;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .total-badge {
          background: white;
          padding: 15px 30px;
          border-radius: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(46, 125, 50, 0.1);
        }

        .badge-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1b5e20;
          line-height: 1;
        }

        .badge-label {
          font-size: 0.9rem;
          color: #2c4a3e;
          opacity: 0.8;
        }

        /* ====== Filters Card ====== */
        .filters-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          box-shadow: 0 15px 35px rgba(0, 40, 0, 0.1);
          border: 1px solid rgba(46, 125, 50, 0.1);
          transition: all 0.3s ease;
        }

        .filters-card:hover {
          box-shadow: 0 20px 40px rgba(46, 125, 50, 0.15);
        }

        .filters-body {
          padding: 25px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: end;
        }

        .filter-label {
          display: block;
          margin-bottom: 10px;
          color: #1b5e20;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .filter-icon {
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
        }

        .filter-select {
          width: 100%;
          padding: 14px 20px;
          border: 2px solid rgba(46, 125, 50, 0.1);
          border-radius: 24px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-select:hover {
          border-color: rgba(46, 125, 50, 0.3);
        }

        .filter-select:focus {
          outline: none;
          border-color: #1b5e20;
          box-shadow: 0 0 0 4px rgba(27, 94, 32, 0.1);
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 30px;
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 5px 15px rgba(27, 94, 32, 0.3);
        }

        .create-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(27, 94, 32, 0.4);
        }

        /* ====== Alert ====== */
        .alert-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 20px;
          animation: slideIn 0.3s ease;
        }

        .alert-error {
          background: rgba(255, 235, 235, 0.9);
          border: 1px solid rgba(255, 99, 99, 0.3);
          color: #d32f2f;
        }

        .alert-icon {
          font-size: 1.4rem;
          display: flex;
          align-items: center;
        }

        .alert-text {
          flex: 1;
        }

        .alert-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .alert-close:hover {
          opacity: 1;
        }

        /* ====== Loading State ====== */
        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner-custom {
          width: 50px;
          height: 50px;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        .spinner-icon {
          width: 50px;
          height: 50px;
          color: #1b5e20;
        }

        .loading-text {
          color: #2c4a3e;
          font-size: 1.1rem;
        }

        /* ====== Empty State ====== */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 48px;
          border: 1px solid rgba(46, 125, 50, 0.1);
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
          color: #1b5e20;
          opacity: 0.5;
        }

        .empty-title {
          color: #1a2e1a;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .empty-description {
          color: #2c4a3e;
          font-size: 1.1rem;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .empty-action-btn {
          padding: 16px 40px;
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(27, 94, 32, 0.3);
        }

        .empty-action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(27, 94, 32, 0.4);
        }

        /* ====== Reports Grid ====== */
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .report-card-wrapper {
          animation: fadeInUp 0.5s ease-out;
          animation-fill-mode: both;
        }

        .report-card-wrapper:nth-child(1) { animation-delay: 0.1s; }
        .report-card-wrapper:nth-child(2) { animation-delay: 0.2s; }
        .report-card-wrapper:nth-child(3) { animation-delay: 0.3s; }
        .report-card-wrapper:nth-child(4) { animation-delay: 0.4s; }
        .report-card-wrapper:nth-child(5) { animation-delay: 0.5s; }
        .report-card-wrapper:nth-child(6) { animation-delay: 0.6s; }

        .report-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 25px;
          box-shadow: 0 15px 35px rgba(0, 40, 0, 0.08);
          border: 1px solid rgba(46, 125, 50, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .report-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(46, 125, 50, 0.2);
          border-color: rgba(46, 125, 50, 0.3);
        }

        .report-card-header {
          margin-bottom: 15px;
        }

        .report-title-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
        }

        .report-title {
          color: #1a2e1a;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.4;
          flex: 1;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .warning-badge {
          background: rgba(255, 193, 7, 0.15);
          color: #856404;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .info-badge {
          background: rgba(23, 162, 184, 0.15);
          color: #0c5460;
          border: 1px solid rgba(23, 162, 184, 0.3);
        }

        .success-badge {
          background: rgba(40, 167, 69, 0.15);
          color: #155724;
          border: 1px solid rgba(40, 167, 69, 0.3);
        }

        .danger-badge {
          background: rgba(220, 53, 69, 0.15);
          color: #721c24;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .default-badge {
          background: rgba(108, 117, 125, 0.15);
          color: #383d41;
          border: 1px solid rgba(108, 117, 125, 0.3);
        }

        .status-icon {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .report-category {
          display: inline-block;
          padding: 5px 12px;
          background: rgba(27, 94, 32, 0.05);
          border-radius: 50px;
          font-size: 0.85rem;
          color: #1b5e20;
          border: 1px solid rgba(27, 94, 32, 0.1);
        }

        .report-card-body {
          flex: 1;
          margin-bottom: 20px;
        }

        .report-description {
          color: #2c4a3e;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          opacity: 0.9;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .report-card-footer {
          border-top: 1px solid rgba(46, 125, 50, 0.1);
          padding-top: 15px;
        }

        .report-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 10px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #2c4a3e;
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .meta-icon {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .severity-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 50px;
          font-size: 0.8rem;
          color: #856404;
          border: 1px solid rgba(255, 193, 7, 0.2);
        }

        /* Hover Details */
        .report-hover-details {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 25px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-card:hover .report-hover-details {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .hover-content {
          text-align: center;
        }

        .hover-content h4 {
          color: #1b5e20;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .hover-content p {
          color: #2c4a3e;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .view-details-btn {
          margin-top: 15px;
          padding: 10px 25px;
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(27, 94, 32, 0.3);
        }

        /* ====== Pagination ====== */
        .pagination-wrapper {
          animation: fadeIn 0.5s ease;
        }

        .pagination-list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .pagination-numbers {
          display: flex;
          gap: 5px;
        }

        .pagination-item {
          margin: 0;
        }

        .pagination-item.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .pagination-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 2px solid rgba(46, 125, 50, 0.1);
          border-radius: 50px;
          background: white;
          color: #1b5e20;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-link:hover:not(:disabled) {
          background: rgba(46, 125, 50, 0.05);
          border-color: #1b5e20;
          transform: translateY(-2px);
        }

        .pagination-number {
          margin: 0;
        }

        .number-btn {
          width: 45px;
          height: 45px;
          border: 2px solid rgba(46, 125, 50, 0.1);
          border-radius: 50%;
          background: white;
          color: #1b5e20;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .number-btn:hover {
          background: rgba(46, 125, 50, 0.05);
          border-color: #1b5e20;
          transform: scale(1.1);
        }

        .pagination-number.active .number-btn {
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          color: white;
          border-color: transparent;
          box-shadow: 0 5px 15px rgba(27, 94, 32, 0.3);
        }

        .pagination-icon {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        /* ====== Animations ====== */
        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(80px, -50px) scale(1.3); opacity: 0.6; }
        }

        @keyframes pulseOrb {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.2); }
        }

        @keyframes particleFloat {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* ====== Utility Classes ====== */
        .px-xl-6 {
          padding-left: 5rem;
          padding-right: 5rem;
        }

        /* ====== Responsive Design ====== */
        @media (max-width: 1200px) {
          .px-xl-6 {
            padding-left: 3rem;
            padding-right: 3rem;
          }

          .page-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            gap: 15px;
          }

          .nav-actions {
            width: 100%;
            justify-content: center;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .create-btn {
            width: 100%;
            justify-content: center;
          }

          .page-title {
            font-size: 1.8rem;
          }

          .header-section .d-flex {
            flex-direction: column;
            gap: 20px;
          }

          .total-badge {
            align-self: flex-start;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .pagination-list {
            flex-direction: column;
            gap: 15px;
          }

          .pagination-numbers {
            order: -1;
          }

          .px-xl-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .nav-actions {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }

          .report-title-wrapper {
            flex-direction: column;
          }

          .status-badge {
            align-self: flex-start;
          }

          .report-meta {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}