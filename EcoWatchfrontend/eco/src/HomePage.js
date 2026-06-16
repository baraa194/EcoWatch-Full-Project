import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthoritiesPage from "./AuthoritiesPage";
import EmailQueuePage from "./EmailQueuePage";
import RoutingRulesPage from "./RoutingRulesPage";
import RecyclingPage from "./RecyclingPage";
import AdminCompanies from "./AdminCompanies";
import RecyclingProgressPage from "./RecyclingProgressPage";
import AdminCommunityPage from "./AdminCommunityPage";
import ImageRecyclingRequest from "./ImageRecyclingRequest";
export default function HomePage({
  goToLogin,
  goToReportForm,
  userRole,
  userName
}) {
  const [activeMainSection, setActiveMainSection] = useState("dashboard");
  const [activeToolPage, setActiveToolPage] = useState(null);

  const renderContent = () => {
    // ✅ Community Reports Page
    if (activeToolPage === "communityReports") {
      return <AdminCommunityPage goToHome={() => setActiveToolPage(null)} />;
    }

    // ✅ Authorities Page
    if (activeToolPage === "authorities") {
      return <AuthoritiesPage />;
    }

    // ✅ Routing Rules Page
    if (activeToolPage === "routing") {
      return <RoutingRulesPage />;
    }

    // ✅ Email Queue Page
    if (activeToolPage === "email") {
      return <EmailQueuePage />;
    }

    // ✅ Admin Companies Page
    if (activeToolPage === "adminCompanies") {
      return <AdminCompanies goToHome={() => setActiveToolPage(null)} />;
    }

    // ✅ Recycling Progress Page
    if (activeToolPage === "recyclingProgress") {
      return <RecyclingProgressPage />;
    }

    if (activeToolPage === "recyclingRequests") {
      return <ImageRecyclingRequest goToHome={() => setActiveToolPage(null)} />;
    }

    // ===== Recycling =====
    if (activeMainSection === "recycling") {
      return (
        <div className="tools-container">
          <div className="tools-header">
            <h2>Recycling Management</h2>
            <p>Manage recycling companies and track progress</p>
          </div>
          
          <div className="tools-grid">
            <div
              className="tool-card admin-companies"
              onClick={() => setActiveToolPage("adminCompanies")}
            >
              <i className="fas fa-building tool-icon"></i>
              <h3>Add Recycling Company</h3>
              <p>Add and manage recycling companies in the system</p>
              <span className="tool-stats">Manage Companies</span>
              <div className="tool-hover-effect"></div>
            </div>

            <div
              className="tool-card recycling-progress"
              onClick={() => setActiveToolPage("recyclingProgress")}
            >
              <i className="fas fa-chart-line tool-icon"></i>
              <h3>Recycling Progress</h3>
              <p>Track recycling activities, contracts, and points earned</p>
              <span className="tool-stats">View Progress</span>
              <div className="tool-hover-effect"></div>
            </div>

<div
              className="tool-card recycling-requests"
              onClick={() => setActiveToolPage("recyclingRequests")}
            >
              <i className="fas fa-list-check tool-icon"></i>
              <h3>Recycling Requests</h3>
              <p>Review user materials and approve points</p>
              <span className="tool-stats">Pending Reviews</span>
              <div className="tool-hover-effect"></div>
            </div>
          </div>
        </div>
      );
    }

    // ===== Dashboard =====
    if (activeMainSection === "dashboard") {
      return (
        <div className="dashboard-container">
          {/* Welcome Header */}
          <div className="welcome-header">
            <div className="welcome-content">
              <i className="fas fa-hand-wave welcome-emoji"></i>
              <div>
                <h1>Welcome back, <span className="welcome-name">{userName || "Admin"}</span></h1>
                <p>Here's what's happening with your platform today</p>
              </div>
            </div>
            <div className="welcome-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="stat-details">
                <span className="stat-label">Total Authorities</span>
                <span className="stat-value">12</span>
                <span className="stat-trend positive">+2 this month</span>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="stat-details">
                <span className="stat-label">Pending Emails</span>
                <span className="stat-value">5</span>
                <span className="stat-trend warning">3 urgent</span>
              </div>
            </div>

            <div className="stat-card rules">
              <div className="stat-icon">
                <i className="fas fa-code-branch"></i>
              </div>
              <div className="stat-details">
                <span className="stat-label">Routing Rules</span>
                <span className="stat-value">8</span>
                <span className="stat-trend info">4 active</span>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="insights-section">
            <h3 className="section-title">Quick Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <i className="fas fa-chart-line insight-icon"></i>
                <div>
                  <h4>System Health</h4>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '92%' }}></div>
                  </div>
                  <span className="insight-value">92%</span>
                </div>
              </div>
              <div className="insight-card">
                <i className="fas fa-clock insight-icon"></i>
                <div>
                  <h4>Response Time</h4>
                  <span className="insight-value">1.2s</span>
                  <span className="insight-trend">↓ 0.3s</span>
                </div>
              </div>
              <div className="insight-card">
                <i className="fas fa-users insight-icon"></i>
                <div>
                  <h4>Active Users</h4>
                  <span className="insight-value">47</span>
                  <span className="insight-trend">↑ 12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ===== Admin Tools Main Cards =====
    if (activeMainSection === "adminTools" && !activeToolPage) {
      return (
        <div className="tools-container">
          <div className="tools-header">
            <h2>Admin Tools</h2>
            <p>Manage your system configurations and settings</p>
          </div>
          <div className="tools-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div
              className="tool-card authorities"
              onClick={() => setActiveToolPage("authorities")}
            >
              <i className="fas fa-building tool-icon"></i>
              <h3>Authorities</h3>
              <p>Manage regulatory authorities and their permissions</p>
              <span className="tool-stats">12 active</span>
              <div className="tool-hover-effect"></div>
            </div>

            <div
              className="tool-card routing"
              onClick={() => setActiveToolPage("routing")}
            >
              <i className="fas fa-code-branch tool-icon"></i>
              <h3>Routing Rules</h3>
              <p>Configure email routing and distribution rules</p>
              <span className="tool-stats">8 rules</span>
              <div className="tool-hover-effect"></div>
            </div>

            <div
              className="tool-card email"
              onClick={() => setActiveToolPage("email")}
            >
              <i className="fas fa-envelope tool-icon"></i>
              <h3>Email Queue</h3>
              <p>Monitor and manage email queue and delivery</p>
              <span className="tool-stats">5 pending</span>
              <div className="tool-hover-effect"></div>
            </div>

            <div
              className="tool-card community-reports"
              onClick={() => setActiveToolPage("communityReports")}
            >
              <i className="fas fa-users tool-icon"></i>
              <h3>Community Reports</h3>
              <p>Manage community-reported environmental issues, complete them and add points</p>
              <span className="tool-stats">View Reports</span>
              <div className="tool-hover-effect"></div>
            </div>

            {/* Placeholder cards to maintain grid */}
            <div className="tool-card placeholder" style={{ opacity: 0.3, pointerEvents: 'none' }}>
              <i className="fas fa-ellipsis-h tool-icon"></i>
              <h3>Coming Soon</h3>
              <p>Additional features will be added here</p>
              <span className="tool-stats">In Development</span>
              <div className="tool-hover-effect"></div>
            </div>

            <div className="tool-card placeholder" style={{ opacity: 0.3, pointerEvents: 'none' }}>
              <i className="fas fa-ellipsis-h tool-icon"></i>
              <h3>Coming Soon</h3>
              <p>Additional features will be added here</p>
              <span className="tool-stats">In Development</span>
              <div className="tool-hover-effect"></div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-container">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-leaf logo-icon"></i>
            <span className="logo-text">Admin<span className="logo-highlight">Dashboard</span></span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeMainSection === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveMainSection("dashboard");
              setActiveToolPage(null);
            }}
          >
            <i className="fas fa-chart-pie nav-icon"></i>
            <span className="nav-text">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeMainSection === "adminTools" ? "active" : ""}`}
            onClick={() => {
              setActiveMainSection("adminTools");
              setActiveToolPage(null);
            }}
          >
            <i className="fas fa-cog nav-icon"></i>
            <span className="nav-text">Admin Tools</span>
          </button>

          <button
            className={`nav-item ${activeMainSection === "recycling" ? "active" : ""}`}
            onClick={() => {
              setActiveMainSection("recycling");
              setActiveToolPage(null);
            }}
          >
            <i className="fas fa-recycle nav-icon"></i>
            <span className="nav-text">Recycling</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {userName?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <span className="user-name">{userName || "Admin"}</span>
              <span className="user-role">{userRole || "Administrator"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Main Area ===== */}
      <main className="main-area">
        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      <style jsx>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        /* ===== Sidebar Styles ===== */
        .sidebar {
          width: 280px;
          background: linear-gradient(145deg, #0a2f1a 0%, #0f3f23 100%);
          color: white;
          display: flex;
          flex-direction: column;
          box-shadow: 10px 0 30px rgba(0, 30, 0, 0.2);
          position: relative;
          overflow: hidden;
          height: 100vh;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #C5A059, #E5C687, #C5A059);
        }

        .sidebar-header {
          padding: 30px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 1.2rem;
          color: #C5A059;
          filter: drop-shadow(0 5px 15px rgba(197, 160, 89, 0.3));
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .logo-highlight {
          background: linear-gradient(135deg, #C5A059 0%, #E5C687 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 3px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
          overflow-y: auto;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.3);
          border-radius: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(197, 160, 89, 0.15);
          color: white;
          transform: translateX(5px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #C5A059 0%, #E5C687 100%);
          color: #0a2f1a;
          box-shadow: 0 5px 15px rgba(197, 160, 89, 0.3);
        }

        .nav-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        .nav-text {
          flex: 1;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(197, 160, 89, 0.2);
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #C5A059 0%, #E5C687 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 600;
          color: #0a2f1a;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .user-role {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ===== Main Area Styles ===== */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 0;
          margin: 60px;
        }

        .content-area {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          margin: 0;
          background: transparent;
        }

        .content-area > *:first-child {
          margin-top: 0;
          padding-top: 0;
        }

        /* ===== Dashboard Styles ===== */
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-header {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 28px;
          padding: 30px;
          margin-bottom: 30px;
          margin-top: 0;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .welcome-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .welcome-emoji {
          font-size: 2.5rem;
          color: #C5A059;
        }

        .welcome-content h1 {
          font-size: 1.8rem;
          margin: 0 0 5px 0;
          color: #1a3f25;
        }

        .welcome-name {
          background: linear-gradient(135deg, #C5A059 0%, #E5C687 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-content p {
          margin: 0;
          color: #5a6b5e;
        }

        .welcome-date {
          color: #C5A059;
          font-weight: 500;
          padding: 10px 20px;
          background: rgba(197, 160, 89, 0.1);
          border-radius: 50px;
          border: 1px solid rgba(197, 160, 89, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-bottom: 40px;
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
          border-color: rgba(197, 160, 89, 0.3);
        }

        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .stat-card.total .stat-icon {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          color: #0a2f1a;
        }

        .stat-card.pending .stat-icon {
          background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
          color: #856404;
        }

        .stat-card.rules .stat-icon {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          color: #0c5460;
        }

        .stat-details {
          flex: 1;
        }

        .stat-label {
          display: block;
          color: #5a6b5e;
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          font-size: 2.2rem;
          font-weight: 700;
          color: #0a2f1a;
          line-height: 1;
          margin-bottom: 5px;
        }

        .stat-trend {
          font-size: 0.85rem;
        }

        .stat-trend.positive {
          color: #28a745;
        }

        .stat-trend.warning {
          color: #856404;
        }

        .stat-trend.info {
          color: #0c5460;
        }

        .insights-section {
          background: white;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
        }

        .section-title {
          font-size: 1.4rem;
          margin: 0 0 20px 0;
          color: #1a3f25;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #C5A059, #E5C687);
          border-radius: 2px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .insight-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 20px;
          border: 1px solid rgba(197, 160, 89, 0.1);
        }

        .insight-icon {
          font-size: 2rem;
          color: #C5A059;
        }

        .insight-card h4 {
          font-size: 1rem;
          margin: 0 0 8px 0;
          color: #5a6b5e;
        }

        .insight-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0a2f1a;
          margin-right: 10px;
        }

        .insight-trend {
          font-size: 0.9rem;
          color: #28a745;
        }

        .progress-bar {
          width: 150px;
          height: 8px;
          background: rgba(197, 160, 89, 0.1);
          border-radius: 4px;
          margin: 8px 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C5A059, #E5C687);
          border-radius: 4px;
        }

        /* ===== Tools Styles ===== */
        .tools-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .tools-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .tools-header h2 {
          font-size: 2rem;
          margin: 0 0 10px 0;
          background: linear-gradient(135deg, #0a2f1a 0%, #1a4d2a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tools-header p {
          color: #5a6b5e;
          font-size: 1.1rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .tool-card {
          background: white;
          border-radius: 32px;
          padding: 35px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(197, 160, 89, 0.1);
        }

        .tool-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 40px rgba(197, 160, 89, 0.15);
        }

        .tool-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          color: #C5A059;
        }

        .tool-card h3 {
          font-size: 1.5rem;
          margin: 0 0 10px 0;
          color: #1a3f25;
        }

        .tool-card p {
          color: #5a6b5e;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .tool-stats {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(197, 160, 89, 0.1);
          border-radius: 50px;
          color: #C5A059;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .tool-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #C5A059, #E5C687);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .tool-card:hover .tool-hover-effect {
          transform: translateX(0);
        }

        .community-reports .tool-icon {
          color: #C5A059;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            width: 250px;
          }
          .main-area {
            margin: 30px;
          }
          .tools-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .insights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 80px;
          }
          .logo-text, .nav-text, .user-details {
            display: none;
          }
          .nav-item {
            justify-content: center;
            padding: 14px;
          }
          .main-area {
            margin: 15px;
          }
          .tools-grid {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .insights-grid {
            grid-template-columns: 1fr;
          }
          .welcome-header {
            flex-direction: column;
            text-align: center;
          }
          .welcome-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}