import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  FaMapMarkerAlt, 
  FaFileAlt, 
  FaTag, 
  FaPaperclip, 
  FaUpload, 
  FaStar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaRegFileImage,
  FaFilePdf,
  FaFileWord,
  FaRegFile
} from "react-icons/fa";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function ReportForm({ goToHome }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    latitude: "",
    longitude: "",
    address: "",
    attachmentUrls: [],
  });

  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attachments, setAttachments] = useState([]);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const categories = [
    "Water Issues",
    "Electricity Issues",
    "Garbage & Waste",
    "Air Issues",
  ];

  const getLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setFormData((prev) => ({
          ...prev,
          address: data.display_name,
          latitude: lat,
          longitude: lon,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          address: `Latitude: ${lat}, Longitude: ${lon}`,
          latitude: lat,
          longitude: lon,
        }));
      }
    } catch (error) {
      console.error("Error getting location name:", error);
      setFormData((prev) => ({
        ...prev,
        address: `Latitude: ${lat}, Longitude: ${lon}`,
        latitude: lat,
        longitude: lon,
      }));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          getLocationName(lat, lon);
        },
        (err) => {
          setError("Couldn't access location. Please enable GPS.");
          console.error(err);
        }
      );
    } else {
      setError("Your browser does not support location access.");
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("You can upload maximum 5 files");
      return;
    }

    const newAttachments = files.map((file) => {
      const objectUrl = URL.createObjectURL(file);
      return {
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        url: objectUrl,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!formData.title || !formData.description || !formData.category) {
    setError("Please fill in all required fields");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("accessToken");
    
    const userId = localStorage.getItem("userId") || localStorage.getItem("UserId");
    
    const reportData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      region: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
      longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
      userId: userId,
    };

    console.log("📤 Sending report with ID:", userId);

    // 1️⃣ Create Report
    const response = await fetch("http://localhost:5233/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Failed to submit report");
    }

    const result = await response.json();
    console.log("✅ Report saved with ID:", result.id);

    // 2️⃣ Trigger Notification Service (GET request)
    try {
      const notifyResponse = await fetch(
        `http://localhost:5233/api/ReportNotification/SendMailToAuthorityWithReportId/${result.id}`,
        {
          method: "GET",  // ✅ GET matches the backend attribute
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (notifyResponse.ok) {
        const notifyResult = await notifyResponse.text();
        console.log("📩 Notification triggered:", notifyResult);
      } else {
        console.warn("⚠️ Notification failed with status:", notifyResponse.status);
      }
    } catch (notifyError) {
      // Don't fail the whole process if notification fails
      console.error("❌ Notification error (non-critical):", notifyError);
    }

    setSuccess("Report submitted successfully! You've earned 50 points! ✅");

    // 3️⃣ Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      latitude: "",
      longitude: "",
      address: "",
      attachmentUrls: [],
    });
    setAttachments([]);

  } catch (err) {
    console.error("❌ Error:", err);
    setError(err.message || "Failed to submit report. Please check your connection.");
  } finally {
    setLoading(false);
  }
};

  // ✅ إعداد الخريطة
  useEffect(() => {
    if (showMap && mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([30.0444, 31.2357], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", function (e) {
        const { lat, lng } = e.latlng;
        getLocationName(lat, lng);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap]);

  useEffect(() => {
    if (mapInstanceRef.current && formData.latitude && formData.longitude) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      const marker = L.marker([formData.latitude, formData.longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup("Report Location")
        .openPopup();

      markerRef.current = marker;
      mapInstanceRef.current.setView([formData.latitude, formData.longitude], 15);
    }
  }, [formData.latitude, formData.longitude]);

  useEffect(() => {
    return () => {
      attachments.forEach((att) => {
        URL.revokeObjectURL(att.url);
      });
    };
  }, [attachments]);

  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      return <FaRegFileImage />;
    } else if (fileName.match(/\.pdf$/i)) {
      return <FaFilePdf />;
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return <FaFileWord />;
    } else {
      return <FaRegFile />;
    }
  };

  return (
    <div className="report-form-container">
      {/* Floating Background Elements */}
      <div className="floating-bg-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-particles"></div>
      </div>

      <div className="report-form-wrapper py-5 px-4 px-md-5 px-xl-6">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="report-card">
              <div className="report-header text-center mb-4">
                <div className="eco-badge d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill mb-4">
                  <span className="badge-icon">
                    <FaMapMarkerAlt />
                  </span>
                  <span className="fw-medium">Environmental Report</span>
                </div>
                <h2 className="report-title fw-bold">
                  Submit a <span className="gradient-text">Report</span>
                </h2>
                <p className="report-description">
                  Help us protect the environment by reporting any issues you notice in your area.
                  Every report earns you <strong>50 points</strong>!
                </p>
              </div>

              {error && (
                <div className="alert-custom alert-error" role="alert">
                  <span className="alert-icon"><FaExclamationTriangle /></span>
                  <span>{error}</span>
                  <button type="button" className="alert-close" onClick={() => setError("")}>×</button>
                </div>
              )}

              {success && (
                <div className="alert-custom alert-success" role="alert">
                  <span className="alert-icon"><FaCheckCircle /></span>
                  <span>{success}</span>
                  <button type="button" className="alert-close" onClick={() => setSuccess("")}>×</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="report-form">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon"><FaFileAlt /></span>
                    Report Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g., Illegal waste dumping in Al-Mataria"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon"><FaTag /></span>
                    Category <span className="required-star">*</span>
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon"><FaFileAlt /></span>
                    Description <span className="required-star">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    rows="4"
                    placeholder="Please provide detailed description of the issue..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon"><FaMapMarkerAlt /></span>
                    Location <span className="required-star">*</span>
                  </label>
                  <div className="location-actions">
                    <button 
                      type="button" 
                      onClick={handleGetLocation} 
                      className="location-btn location-btn-primary"
                    >
                      <span className="btn-icon"><FaMapMarkerAlt /></span>
                      Get My Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="location-btn location-btn-secondary"
                    >
                      <span className="btn-icon"><FaMapMarkerAlt /></span>
                      {showMap ? "Hide Map" : "Select from Map"}
                    </button>
                  </div>

                  <div className="location-preview">
                    <input
                      type="text"
                      className="location-input"
                      placeholder="Address will appear here"
                      value={formData.address}
                      readOnly
                    />
                  </div>

                  <div className="coordinates-grid">
                    <div className="coordinate-item">
                      <label className="coordinate-label">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        className="coordinate-input"
                        placeholder="Latitude"
                        value={formData.latitude}
                        readOnly
                      />
                    </div>
                    <div className="coordinate-item">
                      <label className="coordinate-label">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        className="coordinate-input"
                        placeholder="Longitude"
                        value={formData.longitude}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {showMap && (
                  <div className="map-section">
                    <div className="map-info">
                      <span className="info-icon"><FaInfoCircle /></span>
                      <small>Click on the map to select the exact location</small>
                    </div>
                    <div 
                      ref={mapContainerRef} 
                      className="map-container"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon"><FaPaperclip /></span>
                    Attachments (Optional - Max 5 files)
                  </label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      className="file-input"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <span className="upload-icon"><FaUpload /></span>
                      <span>Click to upload or drag and drop</span>
                      <span className="upload-hint">Images, videos, PDF, DOC (Max 5 files)</span>
                    </label>
                  </div>

                  {attachments.length > 0 && (
                    <div className="attachments-list">
                      <h6 className="attachments-title">Selected Files:</h6>
                      <div className="attachments-grid">
                        {attachments.map((att, index) => (
                          <div key={index} className="attachment-item">
                            <div className="attachment-icon">
                              {getFileIcon(att.name)}
                            </div>
                            <div className="attachment-info">
                              <div className="attachment-name">{att.name}</div>
                              <div className="attachment-size">
                                {(att.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              type="button"
                              className="attachment-remove"
                              onClick={() => handleRemoveAttachment(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span>Submit Report</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                  {goToHome && (
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={goToHome}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Points Info */}
                <div className="points-info">
                  <div className="points-icon"><FaStar /></div>
                  <div className="points-text">
                    <strong>Earn 50 points</strong> for every report you submit!
                    <br />
                    <small>Reports with photos earn double points (100 points)</small>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ====== Base Styles ====== */
        .report-form-container {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* ====== Floating Background Elements ====== */
        .floating-bg-elements {
          position: fixed;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          animation: floatOrb 20s infinite alternate;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -200px;
          animation-duration: 25s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: rgba(76, 175, 80, 0.1);
          bottom: -150px;
          left: -150px;
          animation-duration: 30s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: rgba(27, 94, 32, 0.12);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(150px);
          animation: pulseOrb 15s ease-in-out infinite;
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle, rgba(76, 175, 80, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: particleFloat 40s linear infinite;
        }

        /* ====== Main Wrapper ====== */
        .report-form-wrapper {
          position: relative;
          z-index: 10;
        }

        .report-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 48px;
          padding: 50px 40px;
          box-shadow: 0 30px 60px rgba(0, 40, 0, 0.15);
          border: 1px solid rgba(46, 125, 50, 0.1);
          transition: all 0.4s ease;
        }

        .report-card:hover {
          box-shadow: 0 40px 80px rgba(46, 125, 50, 0.2);
        }

        /* ====== Header ====== */
        .report-header {
          animation: fadeInUp 1s ease-out;
        }

        .eco-badge {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(46, 125, 50, 0.2);
          backdrop-filter: blur(10px);
          color: #1b5e20;
          box-shadow: 0 4px 20px rgba(46, 125, 50, 0.1);
          font-weight: 500;
        }

        .badge-icon {
          font-size: 1.4rem;
          display: flex;
          align-items: center;
        }

        .report-title {
          color: #1a2e1a;
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1b5e20, #2e7d32, #388e3c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        .report-description {
          color: #2c4a3e;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* ====== Alerts ====== */
        .alert-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 20px;
          margin-bottom: 30px;
          animation: slideIn 0.3s ease;
        }

        .alert-error {
          background: rgba(255, 235, 235, 0.9);
          border: 1px solid rgba(255, 99, 99, 0.3);
          color: #d32f2f;
        }

        .alert-success {
          background: rgba(235, 255, 235, 0.9);
          border: 1px solid rgba(46, 125, 50, 0.3);
          color: #1b5e20;
        }

        .alert-icon {
          font-size: 1.4rem;
          display: flex;
          align-items: center;
        }

        .alert-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          color: inherit;
          opacity: 0.5;
          transition: opacity 0.3s ease;
          margin-left: auto;
        }

        .alert-close:hover {
          opacity: 1;
        }

        /* ====== Form ====== */
        .report-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-group {
          animation: fadeInUp 0.5s ease-out;
          animation-fill-mode: both;
        }

        .form-group:nth-child(1) { animation-delay: 0.1s; }
        .form-group:nth-child(2) { animation-delay: 0.2s; }
        .form-group:nth-child(3) { animation-delay: 0.3s; }
        .form-group:nth-child(4) { animation-delay: 0.4s; }
        .form-group:nth-child(5) { animation-delay: 0.5s; }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: #1b5e20;
          font-weight: 600;
          font-size: 1rem;
        }

        .label-icon {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }

        .required-star {
          color: #d32f2f;
          margin-left: 4px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid rgba(46, 125, 50, 0.1);
          border-radius: 24px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:hover,
        .form-select:hover,
        .form-textarea:hover {
          border-color: rgba(46, 125, 50, 0.3);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1b5e20;
          box-shadow: 0 0 0 4px rgba(27, 94, 32, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        /* ====== Location Section ====== */
        .location-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .location-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .location-btn-primary {
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          color: white;
          box-shadow: 0 5px 15px rgba(27, 94, 32, 0.3);
        }

        .location-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(27, 94, 32, 0.4);
        }

        .location-btn-secondary {
          background: white;
          color: #1b5e20;
          border: 2px solid rgba(46, 125, 50, 0.2);
        }

        .location-btn-secondary:hover {
          background: rgba(46, 125, 50, 0.05);
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
        }

        .location-preview {
          margin-bottom: 15px;
        }

        .location-input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid rgba(46, 125, 50, 0.1);
          border-radius: 24px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.8);
          cursor: default;
        }

        .coordinates-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .coordinate-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .coordinate-label {
          font-size: 0.9rem;
          color: #2c4a3e;
          font-weight: 500;
        }

        .coordinate-input {
          padding: 12px 15px;
          border: 2px solid rgba(46, 125, 50, 0.1);
          border-radius: 20px;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.8);
          cursor: default;
        }

        /* ====== Map Section ====== */
        .map-section {
          animation: slideUp 0.5s ease;
        }

        .map-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          background: rgba(27, 94, 32, 0.05);
          border-radius: 50px;
          margin-bottom: 15px;
          color: #1b5e20;
          font-size: 0.95rem;
        }

        .info-icon {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .map-container {
          height: 400px;
          width: 100%;
          border-radius: 28px;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        /* ====== File Upload ====== */
        .file-upload-area {
          position: relative;
        }

        .file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }

        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.8);
          border: 2px dashed rgba(46, 125, 50, 0.3);
          border-radius: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload-label:hover {
          border-color: #1b5e20;
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
        }

        .upload-icon {
          font-size: 2.5rem;
          display: flex;
          align-items: center;
        }

        .upload-hint {
          font-size: 0.85rem;
          color: #2c4a3e;
          opacity: 0.7;
        }

        /* ====== Attachments List ====== */
        .attachments-list {
          margin-top: 20px;
          animation: slideUp 0.3s ease;
        }

        .attachments-title {
          color: #1b5e20;
          margin-bottom: 15px;
          font-size: 1rem;
        }

        .attachments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
        }

        .attachment-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          background: white;
          border-radius: 18px;
          border: 1px solid rgba(46, 125, 50, 0.1);
          transition: all 0.3s ease;
        }

        .attachment-item:hover {
          transform: translateX(5px);
          border-color: rgba(46, 125, 50, 0.3);
        }

        .attachment-icon {
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          color: #1b5e20;
        }

        .attachment-info {
          flex: 1;
          min-width: 0;
        }

        .attachment-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1a2e1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .attachment-size {
          font-size: 0.8rem;
          color: #2c4a3e;
          opacity: 0.7;
        }

        .attachment-remove {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 99, 99, 0.1);
          color: #d32f2f;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .attachment-remove:hover {
          background: #d32f2f;
          color: white;
          transform: scale(1.1);
        }

        /* ====== Form Actions ====== */
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 10px;
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

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px) translateX(5px);
          box-shadow: 0 15px 35px rgba(27, 94, 32, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(5px);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .cancel-btn {
          padding: 16px 30px;
          background: white;
          border: 2px solid rgba(46, 125, 50, 0.2);
          border-radius: 50px;
          color: #1b5e20;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: rgba(46, 125, 50, 0.05);
          transform: translateY(-3px);
        }

        /* ====== Points Info ====== */
        .points-info {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(27, 94, 32, 0.05), rgba(46, 125, 50, 0.1));
          border-radius: 28px;
          margin-top: 30px;
          border: 1px solid rgba(46, 125, 50, 0.1);
        }

        .points-icon {
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          color: #FFD700;
          animation: starPulse 2s ease-in-out infinite;
        }

        .points-text {
          color: #1b5e20;
          font-size: 1rem;
          line-height: 1.5;
        }

        .points-text strong {
          font-size: 1.1rem;
        }

        .points-text small {
          opacity: 0.8;
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes starPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,215,0,0.5)); }
          50% { transform: scale(1.2); filter: drop-shadow(0 0 20px rgba(255,215,0,0.8)); }
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
        }

        @media (max-width: 768px) {
          .report-card {
            padding: 30px 20px;
            border-radius: 32px;
          }

          .report-title {
            font-size: 2rem;
          }

          .report-description {
            font-size: 1rem;
          }

          .location-actions {
            flex-direction: column;
          }

          .location-btn {
            width: 100%;
            justify-content: center;
          }

          .coordinates-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-btn, .cancel-btn {
            width: 100%;
            justify-content: center;
          }

          .px-xl-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .attachments-grid {
            grid-template-columns: 1fr;
          }

          .points-info {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}