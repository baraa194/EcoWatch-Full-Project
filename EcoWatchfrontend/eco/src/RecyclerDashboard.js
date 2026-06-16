import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RecyclerDashboard({ 
  goToLogin, 
  goToRecycling,
  uploadImage,    
  goToCompanies,
  goToRewardPoints,
  userId 
}) {
  
  const displayName = localStorage.getItem("currentUserName") || "Recycler";

  const stats = {
    activeRequests: 24,
    materialsCollected: 1280,
    totalEarnings: 3240,
    co2Saved: 875,
    treesEquivalent: 42,
    weeklyIncrease: 12,
    monthlyIncrease: 8,
    earningsIncrease: 15
  };

  return (
    <div className="recycler-dashboard-page min-vh-100">

      {/* Main Content with Side Margins */}
      <div className="main-content py-5 px-4 px-md-5 px-xl-6 position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Hero Section */}
            <div className="hero-section text-center mb-5">
              
              <h1 className="hero-title display-4 fw-bold mb-3 d-inline-flex align-items-center justify-content-center gap-2 flex-wrap">
                <span>Welcome Back,</span>
                <span className="gradient-text">{displayName}</span>
              </h1>
              
              <p className="hero-description lead mx-auto">
                "Every piece of waste you recycle is a breath of life for our planet. 
                You're not just collecting materials, you're collecting hope for a greener tomorrow."
              </p>
            </div>
            
            {/* Services Grid - 4 Cards */}
            <div className="services-grid row g-4 mb-5">
              {/* Upload Image Card */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon upload-icon">
                        📸
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Upload Image</h5>
                    <p className="card-description mb-4">
                      Share photos of your recycling achievements and earn bonus points
                    </p>
                    <button
                      onClick={uploadImage}
                      className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <span>Upload Now</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Create Contract Card */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon contract-icon">
                        📄
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Create Contract</h5>
                    <p className="card-description mb-4">
                      Partner with recycling companies and create new contracts
                    </p>
                    <button
                      onClick={goToCompanies}
                      className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <span>Create Now</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recycling Card */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon recycle-icon">
                        ♻️
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Recycle Now</h5>
                    <p className="card-description mb-4">
                      Start recycling materials and earn points for your efforts
                    </p>
                    <button
                      onClick={goToRecycling}
                      className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <span>Recycle</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reward Points Card */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon reward-icon">
                        ⭐
                      </div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Reward Points</h5>
                    <p className="card-description mb-4">
                      Check your points balance, see rewards catalog, and redeem your points
                    </p>
                    <button
                      onClick={goToRewardPoints}
                      className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <span>View Points</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-3">
                <div className="stat-card card border-0">
                  <div className="card-body p-4">
                    <div className="stat-card-icon mb-3">📦</div>
                    <h6 className="stat-card-label">Active Requests</h6>
                    <h3 className="stat-card-value">{stats.activeRequests}</h3>
                    <span className="stat-trend positive">↑ {stats.weeklyIncrease}%</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="stat-card card border-0">
                  <div className="card-body p-4">
                    <div className="stat-card-icon mb-3">♻️</div>
                    <h6 className="stat-card-label">Materials Collected</h6>
                    <h3 className="stat-card-value">{stats.materialsCollected} kg</h3>
                    <span className="stat-trend positive">↑ {stats.monthlyIncrease}%</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="stat-card card border-0">
                  <div className="card-body p-4">
                    <div className="stat-card-icon mb-3">💰</div>
                    <h6 className="stat-card-label">Total Earnings</h6>
                    <h3 className="stat-card-value">${stats.totalEarnings}</h3>
                    <span className="stat-trend positive">↑ {stats.earningsIncrease}%</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="stat-card card border-0 eco-stat">
                  <div className="card-body p-4">
                    <div className="stat-card-icon mb-3">🌱</div>
                    <h6 className="stat-card-label">Environmental Impact</h6>
                    <h3 className="stat-card-value">{stats.co2Saved} kg CO₂</h3>
                    <span className="stat-eco-note">{stats.treesEquivalent} trees</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Info Card */}
            <div className="row mb-5">
              <div className="col-12">
                <div className="rewards-card card border-0">
                  <div className="rewards-bg-animation"></div>
                  <div className="rewards-particles"></div>
                  
                  <div className="row align-items-center position-relative rewards-content">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <span className="rewards-main-icon">⭐</span>
                        <h3 className="rewards-title">
                          Earn Points While You Recycle!
                        </h3>
                      </div>
                      <p className="rewards-description">
                        <strong>Great news!</strong> Every recycling activity earns you points automatically. 
                        The more you recycle, the more points you earn! These points can be redeemed for 
                        amazing rewards, discounts from our partners, and exclusive benefits.
                      </p>
                      <p className="rewards-description mt-3" style={{ fontWeight: '500', background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '20px' }}>
                        ✨ <strong>Points per kg:</strong> Plastic (10 pts) | Paper (5 pts) | Metals (15 pts) | Organics (4 pts)
                        <br/>✨ <strong>Bonus:</strong> Upload photos of your recycling for extra points!
                      </p>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="rewards-star-container">
                        <div className="rewards-star-animation">⭐</div>
                        <div className="rewards-star-glow"></div>
                      </div>
                      <button 
                        onClick={goToRewardPoints}
                        className="rewards-badge-btn"
                      >
                        View Your Points →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           

            {/* Daily Inspiration */}
            <div className="row">
              <div className="col-12">
                <div className="inspiration-card">
                  <span className="inspiration-icon">💡</span>
                  <div className="inspiration-content">
                    <h4>Today's Eco Tip</h4>
                    <p>"Recycling one aluminum can saves enough energy to run a TV for three hours. Small actions, big impact!"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ====== Base Styles ====== */
        .recycler-dashboard-page {
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        /* ====== Main Content ====== */
        .main-content {
          z-index: 10;
        }

        /* ====== Hero Section ====== */
        .hero-section {
          animation: fadeInUp 1s ease-out;
          position: relative;
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
        }

        .hero-title {
          color: #1a2e1a;
          font-size: 3.2rem;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1b5e20, #2e7d32, #388e3c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 3.2rem;
          font-weight: 800;
          text-shadow: 0 10px 30px rgba(46, 125, 50, 0.2);
        }

        .hero-description {
          color: #2c4a3e;
          max-width: 700px;
          font-size: 1.15rem;
          line-height: 1.7;
          opacity: 0.9;
        }

        /* Stats Container */
        .stats-container {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          padding: 20px 30px;
          border-radius: 60px;
          display: inline-flex;
          border: 1px solid rgba(46, 125, 50, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          position: relative;
        }

        .stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(46, 125, 50, 0.3), transparent);
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1b5e20;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #2c4a3e;
          opacity: 0.8;
          font-weight: 500;
        }

        /* ====== Service Cards ====== */
        .service-card {
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 40, 0, 0.08);
          border: 1px solid rgba(46, 125, 50, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .service-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 60px rgba(46, 125, 50, 0.2);
          border-color: rgba(46, 125, 50, 0.3);
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .card-icon-wrapper {
          position: relative;
          width: 90px;
          height: 90px;
          margin-bottom: 20px;
        }

        .card-icon {
          width: 90px;
          height: 90px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          transition: all 0.4s ease;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 1;
        }

        .service-card:hover .icon-glow {
          opacity: 0.5;
        }

        .service-card:hover .card-icon {
          transform: scale(1.1) rotate(8deg);
        }

        .upload-icon {
          background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
        }

        .contract-icon {
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
        }

        .recycle-icon {
          background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
        }

        .reward-icon {
          background: linear-gradient(135deg, #fff9c4 0%, #fff176 100%);
        }

        .card-title {
          color: #1b5e20;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .card-description {
          color: #2c4a3e;
          font-size: 0.95rem;
          line-height: 1.7;
          flex: 1;
          opacity: 0.9;
        }

        .card-btn {
          background: linear-gradient(135deg, #1b5e20, #2e7d32, #388e3c);
          border: none;
          color: white;
          border-radius: 50px;
          padding: 14px 20px;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 8px 20px rgba(27, 94, 32, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .card-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .card-btn:hover::before {
          left: 100%;
        }

        .card-btn:hover {
          transform: translateX(8px);
          box-shadow: 0 12px 30px rgba(27, 94, 32, 0.4);
          color: white;
        }

        .btn-arrow {
          transition: transform 0.3s ease;
        }

        .card-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        /* ====== Stat Cards ====== */
        .stat-card {
          border-radius: 24px;
          background: white;
          box-shadow: 0 15px 30px rgba(0, 40, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(46, 125, 50, 0.1);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(46, 125, 50, 0.15);
        }

        .stat-card.eco-stat {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
        }

        .stat-card-icon {
          font-size: 2rem;
        }

        .stat-card-label {
          color: #2c4a3e;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .stat-card-value {
          color: #1b5e20;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-trend {
          font-size: 0.85rem;
          padding: 4px 8px;
          border-radius: 50px;
          background: rgba(21, 87, 36, 0.1);
          color: #155724;
        }

        .stat-eco-note {
          font-size: 0.85rem;
          color: #2d6a4f;
        }

        /* ====== Rewards Card ====== */
        .rewards-card {
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%);
          border-radius: 40px;
          padding: 50px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(27, 94, 32, 0.4);
        }

        .rewards-bg-animation {
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
          animation: rotate 30s linear infinite;
        }

        .rewards-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: particleDrift 20s linear infinite;
        }

        .rewards-content {
          z-index: 2;
        }

        .rewards-main-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.5));
        }

        .rewards-title {
          color: white;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .rewards-description {
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.7;
          margin: 0;
          font-size: 1.05rem;
        }

        .rewards-star-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 20px;
        }

        .rewards-star-animation {
          font-size: 5rem;
          position: relative;
          z-index: 2;
          animation: starPulse 2s ease-in-out infinite;
        }

        .rewards-star-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          border-radius: 50%;
          animation: glowPulse 2s ease-in-out infinite;
        }

        .rewards-badge-btn {
          display: inline-block;
          background: white;
          border: none;
          padding: 12px 25px;
          border-radius: 50px;
          color: #1b5e20;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .rewards-badge-btn:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          background: #f8f9fa;
        }

        /* ====== Activity List ====== */
        .activity-list {
          background: white;
          border-radius: 32px;
          padding: 20px;
          box-shadow: 0 15px 30px rgba(0, 40, 0, 0.08);
          border: 1px solid rgba(46, 125, 50, 0.1);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid rgba(46, 125, 50, 0.1);
          transition: all 0.3s ease;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item:hover {
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          transform: translateX(10px);
          border-radius: 16px;
        }

        .activity-icon {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          transition: all 0.3s ease;
        }

        .activity-icon.upload-bg {
          background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
        }

        .activity-icon.points-bg {
          background: linear-gradient(135deg, #fff9c4 0%, #fff176 100%);
        }

        .activity-icon.contract-bg {
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
        }

        .activity-icon.recycle-bg {
          background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
        }

        .activity-item:hover .activity-icon {
          transform: rotate(360deg);
        }

        .activity-details {
          flex: 1;
        }

        .activity-details h4 {
          color: #1b5e20;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 5px 0;
        }

        .activity-details p {
          color: #2c4a3e;
          font-size: 0.9rem;
          margin: 0 0 5px 0;
          opacity: 0.9;
        }

        .activity-time {
          color: #8a9b90;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .activity-time::before {
          content: '🕐';
          font-size: 0.9rem;
        }

        .activity-status {
          padding: 6px 15px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .activity-status.completed {
          background: rgba(21, 87, 36, 0.1);
          color: #155724;
        }

        .activity-status.pending {
          background: rgba(255, 193, 7, 0.1);
          color: #856404;
        }

        .activity-status.points {
          background: rgba(255, 215, 0, 0.15);
          color: #856404;
          font-weight: 600;
        }

        /* ====== Inspiration Card ====== */
        .inspiration-card {
          background: linear-gradient(135deg, #f0f9f0 0%, #e8f3e8 100%);
          border-radius: 24px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid rgba(21, 87, 36, 0.15);
        }

        .inspiration-icon {
          font-size: 2.5rem;
          color: #FFD700;
          animation: bulbGlow 2s ease-in-out infinite;
        }

        .inspiration-content h4 {
          color: #1b5e20;
          font-size: 1.2rem;
          margin: 0 0 5px 0;
        }

        .inspiration-content p {
          color: #2c4a3e;
          margin: 0;
          font-style: italic;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        /* ====== Section Title ====== */
        .section-title {
          font-size: 2.5rem;
          color: #1b5e20;
          position: relative;
          display: inline-block;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 30px;
        }

        .title-underline {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #1b5e20, #388e3c, #1b5e20, transparent);
          border-radius: 2px;
        }

        /* ====== Animations ====== */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes particleDrift {
          0% { background-position: 0 0; }
          100% { background-position: 200px 200px; }
        }

        @keyframes starPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
          50% { transform: scale(1.2); filter: drop-shadow(0 0 40px rgba(255,255,255,0.8)); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
        }

        @keyframes bulbGlow {
          0% { filter: drop-shadow(0 0 5px #FFD700); transform: scale(1); }
          50% { filter: drop-shadow(0 0 25px #FFD700); transform: scale(1.1); }
          100% { filter: drop-shadow(0 0 5px #FFD700); transform: scale(1); }
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

        @media (max-width: 992px) {
          .services-grid .col-lg-3 {
            margin-bottom: 20px;
          }
        }

        @media (max-width: 768px) {
          .gradient-text {
            font-size: 2.2rem;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-description {
            font-size: 1rem;
            padding: 0 20px;
          }
          
          .stats-container {
            flex-direction: column;
            border-radius: 40px;
            padding: 20px;
          }
          
          .stat-item:not(:last-child)::after {
            display: none;
          }
          
          .rewards-card {
            padding: 30px 20px;
          }
          
          .rewards-title {
            font-size: 1.3rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .px-xl-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

          .activity-item {
            flex-direction: column;
            text-align: center;
          }

          .inspiration-card {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .gradient-text {
            font-size: 1.8rem;
          }
          
          .card-icon {
            width: 70px;
            height: 70px;
            font-size: 2.2rem;
          }
          
          .card-icon-wrapper {
            width: 70px;
            height: 70px;
          }
          
          .stat-number {
            font-size: 1.5rem;
          }
          
          .rewards-star-animation {
            font-size: 4rem;
          }
        }
      `}</style>
    </div>
  );
}