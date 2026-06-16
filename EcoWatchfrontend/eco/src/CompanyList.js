import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = "http://localhost:5233/api";

const CompanyList = ({ userId, onCreateContract, goToHome, navigateToUpload }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractingId, setContractingId] = useState(null);
  const [contractSuccess, setContractSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [userContracts, setUserContracts] = useState([]);
  const [uploadingToCompany, setUploadingToCompany] = useState(null);

  const allMaterialTypes = [
    { id: 1, name: 'Plastic', icon: '♻️' },
    { id: 2, name: 'Paper', icon: '📄' },
    { id: 3, name: 'Metals', icon: '🔩' },
    { id: 4, name: 'Organics', icon: '🥩' }
  ];

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      fetchUserContracts();
    }
  }, [companies.length]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching companies...");
      const response = await fetch(`${API_BASE}/RecyclingCompany/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      console.log("📦 Companies received:", data);
      
      const companiesWithDetails = data.map((company) => ({
        ...company,
        id: company.id,
        contractsCount: company.contractsCount || 0,
        pointsPerContract: 50,
        hasActiveContract: true, 
        hasUserContract: false 
      }));

      setCompanies(companiesWithDetails);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContracts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const currentUserId = localStorage.getItem("userId");

      if (!currentUserId || !token) {
        console.log("No user ID or token");
        return;
      }

      console.log("=".repeat(50));
      console.log("🔍 FETCHING CONTRACTS FOR USER:", currentUserId);
      
      let response = await fetch(`${API_BASE}/contract/user/${currentUserId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      console.log("📡 First endpoint response status:", response.status);

      let contracts = [];
      
      if (response.ok) {
        contracts = await response.json();
        console.log("✅ Contracts from first endpoint:", contracts);
      } else {
        console.log("⚠️ First endpoint failed, trying alternative...");
        response = await fetch(`${API_BASE}/Contract/GetByUserAndCompany?userId=${currentUserId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (response.ok) {
          contracts = await response.json();
          console.log("✅ Contracts from second endpoint:", contracts);
        } else {
          console.log("❌ Both endpoints failed");
          return;
        }
      }

      const contractsArray = Array.isArray(contracts) ? contracts : [];
      console.log("📦 Final contracts array:", contractsArray);
      
      contractsArray.forEach((contract, index) => {
        console.log(`  Contract ${index + 1}:`, {
          id: contract.id,
          companyId: contract.companyId,
          status: contract.status,
          userId: contract.userId
        });
      });

      setUserContracts(contractsArray);
      
      setCompanies(prevCompanies => {
        const updatedCompanies = prevCompanies.map(company => {
          const hasContract = contractsArray.some(
            contract => String(contract.companyId) === String(company.id)
          );
          
          console.log(`🏢 Company ${company.id} - ${company.name}: hasContract = ${hasContract}`);
          
          return {
            ...company,
            hasUserContract: hasContract,
            hasActiveContract: true
          };
        });
        
        return updatedCompanies;
      });

    } catch (err) {
      console.error('❌ Error fetching user contracts:', err);
    }
  };

  const handleCreateContract = async (company) => {
    if (company.hasUserContract) {
      showNotification(`❌ You already have a contract with ${company.name}!`, 'error');
      return;
    }

    setContractingId(company.id);
    
    try {
      const token = localStorage.getItem("accessToken");
      const currentUserId = localStorage.getItem("userId");

      if (!currentUserId || !token) {
        throw new Error("Missing user ID or token");
      }

      console.log("=".repeat(50));
      console.log("📝 Creating contract for:", {
        userId: currentUserId,
        companyId: company.id,
        companyName: company.name
      });

      localStorage.setItem('selectedCompanyId', company.id);
      localStorage.setItem('selectedCompanyName', company.name);
      
      if (company.materialNames && company.materialNames.length > 0) {
        localStorage.setItem('selectedCompanyType', company.materialNames[0]);
      } else {
        localStorage.setItem('selectedCompanyType', '');
      }
      
      localStorage.setItem('selectedCompanyIcon', getCompanyIcon(company.materialNames));

      const contractData = {
        UserId: currentUserId,
        CompanyId: company.id
      };

      const response = await fetch(`${API_BASE}/Contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(contractData)
      });

      const responseText = await response.text();
      console.log("📡 Create contract response:", response.status, responseText);
      
      if (response.ok) {
        setContractSuccess(company.id);
        showNotification(`✅ Contract created successfully with ${company.name}!`, 'success');
        
        setCompanies(prevCompanies => 
          prevCompanies.map(c => 
            c.id === company.id 
              ? { ...c, hasUserContract: true } 
              : c
          )
        );
        
        console.log("🔄 Refreshing contracts...");
        setTimeout(async () => {
          await fetchUserContracts();
          console.log("✅ Contracts refreshed");
        }, 1000);
        
        if (onCreateContract) onCreateContract(company);

        const companyData = {
          id: company.id,
          name: company.name,
          materialNames: company.materialNames || [],
          icon: getCompanyIcon(company.materialNames),
          location: company.city || company.location,
          email: company.email,
          phone: company.phone,
          rating: company.rating
        };

        setTimeout(() => {
          if (navigateToUpload) {
            console.log("🚀 Navigating to upload with:", companyData);
            navigateToUpload(companyData);
          }
        }, 2000);
        
        setTimeout(() => setContractSuccess(null), 3000);
      } else {
        showNotification(`❌ Failed: ${responseText}`, 'error');
      }

    } catch (err) {
      showNotification(`❌ Error: ${err.message}`, 'error');
      console.error("❌ Contract creation error:", err);
    } finally {
      setContractingId(null);
    }
  };

  const handleUploadMaterial = (company) => {
    console.log("=".repeat(50));
    console.log("📤 UPLOAD BUTTON CLICKED!", company.name);
    console.log("Company ID:", company.id);
    console.log("Company Materials:", company.materialNames);
    
    setUploadingToCompany(company.id);
    
    localStorage.setItem('selectedCompanyId', company.id);
    localStorage.setItem('selectedCompanyName', company.name);
    
    if (company.materialNames && company.materialNames.length > 0) {
      localStorage.setItem('selectedCompanyType', company.materialNames[0]);
    } else {
      localStorage.setItem('selectedCompanyType', '');
    }
    
    localStorage.setItem('selectedCompanyIcon', getCompanyIcon(company.materialNames));
    localStorage.setItem('selectedCompanyLocation', company.city || company.location || '');
    localStorage.setItem('selectedCompanyEmail', company.email || '');
    localStorage.setItem('selectedCompanyPhone', company.phone || '');
    localStorage.setItem('selectedCompanyRating', company.rating || '4.5');

    const companyData = {
      id: company.id,
      name: company.name,
      materialNames: company.materialNames || [],
      icon: getCompanyIcon(company.materialNames),
      location: company.city || company.location,
      email: company.email,
      phone: company.phone,
      rating: company.rating,
      hasActiveContract: true,
      description: company.description
    };

    showNotification(`📤 Redirecting to upload materials for ${company.name}...`, 'success');
    
    if (navigateToUpload && typeof navigateToUpload === 'function') {
      console.log("✅ Calling navigateToUpload with companyData:", companyData);
      navigateToUpload(companyData);
    } else {
      console.error('❌ navigateToUpload function is not provided');
      showNotification('Navigation error: Please try again', 'error');
      
      setTimeout(() => {
        window.location.href = '/upload-material';
      }, 1000);
    }
    
    setTimeout(() => setUploadingToCompany(null), 1000);
  };

  const getCompanyIcon = (materialNames) => {
    if (!materialNames || materialNames.length === 0) return '🏢';
    
    const icons = {
      'Plastic': '♻️',
      'Metals': '🔩',
      'Paper': '📄',
      'Organics': '🥩',
      'Glass': '🍾',
      'Electronics': '💻',
      'Wood': '🪵'
    };
    
    const firstMaterial = materialNames[0];
    return icons[firstMaterial] || '🏢';
  };

  const getMaterialIcon = (materialName) => {
    const icons = {
      'Plastic': '♻️',
      'Metals': '🔩',
      'Paper': '📄',
      'Organics': '🥩',
      'Glass': '🍾',
      'Electronics': '💻',
      'Wood': '🪵'
    };
    return icons[materialName] || '♻️';
  };

  const getFilteredCompanies = () => {
    let filtered = companies;
    
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.materialNames?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(company =>
        company.materialNames?.some(m => m.toLowerCase() === filterType.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredCompanies = getFilteredCompanies();

  if (loading) {
    return (
      <div className="companies-loading">
        <div className="loading-spinner"></div>
        <p>Loading companies...</p>
        <style jsx>{`
          .companies-loading {
            background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 32px;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 50, 0, 0.08);
            max-width: 1400px;
            margin: 20px auto;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(21, 87, 36, 0.1);
            border-top-color: #155724;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            color: #2d5a3a;
            font-size: 1.1rem;
            font-weight: 400;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="companies-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification-toast notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header Section */}
      <div className="companies-header">
        <div className="header-content">
          <div className="text-center w-100">
            <h2>Recycling Companies</h2>
            <p>Contract with companies and earn bonus points • <span className="highlight">{filteredCompanies.length}</span> companies available</p>
          </div>
        </div>
        <button onClick={fetchCompanies} className="refresh-btn" title="Refresh">
          <span>⟳</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search companies by name, description, location, or materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Material Types</option>
          {allMaterialTypes.map(material => (
            <option key={material.id} value={material.name.toLowerCase()}>
              {material.icon} {material.name}
            </option>
          ))}
        </select>
        {(searchTerm || filterType !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="reset-btn"
          >
            Reset Filters
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {filteredCompanies.length === 0 ? (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <h3>No companies found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="company-card">
              {/* Company Header */}
              <div className="company-header">
                <span className="company-icon">{getCompanyIcon(company.materialNames)}</span>
                <div className="company-title">
                  <h3>{company.name}</h3>
                  {company.city && (
                    <div className="company-location">
                      <span>{company.city}</span>
                    </div>
                  )}
                  {company.hasUserContract && (
                    <div className="active-contract-badge">
                      <span>✅</span>
                      <span>Contract Exists</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {company.description && (
                <p className="company-description">{company.description}</p>
              )}

              {/* Contact Info */}
              <div className="contact-info">
                {company.email && (
                  <div className="contact-item">
                    <span>📧</span>
                    <span>{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="contact-item">
                    <span>📞</span>
                    <span>{company.phone}</span>
                  </div>
                )}
              </div>

              {company.materialNames && company.materialNames.length > 0 && (
                <div className="material-types">
                  {company.materialNames.map((material, index) => (
                    <span key={index} className="material-tag">
                      {getMaterialIcon(material)} {material}
                    </span>
                  ))}
                </div>
              )}

              {/* Statistics */}
              <div className="company-stats">
                <span className="stat-badge rating">⭐ {company.rating || 'New'}</span>
                {company.contractsCount > 0 && (
                  <span className="stat-badge contracts">📋 {company.contractsCount}</span>
                )}
                <span className="stat-badge points">✨ +{company.pointsPerContract}</span>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {contractSuccess === company.id ? (
                  <div className="success-message">
                    <span>✅</span>
                    <div>
                      <strong>Contract created!</strong>
                      <small>Redirecting...</small>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCreateContract(company)}
                    disabled={contractingId !== null || company.hasUserContract}
                    className={`action-btn contract-btn ${contractingId === company.id ? 'loading' : ''} ${company.hasUserContract ? 'disabled' : ''}`}
                  >
                    {contractingId === company.id ? (
                      <>
                        <span className="spinner"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <span>🤝</span>
                        {company.hasUserContract ? 'Contract Already Exists' : 'Create Contract'}
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    console.log("🔵 Upload button clicked for:", company.name);
                    handleUploadMaterial(company);
                  }}
                  disabled={uploadingToCompany === company.id}
                  className="action-btn upload-btn"
                  title="Upload materials to this company"
                >
                  {uploadingToCompany === company.id ? 'Redirecting...' : 'Upload Material'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="tips-section">
        <span className="tips-icon">💡</span>
        <div className="tips-content">
          <strong>Tip:</strong> 
          <ul className="tips-list">
            <li> - Click "Create Contract" to partner with a company</li>
            <li> - After contract is active, use "Upload Material" to recycle and earn points</li>
            <li>- Companies with contracts show a green badge</li>
            <li> - Each company can accept multiple material types</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .companies-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .notification-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 16px 24px;
          border-radius: 50px;
          color: white;
          font-weight: 500;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .notification-success {
          background: linear-gradient(135deg, #155724 0%, #1e7e34 100%);
        }

        .notification-error {
          background: linear-gradient(135deg, #721c24 0%, #a71d2a 100%);
        }

        .companies-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          padding: 25px 30px;
          border-radius: 28px;
          box-shadow: 0 10px 30px rgba(0, 40, 0, 0.06);
          border: 1px solid rgba(21, 87, 36, 0.08);
          position: relative;
        }

        .header-content {
          width: 100%;
          text-align: center;
        }

        .header-content h2 {
          font-size: 1.9rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #1a3f25 0%, #2d6a4f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .header-content p {
          color: #5a6b5e;
          font-size: 1rem;
          margin: 0;
        }

        .highlight {
          color: #1a4d2a;
          font-weight: 600;
          background: rgba(21, 87, 36, 0.1);
          padding: 3px 10px;
          border-radius: 50px;
        }

        .refresh-btn {
          background: white;
          border: 1px solid rgba(21, 87, 36, 0.15);
          color: #1a4d2a;
          width: 48px;
          height: 48px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          position: absolute;
          right: 25px;
          top: 50%;
          transform: translateY(-50%);
        }

        .refresh-btn:hover {
          transform: translateY(-50%) rotate(180deg) scale(1.1);
          background: linear-gradient(135deg, #155724 0%, #1e7e34 100%);
          border-color: transparent;
          color: white;
          box-shadow: 0 10px 25px rgba(21, 87, 36, 0.3);
        }

        .search-filter-section {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          background: white;
          padding: 20px;
          border-radius: 24px;
          box-shadow: 0 8px 20px rgba(0, 40, 0, 0.04);
          border: 1px solid rgba(21, 87, 36, 0.06);
        }

        .search-box {
          flex: 2;
          min-width: 280px;
          display: flex;
          align-items: center;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 18px;
          padding: 0 18px;
          border: 1px solid rgba(21, 87, 36, 0.1);
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: #155724;
          box-shadow: 0 0 0 4px rgba(21, 87, 36, 0.1);
          background: white;
        }

        .search-icon {
          font-size: 1.2rem;
          opacity: 0.5;
          margin-right: 12px;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 16px 0;
          font-size: 0.95rem;
          color: #2d3f33;
          outline: none;
        }

        .search-box input::placeholder {
          color: #8a9b90;
        }

        .filter-select {
          flex: 1;
          min-width: 200px;
          padding: 0 20px;
          border-radius: 18px;
          border: 1px solid rgba(21, 87, 36, 0.1);
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          font-size: 0.95rem;
          color: #2d3f33;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a4d2a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 20px center;
          background-size: 16px;
        }

        .filter-select:focus {
          border-color: #155724;
          box-shadow: 0 0 0 4px rgba(21, 87, 36, 0.1);
          outline: none;
          background-color: white;
        }

        .reset-btn {
          padding: 0 25px;
          border-radius: 18px;
          border: 1px solid rgba(21, 87, 36, 0.15);
          background: white;
          color: #1a4d2a;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .reset-btn:hover {
          background: rgba(21, 87, 36, 0.05);
          border-color: #155724;
        }

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

        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .company-card {
          background: white;
          border-radius: 32px;
          padding: 28px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(21, 87, 36, 0.08);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .company-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1a4d2a, #2d6a4f, #1a4d2a);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .company-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 50px rgba(21, 87, 36, 0.15);
          border-color: transparent;
        }

        .company-card:hover::before {
          opacity: 1;
        }

        .company-header {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 20px;
        }

        .company-icon {
          font-size: 3rem;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          box-shadow: 0 10px 20px rgba(21, 87, 36, 0.1);
          transition: all 0.3s ease;
        }

        .company-card:hover .company-icon {
          transform: scale(1.1) rotate(5deg);
          background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
        }

        .company-title {
          flex: 1;
        }

        .company-title h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #1a3f25;
        }

        .company-location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5a6b5e;
          font-size: 0.9rem;
          margin-bottom: 6px;
        }

        .active-contract-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #d4edda;
          color: #155724;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid #155724;
          margin-top: 6px;
        }

        .company-description {
          color: #4a5b4e;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .contact-info {
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 20px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #2d3f33;
          font-size: 0.9rem;
          padding: 6px 0;
        }

        .contact-item span:first-child {
          opacity: 0.6;
          width: 24px;
        }

        .material-types {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .material-tag {
          background: linear-gradient(135deg, #e8f5e9 0%, #d0e6d2 100%);
          color: #1a4d2a;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid rgba(21, 87, 36, 0.1);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .material-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(21, 87, 36, 0.15);
        }

        .company-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .stat-badge {
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .stat-badge.rating {
          background: linear-gradient(135deg, #fff3cd 0%, #fff9e6 100%);
          color: #856404;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .stat-badge.contracts {
          background: linear-gradient(135deg, #d1ecf1 0%, #e8f7fc 100%);
          color: #0c5460;
          border: 1px solid rgba(23, 162, 184, 0.3);
        }

        .stat-badge.points {
          background: linear-gradient(135deg, #d4edda 0%, #e8f5e9 100%);
          color: #155724;
          border: 1px solid rgba(21, 87, 36, 0.3);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .action-btn {
          flex: 1;
          padding: 14px;
          border-radius: 18px;
          border: none;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .contract-btn {
          background: linear-gradient(135deg, #155724 0%, #1e7e34 100%);
          color: white;
        }

        .contract-btn.disabled {
          background: #6c757d;
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-btn {
          background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
          color: white;
        }

        .upload-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1976D2 0%, #0d47a1 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(33, 150, 243, 0.3);
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .action-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .success-message {
          flex: 1;
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border-radius: 18px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(21, 87, 36, 0.2);
        }

        .success-message span {
          font-size: 1.5rem;
        }

        .success-message strong {
          display: block;
          color: #155724;
          font-size: 0.9rem;
        }

        .success-message small {
          color: #1e7e34;
          font-size: 0.8rem;
        }

        .no-results {
          text-align: center;
          padding: 60px 40px;
          background: white;
          border-radius: 32px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
        }

        .no-results-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-results h3 {
          font-size: 1.5rem;
          color: #1a3f25;
          margin-bottom: 10px;
        }

        .no-results p {
          color: #5a6b5e;
          margin-bottom: 25px;
        }

        .clear-filters-btn {
          background: linear-gradient(135deg, #155724 0%, #1e7e34 100%);
          border: none;
          color: white;
          padding: 14px 35px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(21, 87, 36, 0.3);
        }

        .clear-filters-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(21, 87, 36, 0.4);
        }

        .tips-section {
          margin-top: 30px;
          background: linear-gradient(145deg, #f0f9f0 0%, #e8f3e8 100%);
          border-radius: 24px;
          padding: 20px 25px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          border: 1px solid rgba(21, 87, 36, 0.15);
        }

        .tips-icon {
          font-size: 2rem;
          color: #FFD700;
          text-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 60px #FF8C00;
          animation: bulbGlow 1.5s ease-in-out infinite;
        }

        @keyframes bulbGlow {
          0% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 60px #FF8C00; }
          50% { text-shadow: 0 0 30px #FFD700, 0 0 60px #FFA500, 0 0 90px #FF8C00, 0 0 120px #FF4500; }
          100% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 60px #FF8C00; }
        }

        .tips-content {
          flex: 1;
          color: #1a3f25;
        }

        .tips-list {
          margin: 8px 0 0;
          padding-left: 20px;
        }

        .tips-list li {
          margin: 5px 0;
          color: #2d5a3a;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .companies-header {
            padding: 20px;
          }

          .header-content h2 {
            font-size: 1.6rem;
          }

          .search-filter-section {
            flex-direction: column;
          }

          .search-box, .filter-select, .reset-btn {
            width: 100%;
          }

          .companies-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .company-card {
            padding: 20px;
          }

          .tips-section {
            padding: 15px 20px;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .tips-list {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyList;