import React, { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:5233";

const getToken = () => localStorage.getItem("accessToken");

const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="2.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  MessageSquare: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
};

// API CALLS
const getAllCommunityPosts = async () => {
  const token = getToken();
  if (!token) throw new Error("No token found — please login again");

  const res = await fetch(`${BASE_URL}/api/Community/admin/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status}: ${errorText}`);
  }

  const data = await res.json();
  
  let posts = [];
  if (Array.isArray(data)) {
    posts = data;
  } else if (data.$values) {
    posts = data.$values;
  } else {
    posts = data || [];
  }
  
  return posts.map(post => ({
    ...post,
    rejectionReason: post.rejectionReason || null
  }));
};

const reviewPost = async (postId, approved, rejectionReason = "") => {
  const token = getToken();
  if (!token) throw new Error("No token found — please login again");

  const payload = { approved: approved };
  if (!approved && rejectionReason) {
    payload.rejectionReason = rejectionReason;
  }

  const res = await fetch(`${BASE_URL}/api/Community/admin/posts/${postId}/review`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status}: ${errorText}`);
  }

  return await res.json();
};

// HELPERS
const STATUS_META = {
  "Pending":     { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b", label: "Pending", icon: "clock" },
  "InProgress":  { bg: "#e0f2fe", text: "#0369a1", dot: "#38bdf8", label: "In Progress", icon: "clock" },
  "Completed":   { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6", label: "Pending Review", icon: "check" },
  "Verified":    { bg: "#d1fae5", text: "#065f46", dot: "#10b981", label: "Verified", icon: "award" },
  "Rejected":    { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Rejected", icon: "x" },
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
};

const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

// CARD COMPONENT
function AdminCommunityCard({ post, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("approve");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localStatus, setLocalStatus] = useState(post.status);

  const statusInfo = STATUS_META[localStatus] || STATUS_META.Pending;
  const beforeImg = resolveImg(post.imageUrl || post.beforeImageUrl);
  const afterImg = resolveImg(post.afterImageUrl);
  const needsReview = localStatus === "Completed";
  const isVerified = localStatus === "Verified";
  const isRejected = localStatus === "Rejected";
  
  const userName = post.userName || `User${(post.userId || "").slice(-4)}` || "Citizen";
  const volunteerName = post.claimedByVolunteerName || 
                        (post.claimedByVolunteerUserId && `Volunteer${post.claimedByVolunteerUserId.slice(-4)}`);
  const pointsReward = post.pointsReward || 50;

  const openForm = (selectedMode) => {
    setMode(selectedMode);
    setReason("");
    setLocalError("");
    setShowForm(true);
  };

  const handleReview = async () => {
    if (mode === "reject" && !reason.trim()) {
      setLocalError("Rejection reason is required");
      return;
    }
    
    setLoading(true);
    setLocalError("");
    try {
      await reviewPost(post.id, mode === "approve", reason);
      setLocalStatus(mode === "approve" ? "Verified" : "Rejected");
      setShowForm(false);
      onStatusUpdate?.();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-media">
        {beforeImg ? (
          <img src={beforeImg} alt={post.title} className="admin-card-image" />
        ) : (
          <div className="admin-card-placeholder">
            <Icons.Image />
          </div>
        )}
        <div className="admin-card-badge" style={{ background: statusInfo.bg, color: statusInfo.text }}>
          <span className="admin-card-dot" style={{ background: statusInfo.dot }} />
          {statusInfo.label}
        </div>
        {pointsReward > 0 && (
          <div className="admin-card-points">
            <Icons.Star />
            <span>{pointsReward} pts</span>
          </div>
        )}
      </div>

      <div className="admin-card-content">
        <div className="admin-card-header">
          <div className="admin-card-author">
            <div className="admin-card-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="admin-card-name">{userName}</div>
              <div className="admin-card-date">
                <Icons.Clock />
                <span>{fmtDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <button className="admin-card-expand" onClick={() => setExpanded(!expanded)}>
            <Icons.ChevronDown style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>

        <h3 className="admin-card-title">{post.title || "Untitled"}</h3>
        <p className="admin-card-description">
          {(post.description || "").slice(0, 110)}
          {post.description?.length > 110 ? "…" : ""}
        </p>

        <div className="admin-card-tags">
          {post.location && (
            <span className="admin-tag">
              <Icons.MapPin />
              {post.location}
            </span>
          )}
          {post.category && (
            <span className="admin-tag">
              <Icons.Tag />
              {post.category}
            </span>
          )}
          {volunteerName && (
            <span className="admin-tag volunteer-tag">
              <Icons.User />
              {volunteerName}
            </span>
          )}
        </div>

        {expanded && (
          <div className="admin-card-details">
            {post.description && (
              <div className="admin-detail-section">
                <label>
                  <Icons.MessageSquare />
                  Full Description
                </label>
                <p>{post.description}</p>
              </div>
            )}
            {beforeImg && (
              <div className="admin-detail-section">
                <label>
                  <Icons.Image />
                  Before Image
                </label>
                <img src={beforeImg} alt="before" className="admin-detail-image" />
              </div>
            )}
            {afterImg && (
              <div className="admin-detail-section">
                <label>
                  <Icons.Image />
                  After Image
                </label>
                <img src={afterImg} alt="after" className="admin-detail-image" />
              </div>
            )}
            {post.notes && (
              <div className="admin-detail-section">
                <label>
                  <Icons.MessageSquare />
                  Volunteer Notes
                </label>
                <p>{post.notes}</p>
              </div>
            )}
            {volunteerName && (
              <div className="admin-detail-stats">
                <div className="admin-stat-item">
                  <Icons.User />
                  <strong>Volunteer:</strong> {volunteerName}
                </div>
                <div className="admin-stat-item">
                  <Icons.Star />
                  <strong>Impact Score:</strong> {post.volunteerImpactScore ?? 0}
                </div>
                <div className="admin-stat-item">
                  <Icons.Award />
                  <strong>Points Reward:</strong> {pointsReward} pts
                </div>
              </div>
            )}
          </div>
        )}

        {needsReview && !showForm && (
          <>
            <div className="admin-info-banner review-banner">
              <Icons.Clock />
              <span>Volunteer submitted — waiting for your review</span>
            </div>
            <div className="admin-action-buttons">
              <button className="admin-approve-btn" onClick={() => openForm("approve")}>
                <Icons.CheckCircle />
                Approve & Award {pointsReward} pts
              </button>
              <button className="admin-reject-btn" onClick={() => openForm("reject")}>
                <Icons.X />
                Reject
              </button>
            </div>
          </>
        )}

        {showForm && (
          <div className={`admin-review-form ${mode === "approve" ? "approve-mode" : "reject-mode"}`}>
            <label>
              {mode === "approve" ? (
                <>
                  <Icons.CheckCircle />
                  Approving — add a note (optional)
                </>
              ) : (
                <>
                  <Icons.AlertCircle />
                  Rejection reason
                </>
              )}
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                mode === "approve"
                  ? "Any notes about this verification…"
                  : "Why are you rejecting this submission?"
              }
              className="admin-review-textarea"
            />
            {localError && (
              <p className="admin-error-message">{localError}</p>
            )}
            <div className="admin-review-actions">
              <button
                className="admin-confirm-btn"
                onClick={handleReview}
                disabled={loading}
              >
                {loading ? "Processing..." : (mode === "approve" ? "Confirm Approve" : "Confirm Reject")}
              </button>
              <button className="admin-cancel-btn" onClick={() => { setShowForm(false); setReason(""); setLocalError(""); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="admin-info-banner verified-banner">
            <Icons.Award />
            <span>Verified — {pointsReward} pts awarded to {volunteerName || "volunteer"}</span>
          </div>
        )}
        {isRejected && (
          <div className="admin-info-banner rejected-banner">
            <Icons.X />
            <span>Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
}

// MAIN PAGE
export default function AdminCommunityPage({ goBack }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllCommunityPosts();
      setPosts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    let filtered = [...posts];
    if (filter !== "All") {
      filtered = filtered.filter((p) => p.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.title?.toLowerCase() || "").includes(q) ||
          (p.description?.toLowerCase() || "").includes(q) ||
          (p.userName?.toLowerCase() || "").includes(q) ||
          (p.claimedByVolunteerName?.toLowerCase() || "").includes(q) ||
          (p.location?.toLowerCase() || "").includes(q)
      );
    }
    setFilteredPosts(filtered);
  }, [filter, search, posts]);

  const counts = {
    All: posts.length,
    Pending: posts.filter((p) => p.status === "Pending").length,
    InProgress: posts.filter((p) => p.status === "InProgress").length,
    Completed: posts.filter((p) => p.status === "Completed").length,
    Verified: posts.filter((p) => p.status === "Verified").length,
    Rejected: posts.filter((p) => p.status === "Rejected").length,
  };

  const stats = [
    { label: "Total Reports", value: counts.All, icon: "file", color: "#475569" },
    { label: "Pending", value: counts.Pending, icon: "clock", color: "#d97706" },
    { label: "In Progress", value: counts.InProgress, icon: "clock", color: "#0369a1" },
    { label: "Pending Review", value: counts.Completed, icon: "check", color: "#7c3aed" },
    { label: "Verified", value: counts.Verified, icon: "award", color: "#059669" },
  ];

  const tabs = [
    { key: "All", label: "All Reports", count: counts.All },
    { key: "Pending", label: "Pending", count: counts.Pending },
    { key: "InProgress", label: "In Progress", count: counts.InProgress },
    { key: "Completed", label: "Pending Review", count: counts.Completed },
    { key: "Verified", label: "Verified", count: counts.Verified },
    { key: "Rejected", label: "Rejected", count: counts.Rejected },
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Icons.Globe />
            </div>
            <div>
              <h1>Community Reports</h1>
              <p>Review submissions, verify resolutions & award points</p>
            </div>
          </div>
          {goBack && (
            <button className="admin-back-btn" onClick={goBack}>
              <Icons.ChevronLeft />
              Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-stat-card" style={{ borderTopColor: stat.color }}>
              <div className="admin-stat-icon" style={{ color: stat.color }}>
                {stat.icon === "file" && <Icons.FileText />}
                {stat.icon === "clock" && <Icons.Clock />}
                {stat.icon === "check" && <Icons.CheckCircle />}
                {stat.icon === "award" && <Icons.Award />}
              </div>
              <div className="admin-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="admin-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search by title, user, volunteer, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`admin-tab ${filter === tab.key ? "active" : ""}`}
              >
                {tab.label}
                <span className="admin-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading community reports...</p>
          </div>
        ) : error ? (
          <div className="admin-error">
            <Icons.AlertCircle />
            <span>{error}</span>
            <button onClick={fetchPosts}>Retry</button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="admin-empty">
            <Icons.TrendingUp />
            <h3>No reports found</h3>
            <p>No reports match your current filters.</p>
          </div>
        ) : (
          <div className="admin-grid">
            {filteredPosts.map((post) => (
              <AdminCommunityCard key={post.id} post={post} onStatusUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }



        /* Header */
        .admin-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-brand-icon svg {
          width: 36px;
          height: 36px;
          color: #C5A059;
        }

        .admin-brand h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #5a6b5e;
          letter-spacing: -0.02em;
        }

        .admin-brand p {
          font-size: 0.75rem;
          color: #5a6b5e;
          margin-top: 4px;
        }

        .admin-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-back-btn svg {
          width: 18px;
          height: 18px;
        }

        .admin-back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Main Content */
        .admin-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
        }

        /* Stats Cards */
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .admin-stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          border-top: 3px solid;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .admin-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .admin-stat-icon svg {
          width: 28px;
          height: 28px;
          margin-bottom: 12px;
        }

        .admin-stat-value {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .admin-stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Toolbar */
        .admin-toolbar {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 28px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
        }

        .admin-search {
          position: relative;
          margin-bottom: 16px;
        }

        .admin-search svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #adb5bd;
        }

        .admin-search input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1.5px solid #e9ecef;
          border-radius: 12px;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .admin-search input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .admin-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .admin-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab.active {
          background: #0f172a;
          border-color: #0f172a;
          color: white;
        }

        .admin-tab-count {
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .admin-tab.active .admin-tab-count {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Grid */
        .admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
          gap: 24px;
        }

        /* Card */
        .admin-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e9ecef;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .admin-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
        }

        .admin-card-media {
          height: 200px;
          position: relative;
          overflow: hidden;
          background: #f8f9fa;
        }

        .admin-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-card-placeholder svg {
          width: 48px;
          height: 48px;
          color: #adb5bd;
        }

        .admin-card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 14px;
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(4px);
        }

        .admin-card-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .admin-card-points {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #fbbf24;
        }

        .admin-card-points svg {
          width: 12px;
          height: 12px;
        }

        .admin-card-content {
          padding: 20px;
        }

        .admin-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .admin-card-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-card-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .admin-card-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-card-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          color: #868e96;
        }

        .admin-card-date svg {
          width: 10px;
          height: 10px;
        }

        .admin-card-expand {
          background: none;
          border: none;
          cursor: pointer;
          color: #adb5bd;
          transition: transform 0.2s;
        }

        .admin-card-expand svg {
          width: 18px;
          height: 18px;
        }

        .admin-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .admin-card-description {
          font-size: 0.8rem;
          color: #6c757d;
          line-height: 1.5;
          margin-bottom: 14px;
        }

        .admin-card-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .admin-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: #f1f3f5;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          color: #495057;
        }

        .admin-tag svg {
          width: 12px;
          height: 12px;
        }

        .volunteer-tag {
          background: #fef3c7;
          color: #92400e;
        }

        /* Details Section */
        .admin-card-details {
          background: #f8f9fa;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .admin-detail-section {
          margin-bottom: 14px;
        }

        .admin-detail-section label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-detail-section label svg {
          width: 14px;
          height: 14px;
        }

        .admin-detail-section p {
          font-size: 0.8rem;
          color: #1e293b;
          line-height: 1.5;
        }

        .admin-detail-image {
          width: 100%;
          max-height: 180px;
          object-fit: cover;
          border-radius: 10px;
          margin-top: 8px;
        }

        .admin-detail-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e9ecef;
        }

        .admin-stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #475569;
        }

        .admin-stat-item svg {
          width: 14px;
          height: 14px;
        }

        /* Action Buttons */
        .admin-action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .admin-approve-btn, .admin-reject-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .admin-approve-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .admin-approve-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .admin-reject-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .admin-reject-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        /* Review Form */
        .admin-review-form {
          border-radius: 14px;
          padding: 16px;
          margin-top: 12px;
        }

        .admin-review-form.approve-mode {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .admin-review-form.reject-mode {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .admin-review-form label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .admin-review-form label svg {
          width: 16px;
          height: 16px;
        }

        .admin-review-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          font-size: 0.8rem;
          resize: vertical;
          font-family: inherit;
          outline: none;
        }

        .admin-review-textarea:focus {
          border-color: #10b981;
        }

        .admin-error-message {
          color: #dc2626;
          font-size: 0.7rem;
          margin-top: 6px;
        }

        .admin-review-actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .admin-confirm-btn, .admin-cancel-btn {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          border: none;
        }

        .admin-confirm-btn {
          background: #10b981;
          color: white;
        }

        .admin-confirm-btn:hover:not(:disabled) {
          background: #059669;
        }

        .admin-confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-cancel-btn {
          background: #e9ecef;
          color: #495057;
        }

        .admin-cancel-btn:hover {
          background: #dee2e6;
        }

        /* Info Banners */
        .admin-info-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 12px;
        }

        .admin-info-banner svg {
          width: 16px;
          height: 16px;
        }

        .review-banner {
          background: #ede9fe;
          color: #5b21b6;
        }

        .verified-banner {
          background: #d1fae5;
          color: #065f46;
        }

        .rejected-banner {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Loading & Empty States */
        .admin-loading {
          text-align: center;
          padding: 80px 0;
        }

        .admin-spinner {
          width: 44px;
          height: 44px;
          border: 3px solid #e9ecef;
          border-top-color: #10b981;
          border-radius: 50%;
          margin: 0 auto 16px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .admin-error {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 20px;
        }

        .admin-error svg {
          width: 48px;
          height: 48px;
          color: #dc2626;
          margin-bottom: 16px;
        }

        .admin-error button {
          margin-left: 12px;
          padding: 6px 16px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .admin-empty {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
        }

        .admin-empty svg {
          width: 56px;
          height: 56px;
          color: #adb5bd;
          margin-bottom: 16px;
        }

        .admin-empty h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .admin-empty p {
          color: #6c757d;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-header-container {
            padding: 16px 20px;
          }
          
          .admin-main {
            padding: 20px;
          }
          
          .admin-grid {
            grid-template-columns: 1fr;
          }
          
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .admin-stat-value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .admin-stats {
            grid-template-columns: 1fr;
          }
          
          .admin-tabs {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}