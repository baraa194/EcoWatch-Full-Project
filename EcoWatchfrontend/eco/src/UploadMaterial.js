import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = "http://localhost:5233/api";

const UploadMaterial = ({ selectedCompany, goToHome, userId, onUploadSuccess }) => {
  const [items, setItems] = useState([
    { id: 1, materialType: '', quantity: '', description: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [nextId, setNextId] = useState(2);
  const [activeContract, setActiveContract] = useState(null);
  const [loadingContract, setLoadingContract] = useState(true);
  const [contractError, setContractError] = useState(null);
  const [pointsAdded, setPointsAdded] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const materialTypes = [
    { value: 'Plastic',  label: 'Plastic',  icon: '🥤', points: 10 },
    { value: 'Paper',    label: 'Paper',    icon: '📃', points: 8  },
    { value: 'Metals',   label: 'Metals',   icon: '🔩', points: 15 },
    { value: 'Organics', label: 'Organics', icon: '🌱', points: 5  },
  ];

  useEffect(() => {
    const fetchActiveContract = async () => {
      if (!selectedCompany || !selectedCompany.id || !userId) {
        setLoadingContract(false);
        return;
      }
      try {
        setLoadingContract(true);
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error("No access token found");

        const response = await fetch(`${API_BASE}/Contract/GetByUserAndCompany?companyId=${selectedCompany.id}`, {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });

        if (response.status === 404) {
          setContractError(`No contract found with ${selectedCompany.name}. Please create a contract first.`);
          setLoadingContract(false);
          return;
        }
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const contractData = await response.json();
        setActiveContract({ id: contractData.id, userId: contractData.userId, companyId: contractData.companyId, status: 'Active' });
        setContractError(null);

      } catch (err) {
        setContractError(`Error: ${err.message}`);
      } finally {
        setLoadingContract(false);
      }
    };
    fetchActiveContract();
  }, [selectedCompany, userId]);

  const addNewItem = () => {
    setItems([...items, { id: nextId, materialType: '', quantity: '', description: '' }]);
    setNextId(nextId + 1);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setError("You must have at least one item");
      setTimeout(() => setError(null), 3000);
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotalWeight = () =>
    items.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0);

  const calculateTotalPoints = () =>
    items.reduce((total, item) => {
      const mat = materialTypes.find(m => m.value === item.materialType);
      return total + ((parseFloat(item.quantity) || 0) * (mat?.points || 0));
    }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompany || !selectedCompany.id) { setError('Please select a company first'); return; }
    if (!activeContract) { setError(`No active contract found with ${selectedCompany.name}.`); return; }
    for (const item of items) {
      if (!item.materialType || !item.quantity || item.quantity <= 0) {
        setError('Please fill all material types and valid quantities');
        return;
      }
    }

    const totalPointsEarned = calculateTotalPoints();
    setEarnedPoints(totalPointsEarned);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setPointsAdded(false);

      const token = localStorage.getItem('accessToken');
      const totalWeight = calculateTotalWeight();
      const totalWeightInt = Math.floor(totalWeight);

      const itemsArray = items.map(item => ({
        materialType: item.materialType,
        weightKG: Math.floor(parseFloat(item.quantity)),
        description: item.description || `${item.materialType} recycling item`
      }));

      const transactionData = {
        contractId: activeContract.id,
        totalWeight: totalWeightInt,
        createdat: new Date().toISOString(),
        items: itemsArray
      };

      const response = await fetch(`${API_BASE}/RecyclingTransaction/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(transactionData)
      });

      const responseText = await response.text();

      if (response.ok) {
        setSuccess(true);

        let transactionId = null;

        const parsedInt = parseInt(responseText.trim());
        if (!isNaN(parsedInt) && parsedInt > 0) {
          transactionId = parsedInt;
        } else {
          try {
            const responseData = JSON.parse(responseText);
            transactionId = responseData.id ?? responseData.Id ?? responseData.transactionId ?? null;
          } catch {
            // Invalid JSON response
          }
        }

        const uploadHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
        uploadHistory.push({
          date: new Date().toISOString(),
          contractId: activeContract.id,
          transactionId,
          companyId: selectedCompany.id,
          companyName: selectedCompany.name,
          items,
          totalWeight,
          totalPoints: totalPointsEarned
        });
        localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));

        if (transactionId) {
          try {
            const pointsResponse = await fetch(
              `${API_BASE}/UserPoints/ForUploadRecyling?transactionid=${transactionId}`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );

            if (pointsResponse.ok) {
              setPointsAdded(true);
            }
          } catch (pointsErr) {
            console.error('Points error:', pointsErr);
          }
        }

        setItems([{ id: 1, materialType: '', quantity: '', description: '' }]);
        setNextId(2);
        if (onUploadSuccess) onUploadSuccess(items);
        setTimeout(() => setSuccess(false), 5000);

      } else {
        try {
          const responseData = JSON.parse(responseText);
          setError(`Upload failed: ${responseData.title || responseData.message || 'Unknown error'}`);
        } catch {
          setError(`Upload failed: ${responseText.substring(0, 100)}`);
        }
      }

    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCompany) {
    return (
      <div className="upload-container">
        <div className="no-company-warning">
          <span className="warning-icon">⚠️</span>
          <h3>No Company Selected</h3>
          <p>Please select a company from the dashboard before uploading materials.</p>
          <button className="back-btn-large" onClick={goToHome}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (loadingContract) {
    return (
      <div className="upload-container">
        <div className="loading-contract">
          <div className="spinner"></div>
          <p>Checking active contract...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button className="back-btn" onClick={goToHome}>← Back</button>
        <div className="header-title">
          <h2>Upload Materials</h2>
          <p>Earn points when you recycle ♻️</p>
        </div>
        <div className="company-mini-card">
          <span>{selectedCompany.icon || '🏢'}</span>
          <div><strong>{selectedCompany.name}</strong></div>
        </div>
      </div>

      <div className="company-info-card">
        <div className="company-info-content">
          <div className="company-logo">{selectedCompany.icon || '🏢'}</div>
          <div>
            <h4>{selectedCompany.name}</h4>
            <p>{selectedCompany.type || 'Recycling Company'}</p>
          </div>
        </div>
      </div>

      <div className="upload-card">
        {error && <div className="error-box">❌ {error}</div>}
        {contractError && <div className="error-box">{contractError}</div>}

        {contractError ? (
          <div className="no-contract-warning">
            <span className="warning-icon">⚠️</span>
            <h4>No Active Contract</h4>
            <p>{contractError}</p>
            <button className="back-btn-large" onClick={goToHome}>← Back to Companies</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {items.map((item, index) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <h5>
                    Material #{index + 1}
                    {item.materialType && item.quantity && (
                      <span className="item-points">
                        +{Math.round(parseFloat(item.quantity) * (materialTypes.find(m => m.value === item.materialType)?.points || 0))} pts
                      </span>
                    )}
                  </h5>
                  {items.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label>Material Type *</label>
                    <select
                      className="custom-input"
                      value={item.materialType}
                      onChange={(e) => updateItem(item.id, 'materialType', e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      {materialTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label} ({type.points} pts/kg)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label>Quantity (kg) *</label>
                    <input
                      type="number"
                      className="custom-input"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label>Description (Optional)</label>
                  <textarea
                    className="custom-input"
                    rows="2"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Add any notes about this material..."
                  />
                </div>
              </div>
            ))}

            <button type="button" className="add-btn" onClick={addNewItem}>
              ➕ Add Another Material
            </button>

            <div className="total-summary">
              <div className="total-row">
                <span>Total Weight:</span>
                <strong>{calculateTotalWeight()} kg</strong>
              </div>
              <div className="total-row">
                <span>Total Points:</span>
                <strong className="points-highlight">{calculateTotalPoints()} ⭐</strong>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading || !activeContract}>
              {loading ? (
                <><span className="spinner-inline">🔄</span> Uploading...</>
              ) : (
                `Upload & Earn ${calculateTotalPoints()} Points ⭐`
              )}
            </button>
          </form>
        )}
      </div>

      {/* Large Success Message Popup */}
      {success && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Upload Successful!</h2>
            <div className="success-details">
              {pointsAdded ? (
                <>
                  <p className="points-earned">You earned</p>
                  <p className="points-amount">{earnedPoints} Points!</p>
                  <p className="points-star">⭐ ⭐ ⭐</p>
                </>
              ) : (
                <p>Processing points...</p>
              )}
            </div>
            <button className="success-close-btn" onClick={() => setSuccess(false)}>
              Great!
            </button>
          </div>
        </div>
      )}

      <style>{`
        .upload-container { max-width: 1000px; margin: 40px auto; padding: 20px; background: #f8faf8; }
        .upload-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 25px; border-radius: 25px; margin-bottom: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .header-title h2 { margin: 0; color: #155724; font-weight: 600; }
        .header-title p { margin: 5px 0 0; color: #666; }
        .back-btn { background: white; border: 1px solid #155724; padding: 8px 20px; border-radius: 20px; cursor: pointer; color: #155724; transition: 0.3s; }
        .back-btn:hover { background: #155724; color: white; }
        .company-mini-card { display: flex; align-items: center; gap: 10px; background: #e8f5e9; padding: 8px 15px; border-radius: 30px; font-size: 0.9rem; }
        .company-info-card { background: linear-gradient(135deg, #155724 0%, #1e7e34 100%); color: white; padding: 25px; border-radius: 25px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .company-info-content { display: flex; align-items: center; gap: 20px; }
        .company-logo { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
        .upload-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .item-card { background: #f9fbf9; padding: 20px; border-radius: 20px; margin-bottom: 20px; border: 1px solid #e0eee2; }
        .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .item-header h5 { margin: 0; color: #155724; }
        .item-points { font-size: 0.8rem; background: #ffd70020; padding: 3px 8px; border-radius: 12px; color: #856404; margin-left: 10px; }
        .remove-btn { background: none; border: none; color: #dc3545; font-size: 18px; cursor: pointer; }
        .custom-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #cde3cf; margin-bottom: 10px; }
        .custom-input:focus { outline: none; border-color: #155724; }
        .add-btn { width: 100%; padding: 12px; border-radius: 15px; border: 2px dashed #155724; background: transparent; color: #155724; margin: 15px 0; cursor: pointer; }
        .total-summary { background: #f0f9f0; padding: 20px; border-radius: 15px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .points-highlight { color: #155724; font-size: 1.2rem; }
        .submit-btn { width: 100%; padding: 15px; border: none; border-radius: 20px; background: linear-gradient(135deg, #155724, #1e7e34); color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(21, 87, 36, 0.3); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-box { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #f5c6cb; }
        .loading-contract { text-align: center; padding: 60px; background: white; border-radius: 30px; }
        .no-contract-warning { text-align: center; padding: 40px; background: #fff3cd; border-radius: 20px; border: 1px solid #ffeeba; }
        .warning-icon { font-size: 3rem; display: block; margin-bottom: 15px; }
        .back-btn-large { background: #155724; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 1rem; cursor: pointer; margin-top: 15px; }
        .back-btn-large:hover { background: #1e7e34; }
        .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; margin-right: 10px; }
        .spinner-inline { animation: spin 1s linear infinite; display: inline-block; }
        
        /* Success Popup Styles */
        .success-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        .success-popup {
          background: linear-gradient(135deg, #155724 0%, #1e7e34 100%);
          padding: 50px 40px;
          border-radius: 50px;
          text-align: center;
          min-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease;
        }
        
        .success-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: bounce 0.5s ease;
        }
        
        .success-title {
          color: white;
          font-size: 36px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .success-details {
          color: white;
          margin: 20px 0;
        }
        
        .points-earned {
          font-size: 20px;
          margin: 10px 0;
        }
        
        .points-amount {
          font-size: 64px;
          font-weight: bold;
          margin: 10px 0;
          color: #FFD700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .points-star {
          font-size: 30px;
          margin: 15px 0;
        }
        
        .success-close-btn {
          background: white;
          color: #155724;
          border: none;
          padding: 12px 40px;
          border-radius: 40px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
          transition: transform 0.2s ease;
        }
        
        .success-close-btn:hover {
          transform: scale(1.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UploadMaterial;