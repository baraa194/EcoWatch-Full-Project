import React, { useState, useRef, useEffect } from "react";

export default function UploadImage({ goToHome, userId, contractId = 1, onUploadSuccess }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [description, setDescription] = useState("");
  const [detectedMaterials, setDetectedMaterials] = useState([]); 
  const [analyzing, setAnalyzing] = useState(false);
  const [realContractId, setRealContractId] = useState(null);
  const [loadingContract, setLoadingContract] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserContract = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:5233/api/Contract/my-contracts", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const contracts = data.$values || data;
          
          if (contracts && contracts.length > 0) {
            const firstContractId = contracts[0].id;
            setRealContractId(firstContractId);
          } else {
            setRealContractId(null);
          }
        } else {
          setRealContractId(null);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setRealContractId(null);
      } finally {
        setLoadingContract(false);
      }
    };

    fetchUserContract();
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setUploaded(false);
    setDetectedMaterials([]); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5233/api/Detection/detectionResult", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const materials = await response.json();
      setDetectedMaterials(Array.isArray(materials) ? materials : (materials.$values || []));
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmitToAdmin = async () => {
    if (detectedMaterials.length === 0) return;
    
    const finalContractId = realContractId || contractId;
    
    if (!finalContractId) {
      alert("No contract found. Please contact support.");
      return;
    }
    
    setUploading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const formattedItems = detectedMaterials.map(mat => ({
        materialType: mat.materialType.charAt(0).toUpperCase() + mat.materialType.slice(1), 
        weightKG: parseFloat(mat.weightKG) 
      }));

      const requestBody = {
        contractId: Number(finalContractId),
        totalWeight: Math.round(detectedMaterials.reduce((sum, mat) => sum + parseFloat(mat.weightKG), 0)), 
        createdat: new Date().toISOString(),
        items: formattedItems
      };

      const response = await fetch("http://localhost:5233/api/RecyclingTransaction/add", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error("Failed to submit transaction to admin");
      }

      setUploaded(true);
      
      if (onUploadSuccess) onUploadSuccess();

    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Something went wrong, please check console.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploaded(false);
    setDescription("");
    setDetectedMaterials([]);
  };

  return (
    <div className="upload-page">
      {/* Background Decorative Elements */}
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="leaf leaf-1">🌿</div>
        <div className="leaf leaf-2">🍃</div>
        <div className="leaf leaf-3">♻️</div>
      </div>

      <div className="upload-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
            <span className="logo-text">Eco<span>Recycle</span></span>
          </div>
        </div>

        {/* Header */}
        <div className="upload-header">

          <h1 className="upload-title">
            Upload & <span className="gradient-text">Analyze</span>
          </h1>
          <p className="upload-subtitle">
            Let AI identify recyclable materials from your images
          </p>
        </div>

        {!uploaded ? (
          <div className="upload-content">
            {/* Hero Image / Illustration */}
            <div className="hero-illustration">
              <div className="illustration-inner">
                <span className="floating-emoji emoji-1">📸</span>
                <span className="floating-emoji emoji-2">♻️</span>
                <span className="floating-emoji emoji-3">🌍</span>
                <span className="floating-emoji emoji-4">💚</span>
                <div className="illustration-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="M7.5 10.5l3 2 6-5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`drop-zone ${dragOver ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {selectedFile ? (
                <div className="preview-wrapper">
                  <img src={preview} alt="preview" className="preview-img" />
                  <div className="preview-overlay">
                    <button
                      className="change-btn"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6" />
                        <path d="M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                      </svg>
                      Change Photo
                    </button>
                  </div>
                  <div className="file-info">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              ) : (
                <div className="drop-content">
                  <div className="drop-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3>Drop your image here</h3>
                  <p>or click to browse</p>
                  <div className="format-badges">
                    <span>PNG</span>
                    <span>JPG</span>
                    <span>WEBP</span>
                    <span>Up to 10MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Analysis */}
            {selectedFile && detectedMaterials.length === 0 && (
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Additional Notes
                  </label>
                  <textarea
                    className="desc-input"
                    placeholder="Add any relevant information about this recycling batch..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <button
                  className={`analyze-btn ${analyzing ? "loading" : ""}`}
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <span className="loading-text">
                      <span className="spinner"></span>
                      Analyzing with AI...
                    </span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" y1="22" x2="12" y2="12" />
                      </svg>
                      Analyze Materials
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results */}
            {detectedMaterials.length > 0 && (
              <div className="results-section">
                <div className="results-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
                  </svg>
                  <span>AI Analysis Results</span>
                </div>
                <div className="materials-grid">
                  {detectedMaterials.map((mat, index) => (
                    <div key={index} className="material-card">
                      <div className="material-icon">
                        {mat.materialType === 'plastic' && '♻️'}
                        {mat.materialType === 'glass' && '🥤'}
                        {mat.materialType === 'paper' && '📄'}
                        {mat.materialType === 'metal' && '🔩'}
                        {!['plastic','glass','paper','metal'].includes(mat.materialType) && '📦'}
                      </div>
                      <div className="material-details">
                        <span className="material-name">{mat.materialType}</span>
                        <span className="material-weight">{mat.weightKG} kg</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="total-weight">
                  <span>Total Weight</span>
                  <strong>{detectedMaterials.reduce((sum, mat) => sum + parseFloat(mat.weightKG), 0).toFixed(2)} kg</strong>
                </div>

                <button
                  className={`submit-btn ${uploading ? "loading" : ""}`}
                  onClick={handleSubmitToAdmin}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="loading-text">
                      <span className="spinner"></span>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Submit for Verification
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="success-state">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="success-title">Submission Successful! 🎉</h2>
            <p className="success-subtitle">Your recycling batch is now under review</p>

            <div className="info-card">
              <div className="info-icon">⏳</div>
              <div className="info-content">
                <h4>Pending Admin Approval</h4>
                <p>Your transaction has been registered. Credits will be awarded after verification.</p>
              </div>
            </div>

            <div className="success-actions">
              <button className="secondary-btn" onClick={handleReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6" />
                  <path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                </svg>
                Upload Another
              </button>
              <button className="primary-btn" onClick={goToHome}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-8H7v8H5a2 2 0 0 1-2-2z" />
                </svg>
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .upload-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8f3e8 0%, #d4e6d4 50%, #c2dbc2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Inter', -apple-system, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Background Decoration */
        .bg-decoration {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(69, 128, 69, 0.08) 0%, rgba(69, 128, 69, 0.02) 100%);
          animation: float 20s infinite ease-in-out;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: 50px;
          left: -80px;
          animation-delay: 3s;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: 20%;
          animation-delay: 6s;
        }

        .circle-4 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          right: -100px;
          animation-delay: 2s;
        }

        .leaf {
          position: absolute;
          font-size: 24px;
          opacity: 0.15;
          animation: float 15s infinite ease-in-out;
        }

        .leaf-1 { top: 20%; left: 10%; animation-delay: 0s; font-size: 32px; }
        .leaf-2 { bottom: 15%; right: 8%; animation-delay: 4s; font-size: 28px; }
        .leaf-3 { top: 60%; left: 5%; animation-delay: 7s; font-size: 24px; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .upload-container {
          width: 100%;
          max-width: 700px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
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

        /* Logo Section */
        .logo-section {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 60px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid rgba(69, 128, 69, 0.2);
        }

        .logo-icon {
          background: linear-gradient(135deg, #2d6e3f 0%, #1a4d2a 100%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a2e1a;
        }

        .logo-text span {
          color: #2d6e3f;
        }

        /* Header */
        .upload-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(69, 128, 69, 0.2);
          color: #2d5a2d;
          padding: 8px 20px;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: white;
          transform: translateX(-4px);
          border-color: #2d6e3f;
        }

        .upload-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a2e1a;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(135deg, #2d6e3f 0%, #1a4d2a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .upload-subtitle {
          color: #4a6e4a;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }

        /* Hero Illustration */
        .hero-illustration {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .illustration-inner {
          position: relative;
          background: linear-gradient(135deg, rgba(69, 128, 69, 0.1) 0%, rgba(69, 128, 69, 0.05) 100%);
          border-radius: 50%;
          padding: 30px;
        }

        .illustration-icon {
          color: #2d6e3f;
        }

        .floating-emoji {
          position: absolute;
          font-size: 28px;
          animation: floatEmoji 4s ease-in-out infinite;
        }

        .emoji-1 { top: -15px; right: -10px; animation-delay: 0s; }
        .emoji-2 { bottom: -15px; left: -10px; animation-delay: 1s; }
        .emoji-3 { top: -10px; left: -20px; animation-delay: 2s; }
        .emoji-4 { bottom: -10px; right: -15px; animation-delay: 3s; }

        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }

        /* Drop Zone */
        .drop-zone {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(5px);
          border: 2px dashed #a8c8a8;
          border-radius: 32px;
          padding: 40px 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
        }

        .drop-zone:hover, .drop-zone.drag-active {
          border-color: #2d6e3f;
          background: white;
          transform: scale(1.01);
          box-shadow: 0 12px 32px rgba(45, 110, 63, 0.15);
        }

        .drop-icon {
          color: #6a9e6a;
          margin-bottom: 16px;
          transition: transform 0.3s ease;
        }

        .drop-zone:hover .drop-icon {
          transform: translateY(-4px);
        }

        .drop-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a2e1a;
          margin: 0 0 8px;
        }

        .drop-content p {
          color: #7a9a7a;
          font-size: 0.9rem;
          margin: 0 0 16px;
        }

        .format-badges {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .format-badges span {
          background: #e8f0e8;
          color: #4a6e4a;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        /* Preview */
        .preview-wrapper {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
        }

        .preview-img {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-wrapper:hover .preview-overlay {
          opacity: 1;
        }

        .change-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: none;
          color: #1a2e1a;
          padding: 10px 24px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .change-btn:hover {
          transform: scale(1.05);
          background: #f0f4ee;
        }

        .file-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #f9fbf8;
          border-top: 1px solid #e0e8e0;
        }

        .file-name {
          color: #2d6e3f;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .file-size {
          color: #8aa88a;
          font-size: 0.75rem;
        }

        /* Form */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #2a4e2a;
          margin-bottom: 10px;
          font-size: 0.85rem;
        }

        .desc-input {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #d4e0d4;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #1a2e1a;
          resize: vertical;
          transition: all 0.2s ease;
          background: white;
        }

        .desc-input:focus {
          outline: none;
          border-color: #2d6e3f;
          box-shadow: 0 0 0 3px rgba(45, 110, 63, 0.1);
        }

        .analyze-btn, .submit-btn {
          background: linear-gradient(135deg, #2d6e3f 0%, #1a4d2a 100%);
          border: none;
          color: white;
          padding: 14px 28px;
          border-radius: 40px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .analyze-btn:hover:not(:disabled), .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(29, 78, 45, 0.35);
        }

        .analyze-btn:disabled, .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Results */
        .results-section {
          background: white;
          border-radius: 28px;
          padding: 24px;
          animation: slideIn 0.5s ease-out;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .results-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e0ece0;
          font-weight: 600;
          color: #2d6e3f;
        }

        .materials-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .material-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: #f9fbf8;
          border-radius: 18px;
          transition: all 0.2s ease;
        }

        .material-card:hover {
          background: #f0f8ec;
          transform: translateX(4px);
        }

        .material-icon {
          font-size: 28px;
        }

        .material-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .material-name {
          font-weight: 600;
          color: #2a4e2a;
          text-transform: capitalize;
        }

        .material-weight {
          color: #2d6e3f;
          font-weight: 700;
          font-size: 1rem;
        }

        .total-weight {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-top: 2px solid #e0ece0;
          margin-bottom: 20px;
          font-weight: 500;
          color: #2a4e2a;
        }

        .total-weight strong {
          font-size: 1.3rem;
          color: #2d6e3f;
        }

        /* Success State */
        .success-state {
          background: white;
          border-radius: 32px;
          padding: 48px 40px;
          text-align: center;
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2d6e3f 0%, #1a4d2a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .success-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a2e1a;
          margin: 0 0 8px;
        }

        .success-subtitle {
          color: #7a9a7a;
          font-size: 0.95rem;
          margin: 0 0 32px;
        }

        .info-card {
          display: flex;
          gap: 16px;
          background: #f9fbf8;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 32px;
          text-align: left;
          border: 1px solid #e0ece0;
        }

        .info-icon {
          font-size: 32px;
        }

        .info-content h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #2d6e3f;
          margin-bottom: 6px;
        }

        .info-content p {
          font-size: 0.85rem;
          color: #6a8e6a;
          line-height: 1.5;
          margin: 0;
        }

        .success-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .secondary-btn, .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .secondary-btn {
          background: transparent;
          border: 1.5px solid #c8dcc8;
          color: #2d5a2d;
        }

        .secondary-btn:hover {
          background: #f0f6ec;
          border-color: #a8c8a8;
          transform: translateY(-2px);
        }

        .primary-btn {
          background: linear-gradient(135deg, #2d6e3f 0%, #1a4d2a 100%);
          border: none;
          color: white;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(45, 110, 63, 0.3);
        }

        /* Loading */
        .loading-text {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 600px) {
          .upload-title { font-size: 1.8rem; }
          .success-state { padding: 32px 24px; }
          .success-actions { flex-direction: column; }
          .drop-zone { padding: 32px 20px; }
          .logo-text { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}