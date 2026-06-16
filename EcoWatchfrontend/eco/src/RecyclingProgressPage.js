import React, { useState, useEffect } from "react";
import { 
  FaBuilding, FaUser, FaEnvelope, FaRecycle, FaChartBar, 
  FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaRegUser 
} from "react-icons/fa";
import { MdEmail, MdRecycling } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BsPeople, BsRecycle } from "react-icons/bs";

export default function RecyclingProgressPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

 
  useEffect(() => {
    fetchCompaniesWithUsers();
  }, []);

  const fetchCompaniesWithUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
    
      const response = await fetch('http://localhost:5233/api/Contract/CompaniesPartnerships', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      

      const formattedCompanies = data.map(company => ({
        companyId: company.companyId,
        companyName: company.companyName,
        users: company.users.map(user => ({
          userId: user.userId,
          userName: user.userName,
          email: user.email
        }))
      }));
      
      setCompanies(formattedCompanies);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('failed to load compnies data');
    } finally {
      setLoading(false);
    }
  };

 
  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.users.some(user => 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleCompany = (companyId) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };


  const totalCompanies = companies.length;
  const totalContracts = companies.reduce((acc, company) => acc + company.users.length, 0);
  const activePartners = companies.filter(c => c.users.length > 0).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Looding..</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(145deg, #f8fafc, #f1f5f9);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #e2e8f0;
            border-top-color: #0a4d2a;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            color: #475569;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="recycling-progress-page">
      {/* Main Content */}
      <div className="content-wrapper">
        <div className="container">
          
          {/* Header Section */}
          <div className="header-section">
            <div className="header-badge">
              <MdRecycling className="badge-icon" />
              <span>Recycling Program</span>
            </div>
            
            <h1 className="main-title">
              Recycling <span className="title-highlight">Partnerships</span>
            </h1>
            
            <p className="main-subtitle">
              Track and manage your recycling partnerships with verified companies
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="stats-dashboard">
            <div className="stat-card">
              <div className="stat-icon-wrapper companies">
                <HiOutlineBuildingOffice2 />
              </div>
              <div className="stat-number">{totalCompanies}</div>
              <div className="stat-label">PARTNER COMPANIES</div>
              <div className="stat-trend positive">+{totalCompanies} total</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper contracts">
                <BsPeople />
              </div>
              <div className="stat-number">{totalContracts}</div>
              <div className="stat-label">ACTIVE CONTRACTS</div>
              <div className="stat-trend positive">{totalContracts} active</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper partners">
                <BsRecycle />
              </div>
              <div className="stat-number">{activePartners}</div>
              <div className="stat-label">ACTIVE PARTNERS</div>
              <div className="stat-trend neutral">{activePartners} of {totalCompanies}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search companies or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchCompaniesWithUsers} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {/* Companies Grid */}
          <div className="companies-grid">
            {filteredCompanies.length === 0 ? (
              <div className="no-results">
                <div className="empty-icon">
                  <FaRegUser />
                </div>
                <h4>No Companies Found</h4>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <div key={company.companyId} className="company-card">
                  
                  {/* Company Header */}
                  <div className="company-header" onClick={() => toggleCompany(company.companyId)}>
                    <div className="company-header-left">
                      <div className="company-avatar">
                        {company.companyName.charAt(0)}
                      </div>
                      <div className="company-info">
                        <h3 className="company-name">{company.companyName}</h3>
                        <div className="company-meta">
                          <span className="contract-count">
                            {company.users.length} {company.users.length === 1 ? 'contract' : 'contracts'}
                          </span>
                          <span className="meta-separator">•</span>
                          <span className="company-status">
                            {company.users.length > 0 ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="company-header-right">
                      <div className={`status-indicator ${company.users.length > 0 ? 'active' : 'inactive'}`}>
                        {company.users.length > 0 ? 'Active' : 'Inactive'}
                      </div>
                      <button className="expand-button">
                        {expandedCompanies[company.companyId] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedCompanies[company.companyId] && (
                    <div className="company-details">
                      {company.users.length === 0 ? (
                        <div className="empty-contracts">
                          <div className="empty-icon">
                            <FaRegUser />
                          </div>
                          <h4>No Active Contracts</h4>
                          <p>This company doesn't have any contracts yet</p>
                          <button className="invite-button">Invite Company</button>
                        </div>
                      ) : (
                        <div className="users-grid">
                          {company.users.map((user) => (
                            <div key={user.userId} className="user-card">
                              <div className="user-avatar">
                                {user.userName.charAt(0)}
                              </div>
                              <div className="user-details">
                                <h5 className="user-name">{user.userName}</h5>
                                <div className="user-email">
                                  <MdEmail className="email-icon" />
                                  <span>{user.email}</span>
                                </div>
                              </div>
                              <div className="user-badge">Active</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* Import Google Font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .recycling-progress-page {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(145deg, #f8fafc, #f1f5f9);
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 4rem;
          animation: fadeInDown 0.8s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(10, 77, 42, 0.1);
          margin-bottom: 2rem;
          color: #0a4d2a;
          font-weight: 500;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .badge-icon {
          font-size: 1.3rem;
          color: #0a4d2a;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .title-highlight {
          background: linear-gradient(145deg, #0a4d2a, #1a6a3a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .main-subtitle {
          font-size: 1.2rem;
          color: #475569;
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .search-wrapper {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1.1rem;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 50px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #0a4d2a;
          box-shadow: 0 0 0 4px rgba(10, 77, 42, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .clear-search:hover {
          background: #f1f5f9;
          color: #475569;
        }

        /* Error Message */
        .error-message {
          text-align: center;
          padding: 2rem;
          background: #fee2e2;
          border-radius: 16px;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease;
        }

        .error-message p {
          color: #991b1b;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .retry-button {
          padding: 0.75rem 2rem;
          background: #991b1b;
          border: none;
          border-radius: 40px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .retry-button:hover {
          background: #7f1d1d;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(153, 27, 27, 0.2);
        }

        /* Stats Dashboard */
        .stats-dashboard {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease 0.2s both;
          width: 100%;
        }

        .stat-card {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0a4d2a, #1a6a3a);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 50px rgba(10, 77, 42, 0.12);
          border-color: rgba(10, 77, 42, 0.2);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }

        .stat-icon-wrapper.companies {
          background: linear-gradient(145deg, #e0f2e0, #c8e6c9);
          color: #0a4d2a;
        }

        .stat-icon-wrapper.contracts {
          background: linear-gradient(145deg, #e0f2fe, #bae6fd);
          color: #0369a1;
        }

        .stat-icon-wrapper.partners {
          background: linear-gradient(145deg, #fef9c3, #fde047);
          color: #854d0e;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-trend {
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.35rem 1rem;
          border-radius: 30px;
          display: inline-block;
          width: fit-content;
          margin-top: 0.25rem;
        }

        .stat-trend.positive {
          background: #dcfce7;
          color: #166534;
        }

        .stat-trend.neutral {
          background: #f1f5f9;
          color: #475569;
        }

        /* Companies Grid */
        .companies-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: fadeInUp 0.8s ease 0.4s both;
          width: 100%;
        }

        .company-card {
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(226, 232, 240, 0.6);
          transition: all 0.3s ease;
          width: 100%;
        }

        .company-card:hover {
          box-shadow: 0 30px 50px rgba(10, 77, 42, 0.08);
          border-color: rgba(10, 77, 42, 0.15);
        }

        .company-header {
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: background 0.3s ease;
          width: 100%;
        }

        .company-header:hover {
          background: #fafbfc;
        }

        .company-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .company-avatar {
          width: 56px;
          height: 56px;
          background: linear-gradient(145deg, #0a4d2a, #1a6a3a);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          box-shadow: 0 10px 20px rgba(10, 77, 42, 0.2);
        }

        .company-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .company-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .company-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-size: 0.95rem;
        }

        .contract-count {
          font-weight: 500;
        }

        .meta-separator {
          color: #cbd5e1;
        }

        .company-status {
          color: #64748b;
        }

        .company-header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .status-indicator {
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .status-indicator.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-indicator.inactive {
          background: #f1f5f9;
          color: #475569;
        }

        .expand-button {
          width: 44px;
          height: 44px;
          border: none;
          background: #f1f5f9;
          border-radius: 14px;
          color: #0a4d2a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.1rem;
        }

        .expand-button:hover {
          background: #0a4d2a;
          color: white;
          transform: scale(1.05);
        }

        /* Company Details */
        .company-details {
          padding: 2rem;
          background: linear-gradient(145deg, #fafbfc, #f8fafc);
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          width: 100%;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
        }

        .user-card {
          background: white;
          border-radius: 20px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          width: 100%;
        }

        .user-card:hover {
          border-color: rgba(10, 77, 42, 0.15);
          box-shadow: 0 10px 25px rgba(10, 77, 42, 0.06);
          transform: translateX(4px);
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a4d2a;
          font-size: 1.2rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.35rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .email-icon {
          color: #0a4d2a;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .user-badge {
          padding: 0.25rem 0.75rem;
          background: #dcfce7;
          color: #166534;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* Empty States */
        .empty-contracts, .no-results {
          text-align: center;
          padding: 3rem;
          width: 100%;
        }

        .empty-icon {
          font-size: 4rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .empty-contracts h4, .no-results h4 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-contracts p, .no-results p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .invite-button {
          padding: 0.75rem 2rem;
          background: linear-gradient(145deg, #0a4d2a, #1a6a3a);
          border: none;
          border-radius: 40px;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(10, 77, 42, 0.25);
        }

        .invite-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(10, 77, 42, 0.35);
        }

        /* Animations */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        /* Responsive Design */
        @media (max-width: 1024px) {
          .container {
            padding: 2rem 1.5rem;
          }

          .main-title {
            font-size: 2.8rem;
          }

          .stats-dashboard {
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2.2rem;
          }

          .stats-dashboard {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .company-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .company-header-right {
            width: 100%;
            justify-content: space-between;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 1.5rem 1rem;
          }

          .main-title {
            font-size: 1.8rem;
          }

          .main-subtitle {
            font-size: 1rem;
          }

          .company-avatar {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }

          .company-name {
            font-size: 1.1rem;
          }

          .search-input {
            padding: 0.875rem 0.875rem 0.875rem 2.5rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}