import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaStar, FaSpinner, FaExclamationTriangle, FaCamera, FaRecycle, FaLightbulb } from "react-icons/fa";
import { MdReport } from "react-icons/md";

const API_BASE = "http://localhost:5233/api";

const RewardPoints = ({ userId, refreshTrigger, widget = false }) => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserPoints();
    }
  }, [userId, refreshTrigger]);

  const fetchUserPoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');

      console.log("🔍 Fetching points for user:", userId);

      const response = await axios.get(`${API_BASE}/UserPoints/userPoints?userid=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Points response:", response.data);
      setPoints(response.data || 0);

    } catch (err) {
      console.error('❌ Error fetching points:', err);
      if (err.response?.status === 404) {
        setPoints(0);
        setError(null);
      } else {
        setError('Failed to load points. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (widget) {
    return (
      <div className="widget-points">
        {loading ? (
          <span className="widget-loading"><FaSpinner className="spinning" /></span>
        ) : error ? (
          <span className="widget-error">0</span>
        ) : (
          <span className="widget-value">{points}</span>
        )}
        <style>{`
          .widget-points { display: inline-flex; align-items: center; }
          .widget-value { font-weight: 700; font-size: 1.2rem; color: #FFD700; }
          .widget-loading { display: inline-flex; align-items: center; }
          .spinning { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="rewards-main-card">
      <div className="rewards-bg-animation"></div>
      <div className="rewards-particles"></div>

      <div className="rewards-content">
        <div className="rewards-header">
          <div className="rewards-title-wrapper">
            <h5 className="rewards-title">
              <span className="title-icon"><FaStar /></span>
              Reward Points
            </h5>
            <p className="rewards-subtitle">Collect points and exchange for rewards</p>
          </div>
          <div className="rewards-main-icon">
            <span className="floating-star"><FaStar /></span>
          </div>
        </div>

        {loading ? (
          <div className="rewards-loading">
            <div className="custom-spinner"><FaSpinner /></div>
            <p className="loading-text">Loading your points...</p>
          </div>
        ) : error ? (
          <div className="rewards-error">
            <span className="error-icon"><FaExclamationTriangle /></span>
            <span className="error-text">{error}</span>
            <button onClick={fetchUserPoints} className="error-retry">Try Again</button>
          </div>
        ) : (
          <div className="points-display">
            <div className="points-number">{points}</div>
            <div className="points-label">points</div>
            <div className="points-bars">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="points-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-icon"><MdReport /></span>
            <div className="stat-info">
              <span className="stat-value">50</span>
              <span className="stat-label">per report</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon"><FaCamera /></span>
            <div className="stat-info">
              <span className="stat-value">Points based on detected material</span>
              <span className="stat-label">with photos</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon"><FaRecycle /></span>
            <div className="stat-info">
              <span className="stat-value">Points based on material quantity</span>
              <span className="stat-label">per recycle</span>
            </div>
          </div>
        </div>

        <div className="tip-box">
          <span className="tip-icon"><FaLightbulb /></span>
          <div className="tip-content">
            <strong>Pro Tip:</strong> Every successful report gives you points! Upload photos for double points.
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-title">Next Reward</span>
            <span className="progress-target">500 points</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${Math.min((points / 500) * 100, 100)}%` }}></div>
          </div>
          <span className="progress-remaining">{Math.max(500 - points, 0)} points to go</span>
        </div>
      </div>

      <style>{`
        .rewards-main-card {
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%);
          border-radius: 48px; padding: 40px; position: relative;
          overflow: hidden; box-shadow: 0 30px 60px rgba(27, 94, 32, 0.4);
          animation: fadeInUp 0.8s ease-out;
        }
        .rewards-bg-animation {
          position: absolute; top: -50%; right: -50%; width: 100%; height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
          animation: rotate 30s linear infinite;
        }
        .rewards-particles {
          position: absolute; width: 100%; height: 100%;
          background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
          background-size: 30px 30px; animation: particleDrift 20s linear infinite;
        }
        .rewards-content { position: relative; z-index: 2; }
        .rewards-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .rewards-title { color: white; font-size: 1.8rem; font-weight: 700; margin: 0 0 5px 0; text-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px; }
        .title-icon { font-size: 2rem; display: flex; align-items: center; color: #FFD700; }
        .rewards-subtitle { color: rgba(255,255,255,0.9); font-size: 1rem; margin: 0; }
        .rewards-main-icon { font-size: 4rem; color: #FFD700; }
        .floating-star { animation: starPulse 2s ease-in-out infinite; display: inline-block; }
        .rewards-loading { text-align: center; padding: 30px; }
        .custom-spinner { width: 50px; height: 50px; margin: 0 auto 15px; color: white; font-size: 2.5rem; animation: spin 1s linear infinite; }
        .loading-text { color: white; font-size: 1rem; opacity: 0.9; }
        .rewards-error { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 24px; padding: 20px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
        .error-icon { font-size: 1.5rem; color: #FFD700; display: flex; align-items: center; }
        .error-text { color: white; flex: 1; }
        .error-retry { padding: 8px 20px; background: white; border: none; border-radius: 50px; color: #1b5e20; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .error-retry:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .points-display { text-align: center; padding: 20px 0; position: relative; }
        .points-number { font-size: 6rem; font-weight: 800; color: white; line-height: 1; text-shadow: 0 5px 20px rgba(0,0,0,0.3); animation: fadeInScale 0.5s ease-out; }
        .points-label { color: rgba(255,255,255,0.8); font-size: 1.2rem; margin-bottom: 20px; }
        .points-bars { display: flex; justify-content: center; gap: 5px; margin-top: 20px; }
        .points-bar { width: 40px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 3px; animation: barPulse 1s ease-in-out infinite; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 30px 0; }
        .stat-item { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 24px; padding: 15px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; }
        .stat-item:hover { transform: translateY(-3px); background: rgba(255,255,255,0.15); }
        .stat-icon { font-size: 2rem; color: #FFD700; display: flex; align-items: center; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-value { color: white; font-size: 1.3rem; font-weight: 700; }
        .stat-label { color: rgba(255,255,255,0.7); font-size: 0.8rem; }
        .tip-box { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 24px; padding: 20px; display: flex; align-items: flex-start; gap: 15px; margin: 30px 0; border: 1px solid rgba(255,255,255,0.2); }
        .tip-icon { font-size: 1.8rem; color: #FFD700; display: flex; align-items: center; }
        .tip-content { color: white; font-size: 0.95rem; line-height: 1.5; flex: 1; }
        .tip-content strong { color: #FFD700; }
        .progress-section { background: rgba(0,0,0,0.2); border-radius: 24px; padding: 20px; }
        .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .progress-title { color: white; font-size: 0.95rem; opacity: 0.9; }
        .progress-target { color: #FFD700; font-weight: 700; }
        .progress-bar-container { width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #FFD700, #FFA500); border-radius: 4px; transition: width 0.5s ease; position: relative; overflow: hidden; }
        .progress-bar-fill::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shimmer 2s infinite; }
        .progress-remaining { color: rgba(255,255,255,0.7); font-size: 0.85rem; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes particleDrift { 0% { background-position: 0 0; } 100% { background-position: 200px 200px; } }
        @keyframes starPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,215,0,0.5)); } 50% { transform: scale(1.2); filter: drop-shadow(0 0 20px rgba(255,215,0,0.8)); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes barPulse { 0%, 100% { opacity: 0.3; transform: scaleY(1); } 50% { opacity: 0.6; transform: scaleY(2); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @media (max-width: 768px) {
          .rewards-main-card { padding: 30px; }
          .points-number { font-size: 4rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .rewards-header { flex-direction: column; gap: 20px; }
        }
      `}</style>
    </div>
  );
};

export default RewardPoints;