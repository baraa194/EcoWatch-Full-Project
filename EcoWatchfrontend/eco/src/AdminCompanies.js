import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminCompanies = ({ goToHome }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const availableMaterials = [
    { id: 1, name: 'Plastic', icon: '♻️', points: 10 },
    { id: 2, name: 'Paper', icon: '📄', points: 8 },
    { id: 3, name: 'Metals', icon: '🔩', points: 15 },
    { id: 4, name: 'Organics', icon: '🥩', points: 5 }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    city: '',
    materialsId: [], // array of material IDs
    registration_Number: ''
  });

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    
    let finalPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
    return `http://localhost:5233${finalPath}`;
  };

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5233/api/RecyclingCompany/all', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched companies:', data);
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle material selection
  const handleMaterialChange = (materialId) => {
    setFormData(prev => {
      const currentMaterials = prev.materialsId || [];
      if (currentMaterials.includes(materialId)) {
        return {
          ...prev,
          materialsId: currentMaterials.filter(id => id !== materialId)
        };
      } else {
        return {
          ...prev,
          materialsId: [...currentMaterials, materialId]
        };
      }
    });
  };

  // Add new company
  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Description', formData.description || '');
      formDataToSend.append('Email', formData.email || '');
      formDataToSend.append('Phone', formData.phone || '');
      formDataToSend.append('City', formData.city || '');
      formDataToSend.append('Registration_Number', formData.registration_Number || '');
      
      
      if (formData.materialsId && formData.materialsId.length > 0) {
      formData.materialsId.forEach(id => {
        formDataToSend.append('MaterialIds', id); 
      });
    }
      if (selectedLogo) {
        formDataToSend.append('Logo', selectedLogo);
      }

      const response = await fetch('http://localhost:5233/api/RecyclingCompany/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add company: ${response.status} - ${errorText}`);
      }

      alert('Company added successfully!');
      
      await fetchCompanies();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error adding company:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update company
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Description', formData.description || '');
      formDataToSend.append('Email', formData.email || '');
      formDataToSend.append('Phone', formData.phone || '');
      formDataToSend.append('City', formData.city || '');
      formDataToSend.append('Registration_Number', formData.registration_Number || '');
      
        if (formData.materialsId && formData.materialsId.length > 0) {
      formData.materialsId.forEach(id => {
        formDataToSend.append('MaterialIds', id); 
      });
    }

      if (selectedLogo) {
        formDataToSend.append('Logo', selectedLogo);
      }

      const response = await fetch(`http://localhost:5233/api/RecyclingCompany/${editingCompany.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update company: ${errorText}`);
      }

      alert('Company updated successfully!');
      
      await fetchCompanies();
      setEditingCompany(null);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete company
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:5233/api/RecyclingCompany/${companyId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete company: ${errorText}`);
      }

      alert('Company deleted successfully!');
      await fetchCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      city: '',
      materialsId: [],
      registration_Number: ''
    });
    setSelectedLogo(null);
    setLogoPreview('');
  };

  const openEditForm = (company) => {
    console.log('Opening edit form for company:', company);
    
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      description: company.description || '',
      email: company.email || '',
      phone: company.phone || '',
      city: company.city || '',
      materialsId: [], 
      registration_Number: company.registration_Number || company.registrationNumber || ''
    });
    if (company.logo_url) {
      setLogoPreview(getLogoUrl(company.logo_url));
    }
    setShowForm(true);
  };

  return (
    <div className="companies-admin-container">
      {/* Header Section */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fas fa-building"></i>
          </div>
          <div>
            <h1>Recycling Company Management</h1>
            <p>Manage recycling companies and their information</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={goToHome} className="btn-back">
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
          <button onClick={fetchCompanies} className="retry-btn">
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="admin-content">
        {/* Form Section */}
        <div className="form-section">
          <div className="form-header">
            <div className="form-title">
              <i className="fas fa-plus-circle"></i>
              <h3>{editingCompany ? 'Edit Company' : 'Add New Company'}</h3>
            </div>
            <button 
              className={`toggle-form-btn ${showForm ? 'active' : ''}`}
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setEditingCompany(null);
                  resetForm();
                }
              }}
            >
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
              {showForm ? 'Close Form' : 'Add New Company'}
            </button>
          </div>

          {showForm && (
            <div className="form-wrapper">
              <form onSubmit={editingCompany ? handleUpdateCompany : handleAddCompany} encType="multipart/form-data">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-tag"></i>
                      Company Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., EcoPlast Recycling"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-map-marker-alt"></i>
                      City
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Cairo"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      <i className="fas fa-align-left"></i>
                      Description
                    </label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      placeholder="Enter company description..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-envelope"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="contact@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-phone"></i>
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+20 123 456 7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-id-card"></i>
                      Registration Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., REG-2025-001"
                      value={formData.registration_Number}
                      onChange={(e) => setFormData({...formData, registration_Number: e.target.value})}
                    />
                  </div>

                  {/* Materials Selection - متعدد الاختيار */}
                  <div className="form-group full-width">
                    <label className="form-label">
                      <i className="fas fa-recycle"></i>
                      Recycled Materials
                    </label>
                    <div className="materials-container">
                      {availableMaterials.map((material) => (
                        <div key={material.id} className="material-checkbox">
                          <label className="material-label">
                            <input
                              type="checkbox"
                              value={material.id}
                              checked={formData.materialsId.includes(material.id)}
                              onChange={() => handleMaterialChange(material.id)}
                            />
                            <span className="material-name">
                              {material.icon} {material.name}
                            </span>
                            <span className="material-points">
                              {material.points} pts/kg
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {formData.materialsId.length === 0 && (
                      <small className="text-muted">Select at least one material</small>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      <i className="fas fa-image"></i>
                      Company Logo
                    </label>
                    <div className="logo-upload-container">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="file-input"
                      />
                      <label htmlFor="logo-upload" className="file-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        Choose Logo Image
                      </label>
                      {selectedLogo && (
                        <span className="file-name">
                          <i className="fas fa-check-circle"></i>
                          {selectedLogo.name}
                        </span>
                      )}
                    </div>
                    {logoPreview && (
                      <div className="logo-preview">
                        <img src={logoPreview} alt="Logo preview" />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className={`fas ${editingCompany ? 'fa-save' : 'fa-check-circle'}`}></i>
                          {editingCompany ? 'Save Changes' : 'Add Company'}
                        </>
                      )}
                    </button>
                    
                    {showForm && (
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => {
                          setShowForm(false);
                          setEditingCompany(null);
                          resetForm();
                        }}
                      >
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Companies List Section */}
        <div className="list-section">
          <div className="list-header">
            <div className="list-title">
              <i className="fas fa-list"></i>
              <h3>Companies List</h3>
            </div>
            <div className="list-stats">
              <span className="stats-badge">
                <i className="fas fa-building"></i>
                {companies.length} Total
              </span>
            </div>
          </div>

          {loading && !companies.length ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading companies...</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="companies-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Logo</th>
                    <th>Company Name</th>
                    <th>City</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Materials</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length > 0 ? (
                    companies.map((company, index) => (
                      <tr key={company.id || index}>
                        <td>
                          <span className="id-badge">{index + 1}</span>
                        </td>
                        <td>
                          {company.logo_url ? (
                            <img 
                              src={getLogoUrl(company.logo_url)} 
                              alt={company.name}
                              className="company-logo-thumbnail"
                              style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '8px', 
                                objectFit: 'cover',
                                border: '1px solid #ddd'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5OTk5Ij5Ob3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                              }}
                            />
                          ) : (
                            <div className="logo-placeholder">
                              <i className="fas fa-building"></i>
                            </div>
                          )}
                        </td>
                        <td className="company-name">
                          <i className="fas fa-building"></i>
                          {company.name}
                        </td>
                        <td>
                          {company.city ? (
                            <span className="location-badge">
                              <i className="fas fa-map-marker-alt"></i>
                              {company.city}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {company.email ? (
                            <a href={`mailto:${company.email}`} className="email-link">
                              <i className="fas fa-envelope"></i>
                              {company.email}
                            </a>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {company.phone ? (
                            <a href={`tel:${company.phone}`} className="phone-link">
                              <i className="fas fa-phone"></i>
                              {company.phone}
                            </a>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {company.materialNames && company.materialNames.length > 0 ? (
                            <div className="materials-badges">
                              {company.materialNames.map((material, idx) => {
                                const materialInfo = availableMaterials.find(m => m.name === material);
                                return (
                                  <span key={idx} className="material-badge">
                                    {materialInfo?.icon || '♻️'} {material}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => openEditForm(company)}
                              className="action-btn edit"
                              title="Edit Company"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteCompany(company.id)}
                              className="action-btn delete"
                              title="Delete Company"
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
                        <p>No companies found</p>
                        <p className="empty-sub">Click "Add New Company" to get started</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .companies-admin-container {
          padding: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 28px;
          padding: 25px 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 40, 0, 0.06);
          border: 1px solid rgba(21, 87, 36, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #0a2f1a;
        }

        .header-content h1 {
          font-size: 1.8rem;
          margin: 0 0 5px 0;
          color: #1a3f25;
        }

        .header-content p {
          margin: 0;
          color: #5a6b5e;
        }

        .btn-back {
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

        .btn-back:hover {
          background: rgba(21, 87, 36, 0.05);
          border-color: #155724;
          transform: translateX(-3px);
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

        .retry-btn {
          margin-left: auto;
          padding: 6px 12px;
          border-radius: 30px;
          border: 1px solid rgba(220, 53, 69, 0.3);
          background: white;
          color: #721c24;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .retry-btn:hover {
          background: #721c24;
          color: white;
          border-color: #721c24;
        }

        .admin-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          background: white;
          border-radius: 28px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
          overflow: hidden;
        }

        .form-header {
          padding: 20px 25px;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-bottom: 1px solid rgba(197, 160, 89, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-title i {
          font-size: 1.5rem;
          color: #C5A059;
        }

        .form-title h3 {
          margin: 0;
          color: #1a3f25;
          font-size: 1.2rem;
        }

        .toggle-form-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 50px;
          border: 1px solid rgba(197, 160, 89, 0.3);
          background: white;
          color: #C5A059;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-form-btn:hover {
          background: #C5A059;
          color: white;
          border-color: #C5A059;
        }

        .toggle-form-btn.active {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .form-wrapper {
          padding: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: span 2;
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

        .required {
          color: #dc3545;
          margin-left: 2px;
        }

        .form-input,
        .form-textarea {
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(21, 87, 36, 0.15);
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          font-size: 0.95rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #C5A059;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
          outline: none;
          background: white;
        }

        .form-textarea {
          resize: vertical;
        }

        .materials-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          padding: 20px;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 20px;
          border: 1px solid rgba(21, 87, 36, 0.1);
        }

        .material-checkbox {
          margin: 0;
        }

        .material-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(21, 87, 36, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .material-label:hover {
          border-color: #C5A059;
          box-shadow: 0 5px 15px rgba(197, 160, 89, 0.1);
          transform: translateY(-2px);
        }

        .material-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #C5A059;
        }

        .material-name {
          flex: 1;
          font-size: 0.95rem;
          color: #1a3f25;
          font-weight: 500;
        }

        .material-points {
          font-size: 0.8rem;
          color: #C5A059;
          background: rgba(197, 160, 89, 0.1);
          padding: 3px 8px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .form-actions {
          grid-column: span 2;
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .btn-submit {
          flex: 1;
          padding: 14px 24px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #C5A059 0%, #E5C687 100%);
          color: #0a2f1a;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(197, 160, 89, 0.3);
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(197, 160, 89, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 14px 30px;
          border-radius: 16px;
          border: 1px solid rgba(21, 87, 36, 0.15);
          background: white;
          color: #6c757d;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #f8f9fa;
          border-color: #dc3545;
          color: #dc3545;
        }

        .list-section {
          background: white;
          border-radius: 28px;
          box-shadow: 0 15px 35px rgba(0, 30, 0, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.2);
          overflow: hidden;
        }

        .list-header {
          padding: 20px 25px;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-bottom: 1px solid rgba(197, 160, 89, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .list-title i {
          font-size: 1.5rem;
          color: #C5A059;
        }

        .list-title h3 {
          margin: 0;
          color: #1a3f25;
          font-size: 1.2rem;
        }

        .list-stats {
          display: flex;
          gap: 15px;
        }

        .stats-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(197, 160, 89, 0.1);
          border-radius: 50px;
          color: #C5A059;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .table-wrapper {
          padding: 25px;
          overflow-x: auto;
        }

        .companies-table {
          width: 100%;
          border-collapse: collapse;
        }

        .companies-table th {
          text-align: left;
          padding: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #5a6b5e;
          border-bottom: 2px solid rgba(197, 160, 89, 0.2);
          white-space: nowrap;
        }

        .companies-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(21, 87, 36, 0.1);
          color: #2d3f33;
        }

        .companies-table tbody tr:hover {
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
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

        .company-name {
          font-weight: 600;
          color: #1a3f25;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .location-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(197, 160, 89, 0.05);
          border-radius: 50px;
          font-size: 0.85rem;
          color: #1a3f25;
        }

        .email-link,
        .phone-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #1a4d2a;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .email-link:hover,
        .phone-link:hover {
          color: #C5A059;
        }

        .materials-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-width: 250px;
        }

        .material-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(197, 160, 89, 0.05);
          border-radius: 50px;
          font-size: 0.8rem;
          color: #1a3f25;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .action-btn.edit {
          background: rgba(197, 160, 89, 0.1);
          color: #C5A059;
        }

        .action-btn.edit:hover {
          background: #C5A059;
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

        .loading-state {
          text-align: center;
          padding: 60px;
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

        .text-muted {
          color: #8a9b90 !important;
        }

        @media (max-width: 768px) {
          .companies-admin-container {
            padding: 15px;
          }

          .admin-header {
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

          .form-group.full-width {
            grid-column: span 1;
          }

          .materials-container {
            grid-template-columns: 1fr;
          }

          .form-actions {
            grid-column: span 1;
            flex-direction: column;
          }

          .action-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCompanies;