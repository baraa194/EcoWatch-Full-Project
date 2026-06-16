import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CitizenHomePage({ 
  goToLogin, 
  goToReportForm, 
  goToMyReports,
  goToRecycling,
  goToRewardPoints,
  goToCommunity,
  showNotification,
  citizenName 
}) {
  
 
  const displayName = citizenName || localStorage.getItem("currentUserName") || "Citizen";

  return (
    <div className="citizen-home-page min-vh-100">
      <div className="main-content py-5 px-4 px-md-5 px-xl-6 position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            
            {/* Hero Section */}
<div className="hero-section text-center mb-5">
  <h1 className="hero-title display-4 fw-bold mb-3 d-inline-flex align-items-center justify-content-center gap-2 flex-wrap">
    <span>Welcome,</span> 
    <span className="gradient-text">{displayName}</span> 
    <span>to the <span className="gradient-text">Environmental Reporting System</span></span>
  </h1>
  
  <p className="hero-description lead mx-auto">
    As a citizen, you can contribute to preserving the environment by reporting environmental problems 
    and participating in recycling initiatives in your area.
  </p>
              <div className="stats-container d-flex justify-content-center gap-4 mt-5">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Reports Solved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Active Citizens</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Recycling Centers</span>
                </div>
              </div>
            </div>
            
            {/* Services Grid - 4 Cards */}
            <div className="services-grid row g-4 mb-5">
              {/* Submit Report Card */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon report-icon">📝</div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Submit Report</h5>
                    <p className="card-description mb-4">
                      Report environmental issues like waste dumping, pollution, or illegal activities in your area
                    </p>
                    <button onClick={goToReportForm} className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2">
                      <span>Start Reporting</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* My Reports Card */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon reports-icon">📋</div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">My Reports</h5>
                    <p className="card-description mb-4">
                      Track the status of your submitted reports, view updates, and manage your environmental contributions
                    </p>
                    <button onClick={goToMyReports} className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2">
                      <span>View Reports</span>
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
                      <div className="card-icon reward-icon">⭐</div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Reward Points</h5>
                    <p className="card-description mb-4">
                      Check your reward points balance, see how to earn more, and track your rewards
                    </p>
                    <button onClick={goToRewardPoints} className="card-btn btn w-100 d-flex align-items-center justify-content-center gap-2">
                      <span>View Points</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ✅ Community Card - NEW */}
              <div className="col-md-6 col-lg-3">
                <div className="service-card card h-100 border-0">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="card-icon-wrapper mb-4">
                      <div className="card-icon community-icon">🌍</div>
                      <div className="icon-glow"></div>
                    </div>
                    <h5 className="card-title fw-bold mb-3">Community</h5>
                    <p className="card-description mb-4">
                      Browse issues reported by citizens, volunteer to solve them, and submit proof of your contribution
                    </p>
                    <button onClick={goToCommunity} className="card-btn community-btn btn w-100 d-flex align-items-center justify-content-center gap-2">
                      <span>Explore</span>
                      <span className="btn-arrow">→</span>
                    </button>
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
                        <h3 className="rewards-title">Every Report Earns You 50 Points!</h3>
                      </div>
                      <p className="rewards-description">
                        <strong>Your voice matters!</strong> Every environmental report you submit helps protect our planet and earns you <strong>50 points automatically</strong>. The more you report, the more you earn! These points can be redeemed for exciting rewards, discounts from our recycling partners, and exclusive benefits.
                      </p>
                      <p className="rewards-description mt-3" style={{ fontWeight: '500', background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '20px' }}>
                        ✨ <strong>Special Bonus:</strong> Reports with photos earn double points (100 points)! 
                        <br/>✨ <strong>Weekly Champion:</strong> Top reporter each week gets 500 bonus points!
                      </p>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="rewards-star-container">
                        <div className="rewards-star-animation">⭐</div>
                        <div className="rewards-star-glow"></div>
                      </div>
                      <div className="rewards-badge">Start Earning Points!</div>
                      <div style={{ marginTop: '20px', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                        <span>50 points per report</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="row">
              <div className="col-12">
                <h3 className="section-title text-center fw-bold mb-4">
                  How It Works
                  <span className="title-underline"></span>
                </h3>
                <div className="steps-grid row g-4 mt-4">
                  {[
                    { title: 'Submit a Report', desc: 'Report any environmental issue in your area - waste, pollution, or illegal activities' },
                    { title: 'Earn 50 Points', desc: 'Get 50 points instantly for every report you submit. Add photos for double points!' },
                    { title: 'Track Progress', desc: 'Monitor your reports status and watch your points grow in real-time' },
                    { title: 'Redeem Rewards', desc: 'Exchange your points for amazing rewards and discounts from our partners' }
                  ].map((step, index) => (
                    <div className="col-md-3" key={index}>
                      <div className="step-card card border-0 h-100 text-center">
                        <div className="step-number-container">
                          <span className="step-number">{index + 1}</span>
                        </div>
                        <h5 className="step-title">{step.title}</h5>
                        <p className="step-description">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="motivation-banner text-center mt-5 p-4" style={{
                  background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
                  borderRadius: '60px', border: '1px solid rgba(46, 125, 50, 0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ fontSize: '1.2rem', color: '#1b5e20', margin: 0 }}>
                    ⭐ <strong>Every report makes a difference!</strong> Join 1000+ active citizens who are earning points while saving the environment.
                    <span style={{ display: 'block', marginTop: '10px', fontSize: '1rem', color: '#2c4a3e' }}>
                      The more you report, the greener our planet becomes - and the more points you earn!
                    </span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .citizen-home-page { position: relative; overflow-x: hidden; }

        .floating-bg-elements { position: fixed; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .floating-orb { position: absolute; border-radius: 50%; filter: blur(120px); animation: floatOrb 20s infinite alternate; }
        .orb-1 { width: 600px; height: 600px; background: rgba(46,125,50,0.15); top: -200px; right: -200px; animation-duration: 25s; }
        .orb-2 { width: 500px; height: 500px; background: rgba(76,175,80,0.1); bottom: -150px; left: -150px; animation-duration: 30s; }
        .orb-3 { width: 400px; height: 400px; background: rgba(27,94,32,0.12); top: 50%; left: 50%; transform: translate(-50%,-50%); filter: blur(150px); animation: pulseOrb 15s ease-in-out infinite; }
        .floating-particles { position: absolute; width: 100%; height: 100%; background-image: radial-gradient(circle, rgba(76,175,80,0.1) 1px, transparent 1px); background-size: 50px 50px; animation: particleFloat 40s linear infinite; }

        .main-content { z-index: 10; }

        .hero-section { animation: fadeInUp 1s ease-out; position: relative; }
        .hero-title { color: #1a2e1a; font-size: 3.2rem; line-height: 1.2; }
        .gradient-text { background: linear-gradient(135deg,#1b5e20,#2e7d32,#388e3c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: block; font-size: 3.2rem; font-weight: 800; }
        .hero-description { color: #2c4a3e; max-width: 700px; font-size: 1.15rem; line-height: 1.7; opacity: 0.9; }

        .stats-container { background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); padding: 20px 30px; border-radius: 60px; display: inline-flex; border: 1px solid rgba(46,125,50,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .stat-item { display: flex; flex-direction: column; align-items: center; padding: 0 20px; position: relative; }
        .stat-item:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 1px; height: 30px; background: linear-gradient(to bottom, transparent, rgba(46,125,50,0.3), transparent); }
        .stat-number { font-size: 1.8rem; font-weight: 800; color: #1b5e20; line-height: 1.2; }
        .stat-label { font-size: 0.85rem; color: #2c4a3e; opacity: 0.8; font-weight: 500; }

        .service-card { border-radius: 32px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); box-shadow: 0 20px 40px rgba(0,40,0,0.08); border: 1px solid rgba(46,125,50,0.1); transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); position: relative; overflow: hidden; }
        .service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 100%; background: linear-gradient(135deg,rgba(255,255,255,0.4) 0%,transparent 100%); opacity: 0; transition: opacity 0.4s ease; }
        .service-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 30px 60px rgba(46,125,50,0.2); border-color: rgba(46,125,50,0.3); }
        .service-card:hover::before { opacity: 1; }

        .card-icon-wrapper { position: relative; width: 90px; height: 90px; margin-bottom: 20px; }
        .card-icon { width: 90px; height: 90px; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; transition: all 0.4s ease; position: relative; z-index: 2; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .icon-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 100px; height: 100px; background: radial-gradient(circle,rgba(255,255,255,0.8) 0%,transparent 70%); border-radius: 50%; opacity: 0; transition: opacity 0.4s ease; z-index: 1; }
        .service-card:hover .icon-glow { opacity: 0.5; }
        .service-card:hover .card-icon { transform: scale(1.1) rotate(8deg); }

        .report-icon    { background: linear-gradient(135deg,#fff9c4 0%,#fff176 100%); }
        .reports-icon   { background: linear-gradient(135deg,#e1f5fe 0%,#b3e5fc 100%); }
        .reward-icon    { background: linear-gradient(135deg,#c8e6c9 0%,#a5d6a7 100%); }
        .community-icon { background: linear-gradient(135deg,#e8f5e9 0%,#a5d6a7 100%); }

        .card-title { color: #1b5e20; font-size: 1.3rem; font-weight: 700; margin-bottom: 15px; }
        .card-description { color: #2c4a3e; font-size: 0.95rem; line-height: 1.7; flex: 1; opacity: 0.9; }

        .card-btn { background: linear-gradient(135deg,#1b5e20,#2e7d32,#388e3c); border: none; color: white; border-radius: 50px; padding: 14px 20px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 8px 20px rgba(27,94,32,0.3); transition: all 0.3s ease; position: relative; overflow: hidden; }
        .card-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); transition: left 0.5s ease; }
        .card-btn:hover::before { left: 100%; }
        .card-btn:hover { transform: translateX(8px); box-shadow: 0 12px 30px rgba(27,94,32,0.4); color: white; }
        .btn-arrow { transition: transform 0.3s ease; }
        .card-btn:hover .btn-arrow { transform: translateX(5px); }

        .community-btn { background: linear-gradient(135deg,#166534,#15803d,#16a34a); box-shadow: 0 8px 20px rgba(22,101,52,0.35); }
        .community-btn:hover { box-shadow: 0 12px 30px rgba(22,101,52,0.5); color: white; }

        .rewards-card { background: linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#1b5e20 100%); border-radius: 40px; padding: 50px; position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(27,94,32,0.4); }
        .rewards-bg-animation { position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle,rgba(255,255,255,0.2) 0%,transparent 60%); animation: rotate 30s linear infinite; }
        .rewards-particles { position: absolute; width: 100%; height: 100%; background-image: radial-gradient(circle,rgba(255,255,255,0.3) 1px,transparent 1px); background-size: 30px 30px; animation: particleDrift 20s linear infinite; }
        .rewards-content { z-index: 2; }
        .rewards-main-icon { font-size: 2.5rem; filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
        .rewards-title { color: white; font-size: 1.8rem; font-weight: 700; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        .rewards-description { color: rgba(255,255,255,0.95); line-height: 1.7; margin: 0; font-size: 1.05rem; }
        .rewards-star-container { position: relative; width: 120px; height: 120px; margin: 0 auto 20px; }
        .rewards-star-animation { font-size: 5rem; position: relative; z-index: 2; animation: starPulse 2s ease-in-out infinite; }
        .rewards-star-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 100px; height: 100px; background: radial-gradient(circle,rgba(255,255,255,0.8) 0%,transparent 70%); border-radius: 50%; animation: glowPulse 2s ease-in-out infinite; }
        .rewards-badge { display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 10px 25px; border-radius: 50px; color: white; font-weight: 600; border: 1px solid rgba(255,255,255,0.3); font-size: 1rem; box-shadow: 0 5px 20px rgba(0,0,0,0.2); }

        .section-title { font-size: 2.5rem; color: #1b5e20; position: relative; display: inline-block; left: 50%; transform: translateX(-50%); margin-bottom: 30px; }
        .title-underline { position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: linear-gradient(90deg,transparent,#1b5e20,#388e3c,#1b5e20,transparent); border-radius: 2px; }

        .step-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 32px; padding: 35px 25px; box-shadow: 0 20px 40px rgba(0,30,0,0.08); border: 1px solid rgba(46,125,50,0.1); transition: all 0.4s ease; position: relative; overflow: hidden; }
        .step-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg,#1b5e20,#388e3c); transform: scaleX(0); transition: transform 0.4s ease; }
        .step-card:hover::after { transform: scaleX(1); }
        .step-card:hover { transform: translateY(-8px); box-shadow: 0 30px 50px rgba(46,125,50,0.15); }
        .step-number-container { width: 70px; height: 70px; background: linear-gradient(135deg,#1b5e20,#2e7d32); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; box-shadow: 0 10px 20px rgba(27,94,32,0.3); position: relative; transition: all 0.3s ease; }
        .step-number-container::before { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: linear-gradient(135deg,#fff9c4,#c8e6c9); opacity: 0; transition: opacity 0.3s ease; z-index: -1; }
        .step-card:hover .step-number-container { transform: scale(1.1); }
        .step-card:hover .step-number-container::before { opacity: 0.5; }
        .step-number { font-size: 2rem; font-weight: 800; color: white; text-shadow: 0 2px 5px rgba(0,0,0,0.2); font-family: 'Arial Black', sans-serif; }
        .step-title { color: #1b5e20; font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; }
        .step-description { color: #2c4a3e; font-size: 0.95rem; line-height: 1.6; margin: 0; opacity: 0.9; }

        @keyframes floatOrb { 0% { transform: translate(0,0) scale(1); opacity: 0.3; } 100% { transform: translate(80px,-50px) scale(1.3); opacity: 0.6; } }
        @keyframes pulseOrb { 0%,100% { opacity: 0.2; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 0.4; transform: translate(-50%,-50%) scale(1.2); } }
        @keyframes particleFloat { 0% { background-position: 0 0; } 100% { background-position: 100px 100px; } }
        @keyframes particleDrift { 0% { background-position: 0 0; } 100% { background-position: 200px 200px; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes starPulse { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); } 50% { transform: scale(1.2); filter: drop-shadow(0 0 40px rgba(255,255,255,0.8)); } }
        @keyframes glowPulse { 0%,100% { opacity: 0.3; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 0.6; transform: translate(-50%,-50%) scale(1.3); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        .px-xl-6 { padding-left: 5rem; padding-right: 5rem; }

        @media (max-width: 1200px) { .px-xl-6 { padding-left: 3rem; padding-right: 3rem; } }
        @media (max-width: 768px) {
          .gradient-text, .hero-title { font-size: 2.2rem; }
          .hero-description { font-size: 1rem; padding: 0 20px; }
          .stats-container { flex-direction: column; border-radius: 40px; padding: 20px; }
          .stat-item:not(:last-child)::after { display: none; }
          .rewards-card { padding: 30px 20px; }
          .rewards-title { font-size: 1.3rem; }
          .section-title { font-size: 2rem; }
          .step-card { padding: 30px 20px; }
          .step-number-container { width: 60px; height: 60px; }
          .step-number { font-size: 1.8rem; }
          .px-xl-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
        @media (max-width: 576px) {
          .orb-2, .orb-3 { width: 300px; height: 300px; }
          .gradient-text { font-size: 1.8rem; }
          .card-icon { width: 70px; height: 70px; font-size: 2.2rem; }
          .card-icon-wrapper { width: 70px; height: 70px; }
          .stat-number { font-size: 1.5rem; }
          .rewards-star-animation { font-size: 4rem; }
        }
      `}</style>
    </div>
  );
}
