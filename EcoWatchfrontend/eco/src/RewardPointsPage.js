import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RewardPoints from "./RewardPoints";
import { FaStar, FaGift, FaShoppingBag, FaTree, FaRecycle, FaCamera, FaTrophy, FaSpinner, FaCheckCircle, FaTimesCircle, FaCopy, FaTag, FaBoxOpen } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import axios from "axios";

const API_BASE = "http://localhost:5233/api";

export default function RewardPointsPage({ goToHome }) {
  const userId = localStorage.getItem("userId");
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null); // rewardId being redeemed
  const [refreshPoints, setRefreshPoints] = useState(0);
  const [notification, setNotification] = useState(null);
  const [redeemModal, setRedeemModal] = useState(null); // { reward } to confirm
  const [successModal, setSuccessModal] = useState(null); // RedemptionResultDto
  const [userPoints, setUserPoints] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchRewards();
    fetchPoints();
  }, []);

  // Refresh points after redeem
  useEffect(() => {
    if (refreshPoints > 0) fetchPoints();
  }, [refreshPoints]);

  const fetchPoints = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`${API_BASE}/UserPoints/userPoints?userid=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPoints(res.data || 0);
    } catch { setUserPoints(0); }
  };

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/rewards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Rewards fetched:", response.data);
      setRewards(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching rewards:", error);
      showNotification("Failed to load rewards", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRedeemClick = (reward) => {
    // Check points before showing modal
    if (userPoints < reward.pointsRequired) {
      showNotification(`You need ${reward.pointsRequired - userPoints} more points to redeem this reward`, "error");
      return;
    }
    if (reward.quantityAvailable === 0) {
      showNotification("This reward is out of stock", "error");
      return;
    }
    setRedeemModal(reward);
  };

  const handleConfirmRedeem = async () => {
    const reward = redeemModal;
    setRedeemModal(null);

    try {
      setRedeeming(reward.id);
      const token = localStorage.getItem('accessToken');

      const response = await axios.post(
        `${API_BASE}/rewards/redeem/${reward.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Redeem response:", response.data);

      // response.data = RedemptionResultDto
      // { success, message, rewardName, redeemedPoints, newBalance, redeemCode, error }
      if (response.data.success) {
        // Update local points immediately from backend newBalance
        setUserPoints(response.data.newBalance);
        setRefreshPoints(prev => prev + 1);
        fetchRewards(); // refresh quantities
        setSuccessModal(response.data); // show success modal with redeemCode
      } else {
        showNotification(response.data.error || response.data.message || "Failed to redeem", "error");
      }
    } catch (error) {
      console.error("❌ Error redeeming:", error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || "Failed to redeem reward";
      showNotification(errMsg, "error");
    } finally {
      setRedeeming(null);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const getIconForReward = (type) => {
    switch (type?.toLowerCase()) {
      case 'voucher': return <FaGift />;
      case 'shopping': return <FaShoppingBag />;
      case 'tree': return <FaTree />;
      case 'kit': return <FaRecycle />;
      default: return <FaStar />;
    }
  };

  const canAfford = (reward) => userPoints >= reward.pointsRequired;

  return (
    <div className="reward-points-page min-vh-100">

      {/* ── Notification Toast ── */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ── Confirm Redeem Modal ── */}
      {redeemModal && (
        <div className="modal-overlay" onClick={() => setRedeemModal(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">{getIconForReward(redeemModal.type)}</div>
            <h3 className="confirm-title">Confirm Redemption</h3>
            <p className="confirm-desc">
              Are you sure you want to redeem <strong>{redeemModal.name}</strong>?
            </p>
            <div className="confirm-cost">
              <FaStar className="star-icon" />
              <span>{redeemModal.pointsRequired} points will be deducted</span>
            </div>
            <div className="confirm-balance">
              <span>Your balance after: </span>
              <strong className={userPoints - redeemModal.pointsRequired >= 0 ? "balance-ok" : "balance-no"}>
                {userPoints - redeemModal.pointsRequired} pts
              </strong>
            </div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setRedeemModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleConfirmRedeem}>
                ✅ Yes, Redeem!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal with RedeemCode ── */}
      {successModal && (
        <div className="modal-overlay" onClick={() => setSuccessModal(null)}>
          <div className="success-modal" onClick={e => e.stopPropagation()}>
            <div className="success-confetti">🎉🎊✨</div>
            <div className="success-check"><FaCheckCircle /></div>
            <h3 className="success-title">Redeemed Successfully!</h3>
            <p className="success-reward-name">{successModal.rewardName}</p>

            {/* Show voucher code if exists */}
            {successModal.redeemCode && (
              <div className="voucher-section">
                <p className="voucher-label">
                  <FaTag /> Your Voucher Code
                </p>
                <div className="voucher-code-box">
                  <span className="voucher-code">{successModal.redeemCode}</span>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyCode(successModal.redeemCode)}
                  >
                    {copiedCode ? "✅ Copied!" : <><FaCopy /> Copy</>}
                  </button>
                </div>
                <p className="voucher-hint">Save this code — you'll need it to use your reward</p>
              </div>
            )}

            <div className="success-stats">
              <div className="success-stat">
                <span className="success-stat-label">Points Spent</span>
                <span className="success-stat-value red">-{successModal.redeemedPoints} ⭐</span>
              </div>
              <div className="success-stat">
                <span className="success-stat-label">New Balance</span>
                <span className="success-stat-value green">{successModal.newBalance} ⭐</span>
              </div>
            </div>

            <button className="btn-close-modal" onClick={() => setSuccessModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="main-content py-5 px-4 px-md-5 position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">

            {/* Header */}
            <div className="header-section text-center mb-5">
              <div className="eco-badge d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill mb-4">
                <span className="badge-icon"><FaStar /></span>
                <span className="fw-medium">Points & Rewards</span>
              </div>
              <h1 className="page-title fw-bold mb-3">
                Your <span className="gradient-text">Reward Points</span>
              </h1>
              <p className="page-description mx-auto">
                Collect points by reporting environmental issues and uploading recyclable materials.
                Exchange your points for amazing rewards!
              </p>
            </div>

            {/* Points Card */}
            <RewardPoints userId={userId} refreshTrigger={refreshPoints} />

            {/* How It Works */}
            <div className="how-it-works-card mt-5">
              <h3 className="section-title text-center mb-4">
                How to Earn Points
                <span className="title-underline"></span>
              </h3>
              <div className="steps-grid">
                {[
                  { icon: <MdReport />, title: "Submit Reports", desc: "Earn 20 points for every resolved environmental report" },
                  { icon: <FaCamera />, title: "Upload Recyclables", desc: "Earn points per kg — Metals: 15pts, Plastic/Paper: 5pts, Organics: 4pts" },
                  { icon: <FaRecycle />, title: "Recycle Materials", desc: "Get points for approved recycling requests" },
                  { icon: <FaTrophy />, title: "Redeem Rewards", desc: "Use your points for vouchers, items, and more!" }
                ].map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-icon-wrapper">
                      <span className="step-icon">{step.icon}</span>
                    </div>
                    <div className="step-content">
                      <h4 className="step-title">{step.title}</h4>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards Catalog */}
            <div className="rewards-catalog mt-5">
              <h3 className="section-title text-center mb-2">
                Available Rewards
                <span className="title-underline"></span>
              </h3>
              <p className="catalog-subtitle text-center">Your balance: <strong>{userPoints} ⭐</strong></p>

              {loading ? (
                <div className="text-center py-5">
                  <FaSpinner className="spinner-large" />
                  <p className="mt-3">Loading rewards...</p>
                </div>
              ) : rewards.length === 0 ? (
                <div className="empty-rewards">
                  <FaBoxOpen className="empty-icon" />
                  <p>No rewards available at the moment.</p>
                </div>
              ) : (
                <div className="catalog-grid">
                  {rewards.map((reward) => {
                    const affordable = canAfford(reward);
                    const outOfStock = reward.quantityAvailable === 0;
                    const isBeingRedeemed = redeeming === reward.id;

                    return (
                      <div
                        key={reward.id}
                        className={`reward-card ${!affordable ? 'reward-card--locked' : ''} ${outOfStock ? 'reward-card--outofstock' : ''}`}
                      >
                        {/* Image or icon */}
                        {reward.imageUrl ? (
                          <div className="reward-img-wrap">
                            <img
                              src={`http://localhost:5233${reward.imageUrl}`}
                              alt={reward.name}
                              className="reward-img"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="reward-icon">{getIconForReward(reward.type)}</div>
                        )}

                        {/* Type badge */}
                        <span className={`reward-type-badge type-${reward.type?.toLowerCase()}`}>
                          {reward.type || 'Reward'}
                        </span>

                        <h5 className="reward-title">{reward.name}</h5>
                        <p className="reward-desc">{reward.description || "Amazing reward!"}</p>

                        {/* Quantity */}
                        {reward.quantityAvailable !== null && reward.quantityAvailable !== undefined && (
                          <p className={`reward-quantity ${reward.quantityAvailable <= 5 ? 'reward-quantity--low' : ''}`}>
                            {outOfStock ? '❌ Out of stock' : `Only ${reward.quantityAvailable} left!`}
                          </p>
                        )}

                        {/* Points required */}
                        <div className="reward-points">
                          <span className="points-icon"><FaStar /></span>
                          <span className="points-value">{reward.pointsRequired}</span>
                          <span className="points-unit">pts</span>
                        </div>

                        {/* Not enough points indicator */}
                        {!affordable && !outOfStock && (
                          <p className="need-more-pts">
                            Need {reward.pointsRequired - userPoints} more pts
                          </p>
                        )}

                        <button
                          className={`redeem-btn ${affordable && !outOfStock ? 'redeem-btn--active' : ''}`}
                          onClick={() => handleRedeemClick(reward)}
                          disabled={isBeingRedeemed || outOfStock || !affordable}
                        >
                          {isBeingRedeemed ? (
                            <><FaSpinner className="btn-spinner" /> Redeeming...</>
                          ) : outOfStock ? (
                            'Out of Stock'
                          ) : !affordable ? (
                            '🔒 Not Enough Points'
                          ) : (
                            '🎁 Redeem Now'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Back Button */}
            <div className="text-center mt-4">
              <button className="back-btn-dashboard" onClick={goToHome}>
                ← Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

        .reward-points-page {
          font-family: 'Sora', sans-serif;
          position: relative;
          overflow-x: hidden;
          background: linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%);
        }

        .main-content { position: relative; z-index: 10; }

        /* ── Header ── */
        .header-section { animation: fadeInUp 0.8s ease-out; }
        .eco-badge { background: rgba(255,255,255,0.9); border: 1px solid rgba(46,125,50,0.2); backdrop-filter: blur(10px); color: #1b5e20; box-shadow: 0 4px 20px rgba(46,125,50,0.1); }
        .badge-icon { font-size: 1.4rem; display: flex; align-items: center; color: #FFD700; }
        .page-title { color: #1a2e1a; font-size: 2.8rem; font-weight: 800; }
        .gradient-text { background: linear-gradient(135deg, #1b5e20, #2e7d32, #388e3c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .page-description { color: #2c4a3e; font-size: 1.1rem; line-height: 1.6; max-width: 600px; opacity: 0.9; }

        /* ── How it works ── */
        .how-it-works-card, .rewards-catalog { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 32px; padding: 40px; box-shadow: 0 20px 40px rgba(0,40,0,0.1); border: 1px solid rgba(46,125,50,0.1); }
        .section-title { color: #1b5e20; font-size: 2rem; font-weight: 700; position: relative; }
        .title-underline { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 80px; height: 4px; background: linear-gradient(90deg, transparent, #1b5e20, #388e3c, transparent); border-radius: 2px; }
        .steps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
        .step-item { display: flex; align-items: flex-start; gap: 15px; padding: 20px; background: white; border-radius: 24px; border: 1px solid rgba(46,125,50,0.1); transition: all 0.3s ease; }
        .step-item:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(46,125,50,0.15); border-color: rgba(46,125,50,0.3); }
        .step-icon-wrapper { width: 60px; height: 60px; background: linear-gradient(135deg, #f0f9f0, #e0f0e0); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #1b5e20; flex-shrink: 0; }
        .step-icon { display: flex; align-items: center; }
        .step-title { color: #1b5e20; font-size: 1.1rem; font-weight: 700; margin-bottom: 5px; }
        .step-desc { color: #2c4a3e; font-size: 0.9rem; line-height: 1.5; margin: 0; opacity: 0.9; }

        /* ── Catalog ── */
        .catalog-subtitle { color: #2c4a3e; margin-bottom: 25px; font-size: 1rem; }
        .catalog-subtitle strong { color: #1b5e20; }
        .catalog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; }

        /* ── Reward Card ── */
        .reward-card { background: white; border-radius: 28px; padding: 25px; text-align: center; border: 2px solid rgba(46,125,50,0.1); transition: all 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; }
        .reward-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #1b5e20, #388e3c); transform: scaleX(0); transition: transform 0.3s ease; }
        .reward-card:hover::before { transform: scaleX(1); }
        .reward-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(46,125,50,0.15); border-color: rgba(46,125,50,0.3); }
        .reward-card--locked { opacity: 0.75; background: #fafafa; }
        .reward-card--locked:hover { transform: none; box-shadow: none; }
        .reward-card--outofstock { opacity: 0.5; }

        .reward-img-wrap { width: 80px; height: 80px; border-radius: 20px; overflow: hidden; margin-bottom: 12px; }
        .reward-img { width: 100%; height: 100%; object-fit: cover; }
        .reward-icon { font-size: 3rem; margin-bottom: 12px; color: #1b5e20; display: flex; align-items: center; justify-content: center; }

        .reward-type-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        .type-voucher { background: #e8f5e9; color: #1b5e20; }
        .type-shopping { background: #e3f2fd; color: #1565c0; }
        .type-kit { background: #f3e5f5; color: #6a1b9a; }
        .type-tree { background: #e8f5e9; color: #2e7d32; }

        .reward-title { color: #1b5e20; font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
        .reward-desc { color: #2c4a3e; font-size: 0.82rem; line-height: 1.5; margin-bottom: 8px; opacity: 0.85; flex: 1; }
        .reward-quantity { font-size: 0.78rem; background: #fff3cd; color: #856404; display: inline-block; padding: 3px 10px; border-radius: 50px; margin-bottom: 8px; }
        .reward-quantity--low { background: #f8d7da; color: #721c24; }
        .reward-points { display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 8px; }
        .points-icon { font-size: 1.1rem; color: #FFD700; display: flex; align-items: center; }
        .points-value { font-size: 1.3rem; font-weight: 800; color: #1b5e20; }
        .points-unit { font-size: 0.8rem; color: #888; }
        .need-more-pts { font-size: 0.75rem; color: #e57373; margin-bottom: 8px; }

        .redeem-btn { padding: 10px 20px; border: none; border-radius: 50px; color: white; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.3s ease; width: 100%; background: #ccc; }
        .redeem-btn--active { background: linear-gradient(135deg, #1b5e20, #2e7d32); }
        .redeem-btn--active:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(27,94,32,0.35); }
        .redeem-btn:disabled { cursor: not-allowed; }
        .btn-spinner { animation: spin 1s linear infinite; margin-right: 6px; }

        .empty-rewards { text-align: center; padding: 60px 20px; color: #2c4a3e; }
        .empty-icon { font-size: 4rem; color: #ccc; margin-bottom: 15px; display: block; }

        /* ── Confirm Modal ── */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
        .confirm-modal { background: white; border-radius: 32px; padding: 40px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 40px 80px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; }
        .confirm-icon { font-size: 4rem; color: #1b5e20; margin-bottom: 15px; display: flex; justify-content: center; }
        .confirm-title { color: #1b5e20; font-size: 1.6rem; font-weight: 800; margin-bottom: 10px; }
        .confirm-desc { color: #2c4a3e; font-size: 1rem; margin-bottom: 15px; }
        .confirm-cost { display: flex; align-items: center; justify-content: center; gap: 8px; background: #fff3cd; color: #856404; padding: 10px 20px; border-radius: 50px; margin-bottom: 10px; font-weight: 600; }
        .star-icon { color: #FFD700; }
        .confirm-balance { color: #555; font-size: 0.9rem; margin-bottom: 25px; }
        .balance-ok { color: #1b5e20; }
        .balance-no { color: #dc3545; }
        .confirm-actions { display: flex; gap: 15px; }
        .btn-cancel { flex: 1; padding: 12px; border: 2px solid #ddd; background: white; border-radius: 50px; color: #666; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-cancel:hover { background: #f5f5f5; }
        .btn-confirm { flex: 1; padding: 12px; border: none; background: linear-gradient(135deg, #1b5e20, #2e7d32); border-radius: 50px; color: white; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(27,94,32,0.3); }

        /* ── Success Modal ── */
        .success-modal { background: white; border-radius: 32px; padding: 40px; max-width: 460px; width: 100%; text-align: center; box-shadow: 0 40px 80px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; }
        .success-confetti { font-size: 2.5rem; margin-bottom: 10px; animation: bounce 0.6s ease; }
        .success-check { font-size: 4rem; color: #28a745; margin-bottom: 15px; display: flex; justify-content: center; }
        .success-title { color: #1b5e20; font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; }
        .success-reward-name { color: #2c4a3e; font-size: 1.1rem; margin-bottom: 20px; font-weight: 600; }

        /* ── Voucher Code ── */
        .voucher-section { background: linear-gradient(135deg, #1b5e20, #2e7d32); border-radius: 20px; padding: 20px; margin-bottom: 20px; }
        .voucher-label { color: rgba(255,255,255,0.85); font-size: 0.85rem; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .voucher-code-box { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 16px; margin-bottom: 10px; }
        .voucher-code { flex: 1; font-family: 'Courier New', monospace; font-size: 1.6rem; font-weight: 800; color: #FFD700; letter-spacing: 0.15em; }
        .copy-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 5px; transition: all 0.2s; white-space: nowrap; }
        .copy-btn:hover { background: rgba(255,255,255,0.3); }
        .voucher-hint { color: rgba(255,255,255,0.7); font-size: 0.78rem; margin: 0; }

        .success-stats { display: flex; gap: 15px; margin-bottom: 25px; }
        .success-stat { flex: 1; background: #f8f9fa; border-radius: 16px; padding: 15px; }
        .success-stat-label { display: block; font-size: 0.78rem; color: #888; margin-bottom: 5px; }
        .success-stat-value { font-size: 1.2rem; font-weight: 800; }
        .success-stat-value.red { color: #e57373; }
        .success-stat-value.green { color: #1b5e20; }

        .btn-close-modal { padding: 12px 40px; border: none; background: linear-gradient(135deg, #1b5e20, #2e7d32); border-radius: 50px; color: white; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; }
        .btn-close-modal:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(27,94,32,0.3); }

        /* ── Notification ── */
        .notification-toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 50px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000; animation: slideIn 0.3s ease; display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .notification-toast.success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
        .notification-toast.error { background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }

        /* ── Back Button ── */
        .back-btn-dashboard { background: white; border: 2px solid #1b5e20; color: #1b5e20; padding: 12px 30px; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .back-btn-dashboard:hover { background: #1b5e20; color: white; transform: translateX(-5px); }

        .spinner-large { font-size: 3rem; color: #1b5e20; animation: spin 1s linear infinite; }

        /* ── Animations ── */
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Responsive ── */
        @media (max-width: 992px) { .catalog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .page-title { font-size: 2rem; }
          .steps-grid { grid-template-columns: 1fr; }
          .catalog-grid { grid-template-columns: repeat(2, 1fr); }
          .how-it-works-card, .rewards-catalog { padding: 25px; }
        }
        @media (max-width: 576px) { .catalog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}