import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorityDashboard = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterLocation, setFilterLocation] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const authorityId = user?.id;
            
            console.log("Dashboard - Fetching reports for Authority ID:", authorityId);
      
            if (!authorityId) {
                console.error("No Authority ID found, please login again.");
                return;
            }
      
            const response = await axios.get(`http://localhost:5233/api/AuthorityReport/Byrule/${authorityId}`);
            
            const normalizedData = response.data.map(r => {
                let statusNum = 0;
                const s = r.reportStatus;
                if (s === "Pending" || s === 0) statusNum = 0;
                else if (s === "InProgress" || s === 1) statusNum = 1;
                else if (s === "Resolved" || s === 2) statusNum = 2;
                else if (s === "Rejected" || s === 3) statusNum = 3;
                return { ...r, reportId: r.reportId, finalStatus: statusNum };
            });
      
            setReports(normalizedData);
            setFilteredReports(normalizedData); 
        } catch (err) {
            console.error("Error fetching authority reports:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = reports;
        if (filterStatus !== 'all') {
            result = result.filter(r => r.finalStatus === parseInt(filterStatus));
        }
        if (filterLocation !== '') {
            result = result.filter(r => 
                r.region && r.region.toLowerCase().includes(filterLocation.toLowerCase())
            );
        }
        setFilteredReports(result);
    }, [filterStatus, filterLocation, reports]);

    const handleStatusChange = async (reportId, newStatus) => {
        setUpdatingId(reportId);
        try {
            const url = `http://localhost:5233/api/AuthorityReport/updateStatus/${reportId}/${newStatus}`;
            await axios.post(url); 
            
            setReports(prev => prev.map(r => 
                (r.reportId === reportId) ? { ...r, finalStatus: parseInt(newStatus) } : r
            ));
        } catch (err) {
            console.error("Error updating status:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.finalStatus === 0).length,
        inProgress: reports.filter(r => r.finalStatus === 1).length,
        resolved: reports.filter(r => r.finalStatus === 2).length,
        rejected: reports.filter(r => r.finalStatus === 3).length,
    };

    const handleFilterClick = (status) => {
        setFilterStatus(status);
        setActiveFilter(status);
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const authorityName = user?.name || user?.authorityName || "Authority";

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p className="loader-text">Loading reports...</p>
        </div>
    );

    return (
        <div className="dashboard-container">
            <style>{globalStyles}</style>
            
            {/* Hero Section with Animated Background */}
            <div className="hero-section">
                {/* Animated Particles Background - Visible & Smooth */}
                <div className="hero-particles">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className={`particle particle-${i + 1}`}></div>
                    ))}
                </div>
                
                {/* Smoke/Cloud Effect */}
                <div className="hero-smoke">
                    <div className="smoke smoke-1"></div>
                    <div className="smoke smoke-2"></div>
                    <div className="smoke smoke-3"></div>
                </div>
                
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1 className="hero-title">
                        Welcome back
                        <br />
                        <span style={{ fontSize: '32px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                            {authorityName}
                        </span>
                    </h1>
                    <p className="hero-subtitle">Manage and track citizen reports efficiently</p>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">{stats.total}</span>
                            <span className="hero-stat-label">Total Reports</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">{stats.pending}</span>
                            <span className="hero-stat-label">Pending</span>
                        </div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">{stats.resolved}</span>
                            <span className="hero-stat-label">Resolved</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-section">
                <div className="section-header">
                    <h2 className="section-title">Overview</h2>
                    <button className="refresh-btn" onClick={fetchReports}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 4v6h-6" />
                            <path d="M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
                        </svg>
                        Refresh
                    </button>
                </div>
                <div className="stats-grid">
                    <div className="stat-card stat-total">
                        <div className="stat-card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3v18h18" />
                                <path d="M18 17V9" />
                                <path d="M12 17V5" />
                                <path d="M6 17v-3" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <span className="stat-card-value">{stats.total}</span>
                            <span className="stat-card-label">Total Reports</span>
                        </div>
                    </div>
                    <div className="stat-card stat-pending">
                        <div className="stat-card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <span className="stat-card-value">{stats.pending}</span>
                            <span className="stat-card-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card stat-progress">
                        <div className="stat-card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 11-6.219-8.56" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <span className="stat-card-value">{stats.inProgress}</span>
                            <span className="stat-card-label">In Progress</span>
                        </div>
                    </div>
                    <div className="stat-card stat-resolved">
                        <div className="stat-card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <span className="stat-card-value">{stats.resolved}</span>
                            <span className="stat-card-label">Resolved</span>
                        </div>
                    </div>
                    <div className="stat-card stat-rejected">
                        <div className="stat-card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <span className="stat-card-value">{stats.rejected}</span>
                            <span className="stat-card-label">Rejected</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="section-header">
                    <h2 className="section-title">Reports Management</h2>
                    <div className="results-badge">
                        <span>{filteredReports.length} reports found</span>
                    </div>
                </div>

                <div className="status-filters">
                    <button 
                        className={`filter-chip ${activeFilter === 'all' ? 'active all' : ''}`}
                        onClick={() => handleFilterClick('all')}
                    >
                        All Reports
                        <span className="chip-count">{stats.total}</span>
                    </button>
                    <button 
                        className={`filter-chip pending-chip ${activeFilter === '0' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('0')}
                    >
                        <span className="chip-dot pending-dot"></span>
                        Pending
                        <span className="chip-count">{stats.pending}</span>
                    </button>
                    <button 
                        className={`filter-chip progress-chip ${activeFilter === '1' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('1')}
                    >
                        <span className="chip-dot progress-dot"></span>
                        In Progress
                        <span className="chip-count">{stats.inProgress}</span>
                    </button>
                    <button 
                        className={`filter-chip resolved-chip ${activeFilter === '2' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('2')}
                    >
                        <span className="chip-dot resolved-dot"></span>
                        Resolved
                        <span className="chip-count">{stats.resolved}</span>
                    </button>
                    <button 
                        className={`filter-chip rejected-chip ${activeFilter === '3' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('3')}
                    >
                        <span className="chip-dot rejected-dot"></span>
                        Rejected
                        <span className="chip-count">{stats.rejected}</span>
                    </button>
                </div>

                <div className="search-container">
                    <div className="search-box">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by region or location..." 
                            value={filterLocation} 
                            onChange={(e) => setFilterLocation(e.target.value)} 
                            className="search-input"
                        />
                        {filterLocation && (
                            <button className="search-clear" onClick={() => setFilterLocation('')}>✕</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="reports-grid">
                {filteredReports.map((report, index) => {
                    const statusConfig = {
                        0: { label: 'Pending', class: 'status-pending', borderClass: 'card-border-pending' },
                        1: { label: 'In Progress', class: 'status-progress', borderClass: 'card-border-progress' },
                        2: { label: 'Resolved', class: 'status-resolved', borderClass: 'card-border-resolved' },
                        3: { label: 'Rejected', class: 'status-rejected', borderClass: 'card-border-rejected' }
                    };
                    const config = statusConfig[report.finalStatus];
                    
                    return (
                        <div 
                            key={report.reportId} 
                            className={`report-card ${config.borderClass}`}
                            style={{ animationDelay: `${index * 0.03}s` }}
                        >
                            <div className={`card-stripe stripe-${report.finalStatus}`}></div>
                            
                            <div className="report-card-header">
                                <div className={`report-status ${config.class}`}>
                                    {config.label}
                                </div>
                                <span className="report-id">#{report.reportId}</span>
                            </div>
                            
                            <h3 className="report-title">{report.title}</h3>
                            <p className="report-description">{report.description?.substring(0, 120)}...</p>
                            
                            <div className="report-meta">
                                <div className="meta-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>{report.region || 'Unknown'}</span>
                                </div>
                                <div className="meta-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>{report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="report-actions">
                                <button 
                                    className={`action-btn ${report.finalStatus === 0 ? 'active pending' : ''}`}
                                    onClick={() => handleStatusChange(report.reportId, 0)}
                                    disabled={updatingId === report.reportId}
                                >
                                    Pending
                                </button>
                                <button 
                                    className={`action-btn ${report.finalStatus === 1 ? 'active progress' : ''}`}
                                    onClick={() => handleStatusChange(report.reportId, 1)}
                                    disabled={updatingId === report.reportId}
                                >
                                    InProgress
                                </button>
                                <button 
                                    className={`action-btn ${report.finalStatus === 2 ? 'active resolved' : ''}`}
                                    onClick={() => handleStatusChange(report.reportId, 2)}
                                    disabled={updatingId === report.reportId}
                                >
                                    Resolved
                                </button>
                                <button 
                                    className={`action-btn ${report.finalStatus === 3 ? 'active rejected' : ''}`}
                                    onClick={() => handleStatusChange(report.reportId, 3)}
                                    disabled={updatingId === report.reportId}
                                >
                                    Rejected
                                </button>
                            </div>
                            
                            {updatingId === report.reportId && (
                                <div className="updating-overlay">
                                    <div className="small-spinner"></div>
                                    <span>Updating...</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredReports.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h3>No reports found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            )}
        </div>
    );
};

const globalStyles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .dashboard-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .hero-section {
        position: relative;
        background: linear-gradient(135deg, #0d2b1f 0%, #1a4d2e 50%, #2d6a4f 100%);
        overflow: hidden;
        padding: 60px 40px;
    }

    /* Visible Particles - Smooth Movement */
    .hero-particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    }

    ${[...Array(40)].map((_, i) => {
        const size = Math.random() * 5 + 3;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 5;
        const delay = Math.random() * 5;
        return `
            .particle-${i + 1} {
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, #FFD700, #FFA500);
                border-radius: 50%;
                top: ${top}%;
                left: ${left}%;
                animation: floatParticleSmooth ${duration}s infinite ease-in-out;
                animation-delay: ${delay}s;
                opacity: 0.8;
                box-shadow: 0 0 ${size * 1.5}px rgba(255,215,0,0.6);
            }
        `;
    }).join('')}

    @keyframes floatParticleSmooth {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.8;
        }
        25% {
            transform: translateY(-15px) translateX(8px);
            opacity: 1;
        }
        50% {
            transform: translateY(10px) translateX(-6px);
            opacity: 0.7;
        }
        75% {
            transform: translateY(-8px) translateX(5px);
            opacity: 0.9;
        }
    }

    /* Smoke Effect */
    .hero-smoke {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    }

    .smoke {
        position: absolute;
        background: radial-gradient(circle, rgba(255,215,0,0.1), transparent);
        border-radius: 50%;
        filter: blur(40px);
        animation: smokeMoveSmooth 18s infinite ease-in-out;
    }

    .smoke-1 {
        width: 450px;
        height: 450px;
        top: -180px;
        left: -180px;
        animation-duration: 22s;
    }

    .smoke-2 {
        width: 550px;
        height: 550px;
        bottom: -200px;
        right: -200px;
        animation-duration: 26s;
        animation-delay: 2.5s;
    }

    .smoke-3 {
        width: 500px;
        height: 500px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-duration: 20s;
        animation-delay: 1.2s;
    }

    @keyframes smokeMoveSmooth {
        0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.3;
        }
        25% {
            transform: scale(1.1) translate(20px, -20px);
            opacity: 0.45;
        }
        50% {
            transform: scale(1.05) translate(-15px, 12px);
            opacity: 0.35;
        }
        75% {
            transform: scale(1.12) translate(12px, 15px);
            opacity: 0.4;
        }
    }

    .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(255,215,0,0.08), transparent 60%);
        pointer-events: none;
    }

    .hero-content {
        position: relative;
        z-index: 2;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }

    .hero-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1));
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,215,0,0.3);
        animation: iconGlow 3s infinite ease-in-out;
    }

    @keyframes iconGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.2); }
        50% { box-shadow: 0 0 45px rgba(255,215,0,0.5); }
    }

    .hero-icon svg { stroke: #FFD700; }

    .hero-title {
        font-size: 42px;
        font-weight: 800;
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
    }

    .hero-subtitle {
        font-size: 16px;
        color: rgba(255,255,255,0.9);
        margin-bottom: 32px;
    }

    .hero-stats {
        display: flex;
        justify-content: center;
        gap: 32px;
        padding: 20px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(20px);
        border-radius: 60px;
        max-width: 400px;
        margin: 0 auto;
        border: 1px solid rgba(255,215,0,0.3);
    }

    .hero-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero-stat-value {
        font-size: 28px;
        font-weight: 800;
        color: #FFD700;
    }

    .hero-stat-label {
        font-size: 12px;
        color: rgba(255,255,255,0.8);
        margin-top: 4px;
    }

    .hero-stat-divider {
        width: 1px;
        height: 40px;
        background: rgba(255,215,0,0.3);
    }

    .stats-section {
        padding: 40px 40px 0 40px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
    }

    .section-title {
        font-size: 24px;
        font-weight: 700;
        color: #0d2b1f;
        letter-spacing: -0.3px;
        border-left: 4px solid #FFD700;
        padding-left: 16px;
    }

    .refresh-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #1a4d2e;
        transition: all 0.3s ease;
    }

    .refresh-btn:hover {
        background: #f8fafc;
        border-color: #FFD700;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }

    .stat-card {
        background: white;
        border-radius: 20px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.05);
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        border-color: rgba(255,215,0,0.3);
    }

    .stat-card-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-total .stat-card-icon { background: linear-gradient(135deg, #0d2b1f 0%, #1a4d2e 100%); }
    .stat-pending .stat-card-icon { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
    .stat-progress .stat-card-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
    .stat-resolved .stat-card-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .stat-rejected .stat-card-icon { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }

    .stat-card-icon svg { stroke: white; }
    .stat-card-content { flex: 1; }
    .stat-card-value { display: block; font-size: 32px; font-weight: 800; color: #0d2b1f; line-height: 1; margin-bottom: 4px; }
    .stat-card-label { font-size: 13px; color: #64748b; font-weight: 500; }

    .filters-section {
        padding: 32px 40px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .results-badge {
        padding: 8px 16px;
        background: white;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        color: #1a4d2e;
        border: 1px solid #e2e8f0;
    }

    .status-filters {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 24px;
    }

    .filter-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 40px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #475569;
    }

    .filter-chip:hover { border-color: #FFD700; transform: translateY(-2px); }
    .filter-chip.active { border-color: #FFD700; background: linear-gradient(135deg, #fff9e6, #fff3cc); color: #0d2b1f; }
    .chip-dot { width: 8px; height: 8px; border-radius: 50%; }
    .pending-dot { background: #f59e0b; }
    .progress-dot { background: #3b82f6; }
    .resolved-dot { background: #10b981; }
    .rejected-dot { background: #ef4444; }
    .chip-count { background: #f1f5f9; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }

    .search-container { margin-bottom: 32px; }
    .search-box { position: relative; max-width: 400px; }
    .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-input { width: 100%; padding: 12px 16px 12px 48px; border: 1px solid #e2e8f0; border-radius: 14px; font-size: 14px; font-family: inherit; transition: all 0.3s ease; background: white; }
    .search-input:focus { outline: none; border-color: #FFD700; box-shadow: 0 0 0 3px rgba(255,215,0,0.1); }
    .search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: #f1f5f9; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; color: #64748b; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .search-clear:hover { background: #e2e8f0; }

    .reports-grid {
        padding: 0 40px 40px 40px;
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        gap: 28px;
    }

    .report-card {
        background: white;
        border-radius: 24px;
        overflow: hidden;
        transition: all 0.3s ease;
        position: relative;
        animation: fadeInUp 0.5s ease-out backwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border: 1px solid rgba(0,0,0,0.08);
    }

    .card-stripe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
    }

    .stripe-0 { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .stripe-1 { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
    .stripe-2 { background: linear-gradient(90deg, #10b981, #34d399); }
    .stripe-3 { background: linear-gradient(90deg, #ef4444, #f87171); }

    .card-border-pending { border-left: 4px solid #f59e0b; }
    .card-border-progress { border-left: 4px solid #3b82f6; }
    .card-border-resolved { border-left: 4px solid #10b981; }
    .card-border-rejected { border-left: 4px solid #ef4444; }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .report-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }

    .report-card-header {
        padding: 20px 20px 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .report-status {
        padding: 6px 14px;
        border-radius: 24px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.3px;
    }

    .status-pending { background: #fffbeb; color: #f59e0b; border: 1px solid #fef3c7; }
    .status-progress { background: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe; }
    .status-resolved { background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5; }
    .status-rejected { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }

    .report-id {
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        background: #f8fafc;
        padding: 4px 10px;
        border-radius: 20px;
    }

    .report-title {
        padding: 0 20px;
        font-size: 18px;
        font-weight: 700;
        color: #0d2b1f;
        margin-bottom: 12px;
        line-height: 1.35;
    }

    .report-description {
        padding: 0 20px;
        font-size: 13px;
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 16px;
    }

    .report-meta {
        padding: 12px 20px;
        display: flex;
        gap: 20px;
        border-top: 1px solid #f1f5f9;
        border-bottom: 1px solid #f1f5f9;
        margin-bottom: 16px;
        background: #fafbfc;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #94a3b8;
    }

    .report-actions {
        padding: 0 20px 20px 20px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .action-btn {
        flex: 1;
        padding: 8px 12px;
        border: 1.5px solid #e2e8f0;
        background: white;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #64748b;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    .action-btn:hover { transform: translateY(-2px); }
    .action-btn.pending:hover, .action-btn.active.pending { border-color: #f59e0b; color: #f59e0b; background: #fffbeb; }
    .action-btn.progress:hover, .action-btn.active.progress { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
    .action-btn.resolved:hover, .action-btn.active.resolved { border-color: #10b981; color: #10b981; background: #ecfdf5; }
    .action-btn.rejected:hover, .action-btn.active.rejected { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
    .action-btn.active { border-width: 2px; }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .updating-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 13px;
        color: #FFD700;
        font-weight: 500;
        backdrop-filter: blur(4px);
    }

    .small-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid #e2e8f0;
        border-top: 2px solid #FFD700;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
        text-align: center;
        padding: 80px 40px;
        background: white;
        border-radius: 24px;
        max-width: 500px;
        margin: 0 auto 40px auto;
    }

    .empty-state-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: #f1f5f9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .empty-state-icon svg { stroke: #94a3b8; }
    .empty-state h3 { font-size: 20px; font-weight: 600; color: #0d2b1f; margin-bottom: 8px; }
    .empty-state p { color: #64748b; font-size: 14px; }

    .loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
    }

    .spinner {
        width: 48px;
        height: 48px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #FFD700;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    .loader-text { margin-top: 16px; color: #64748b; font-size: 14px; }

    @media (max-width: 768px) {
        .hero-section { padding: 40px 20px; }
        .hero-title { font-size: 28px; }
        .hero-stats { gap: 16px; padding: 16px; }
        .hero-stat-value { font-size: 20px; }
        .stats-section, .filters-section { padding: 24px 20px; }
        .reports-grid { padding: 0 20px 24px 20px; grid-template-columns: 1fr; }
        .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        .stat-card { padding: 16px; }
        .stat-card-value { font-size: 24px; }
        .section-title { font-size: 20px; }
    }
`;

export default AuthorityDashboard;