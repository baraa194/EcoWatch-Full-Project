import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:5233/api/Community";
const getToken = () => localStorage.getItem("accessToken");

// Professional SVG Icons
const Icons = {
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <polyline points="10 9 9 9 8 9"/>
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
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
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
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
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
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3"/>
    </svg>
  )
};

const statusColor = (s) => {
  const map = {
    "Pending":    { bg: "linear-gradient(135deg, #fef3c7, #fde68a)", text: "#92400e", dot: "#f59e0b", label: "Pending" },
    "InProgress": { bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)", text: "#1e40af", dot: "#3b82f6", label: "In Progress" },
    "Completed":  { bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)", text: "#065f46", dot: "#10b981", label: "Completed" },
    "Verified":   { bg: "linear-gradient(135deg, #ccfbf1, #99f6e4)", text: "#0f766e", dot: "#14b8a6", label: "Verified" },
    "Rejected":   { bg: "linear-gradient(135deg, #fee2e2, #fecaca)", text: "#991b1b", dot: "#ef4444", label: "Rejected" },
  };
  return map[s] || map["Pending"];
};

const fmtDate = (d) => {
  if (!d) return "Recently";
  return new Date(d).toLocaleDateString("en-US", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
};

// API CALLS
const getAllPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    if (response.status === 500) return [];
    if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
    const data = await response.json();
    
    let posts = data.$values || (Array.isArray(data) ? data : []);
    return posts.map(post => ({
      id: post.Id || post.id,
      title: post.Title || post.title,
      description: post.Description || post.description,
      location: post.Location || post.location,
      category: post.Category || post.category,
      status: post.Status || post.status || "Pending",
      imageUrl: post.ImageUrl || post.imageUrl,
      afterImageUrl: post.AfterImageUrl || post.afterImageUrl,
      createdAt: post.CreatedAt || post.createdAt,
      userName: post.UserName || post.userName,
      claimedBy: post.ClaimedByVolunteerName || post.claimedByVolunteerName,
      claimedAt: post.ClaimedAt || post.claimedAt,
      userId: post.UserId || post.userId,
      claimedByUserId: post.ClaimedByVolunteerUserId || post.claimedByVolunteerUserId,
      impactScore: post.VolunteerImpactScore || post.impactScore || 0,
      pointsReward: post.PointsReward || 50,
      notes: post.Notes || post.notes
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const getMyPosts = async () => {
  const token = getToken();
  if (!token) return [];
  try {
    const response = await fetch(`${BASE_URL}/my-posts`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const data = await response.json();
    let posts = data.$values || (Array.isArray(data) ? data : []);
    return posts.map(post => ({
      id: post.Id || post.id,
      title: post.Title || post.title,
      description: post.Description || post.description,
      location: post.Location || post.location,
      category: post.Category || post.category,
      status: post.Status || post.status || "Pending",
      imageUrl: post.ImageUrl || post.imageUrl,
      afterImageUrl: post.AfterImageUrl || post.afterImageUrl,
      createdAt: post.CreatedAt || post.createdAt,
      userName: post.UserName || post.userName,
      claimedBy: post.ClaimedByVolunteerName || post.claimedByVolunteerName,
      claimedAt: post.ClaimedAt || post.claimedAt,
      userId: post.UserId || post.userId,
      claimedByUserId: post.ClaimedByVolunteerUserId || post.claimedByVolunteerUserId,
      impactScore: post.VolunteerImpactScore || post.impactScore || 0,
      pointsReward: post.PointsReward || 50,
      notes: post.Notes || post.notes
    }));
  } catch (error) {
    console.error("Error fetching my posts:", error);
    return [];
  }
};

const getUserPoints = async () => {
  const token = getToken();
  if (!token) return 0;
  try {
    const response = await fetch(`http://localhost:5233/api/Volunteers/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.impactScore || data.ImpactScore || 0;
  } catch (error) {
    console.error("Error fetching points:", error);
    return 0;
  }
};

const createPost = async (formData) => {
  const token = getToken();
  if (!token) throw new Error("Please login again");
  const response = await fetch(`${BASE_URL}/posts`, { 
    method: "POST", 
    headers: { "Authorization": `Bearer ${token}` },
    body: formData 
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status}: ${errorText}`);
  }
  return response.json();
};

const claimAndComplete = async (postId, afterImage, notes) => {
  const token = getToken();
  if (!token) throw new Error("Please login again");
  const fd = new FormData();
  if (afterImage) fd.append("AfterImage", afterImage);
  fd.append("Notes", notes || "");
  
  const response = await fetch(`${BASE_URL}/posts/${postId}/complete`, { 
    method: "POST", 
    headers: { "Authorization": `Bearer ${token}` },
    body: fd 
  });
  if (response.status === 401) throw new Error("Session expired. Please login again.");
  if (!response.ok) throw new Error(`Failed to submit: ${response.status}`);
  return response.json();
};

// COMPONENTS
function ImageUploadBox({ label, file, onChange }) {
  const inputRef = useRef();
  const preview = file ? URL.createObjectURL(file) : null;
  
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);
  
  return (
    <div onClick={() => inputRef.current?.click()} className="upload-box">
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onChange} />
      {preview ? (
        <img src={preview} alt="preview" className="upload-preview" />
      ) : (
        <div className="upload-placeholder">
          <div className="upload-icon-wrapper">
            <Icons.Upload />
          </div>
          <span className="upload-title">{label}</span>
          <span className="upload-subtitle">Click or drag to upload</span>
          <span className="upload-hint">JPG, PNG up to 10MB</span>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function PostCard({ post, onOpen }) {
  let imageUrl = post.imageUrl;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `http://localhost:5233${imageUrl}`;
  }
  const sc = statusColor(post.status);
  
  return (
    <div className="post-card" onClick={() => onOpen(post)}>
      <div className="card-media">
        {imageUrl ? (
          <img src={imageUrl} alt={post.title} loading="lazy" />
        ) : (
          <div className="card-media-placeholder">
            <Icons.Image />
          </div>
        )}
        <div className="card-media-overlay" />
        <span className="status-badge" style={{ background: sc.bg, color: sc.text }}>
          <span className="status-dot" style={{ background: sc.dot }} />
          {sc.label}
        </span>
        {post.claimedBy && (
          <span className="claimed-badge">
            <Icons.User />
            <span>{post.claimedBy}</span>
          </span>
        )}
        {post.pointsReward > 0 && (
          <span className="points-badge">
            <Icons.Star />
            <span>{post.pointsReward}</span>
          </span>
        )}
      </div>
      
      <div className="card-content">
        <div className="card-meta">
          <div className="author-info">
            <div className="author-avatar">
              {(post.userName || "U")[0].toUpperCase()}
            </div>
            <span className="author-name">{post.userName || "Citizen"}</span>
          </div>
          <div className="post-date">
            <Icons.Clock />
            <span>{fmtDate(post.createdAt)}</span>
          </div>
        </div>
        
        <h3 className="card-title">{post.title}</h3>
        <p className="card-description">
          {(post.description || "").slice(0, 100)}{post.description?.length > 100 ? "..." : ""}
        </p>
        
        <div className="card-tags">
          {post.location && (
            <span className="tag location-tag">
              <Icons.MapPin />
              {post.location}
            </span>
          )}
          {post.category && (
            <span className="tag category-tag">
              <Icons.Tag />
              {post.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Waste");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const categories = ["Waste", "Pollution", "Water", "Air", "Deforestation", "Other"];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Please fill in title and description.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("Title", title);
      fd.append("Description", description);
      if (location.trim()) fd.append("Location", location);
      if (category.trim()) fd.append("Category", category);
      if (image) fd.append("Image", image);
      
      await createPost(fd);
      onCreated();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal-header">
        <div className="modal-header-content">
          <div className="modal-icon">
            <Icons.FileText />
          </div>
          <div>
            <h2>Report Community Issue</h2>
            <p>Help make your neighborhood better</p>
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>
          <Icons.X />
        </button>
      </div>
      
      <div className="modal-body">
        <div className="form-group">
          <label>
            <Icons.FileText />
            <span>Issue Title</span>
            <span className="required">*</span>
          </label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Illegal dumping near the park"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>
            <Icons.MessageSquare />
            <span>Description</span>
            <span className="required">*</span>
          </label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            rows={4} 
            placeholder="Describe the problem accurately..."
            className="form-textarea"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>
              <Icons.MapPin />
              <span>Location</span>
            </label>
            <input 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g., Downtown, Cairo"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>
              <Icons.Tag />
              <span>Category</span>
            </label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>
            <Icons.Camera />
            <span>Before Photo Evidence</span>
          </label>
          <ImageUploadBox label="Upload evidence photo" file={image} onChange={e => setImage(e.target.files[0])} />
        </div>
        
        {error && (
          <div className="error-alert">
            <Icons.AlertCircle />
            <span>{error}</span>
          </div>
        )}
        
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <span className="button-loading">
              <span className="spinner-small"></span>
              Posting...
            </span>
          ) : (
            <span>Submit Report</span>
          )}
        </button>
      </div>
    </Modal>
  );
}

function PostDetailModal({ post, onClose, onRefresh }) {
  const [afterImage, setAfterImage] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  let postImageUrl = post.imageUrl && !post.imageUrl.startsWith('http') ? `http://localhost:5233${post.imageUrl}` : post.imageUrl;
  let postAfterImageUrl = post.afterImageUrl && !post.afterImageUrl.startsWith('http') ? `http://localhost:5233${post.afterImageUrl}` : post.afterImageUrl;
  
  const sc = statusColor(post.status);
  const isPending = post.status === "Pending";
  const isInProgress = post.status === "InProgress";
  const isCompleted = post.status === "Completed" || post.status === "Verified";
  const canClaimOrComplete = (isPending || isInProgress) && !isCompleted;

  const handleSubmitResolution = async () => {
    if (!afterImage) {
      setError("Please upload proof image.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await claimAndComplete(post.id, afterImage, resolutionNotes);
      setMsg("Resolution submitted successfully! Points pending validation.");
      setShowCompleteForm(false);
      setTimeout(() => onRefresh(), 2000);
    } catch (e) {
      setError(e.message || "Failed to submit resolution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="detail-hero">
        {postImageUrl ? (
          <img src={postImageUrl} alt={post.title} />
        ) : (
          <div className="detail-hero-placeholder">
            <Icons.Image />
          </div>
        )}
        <div className="detail-hero-overlay"></div>
        <button className="detail-close" onClick={onClose}>
          <Icons.X />
        </button>
        <div className="detail-status-wrapper">
          <span className="detail-status-badge" style={{ background: sc.bg, color: sc.text }}>
            {sc.label}
          </span>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="detail-author">
          <div className="detail-avatar">
            {(post.userName || "U")[0].toUpperCase()}
          </div>
          <div className="detail-author-info">
            <h4>{post.userName || "Citizen"}</h4>
            <span>Published on {fmtDate(post.createdAt)}</span>
          </div>
        </div>
        
        <h2 className="detail-title">{post.title}</h2>
        <p className="detail-description">{post.description}</p>
        
        <div className="detail-meta">
          {post.location && (
            <div className="meta-item">
              <Icons.MapPin />
              <span>{post.location}</span>
            </div>
          )}
          {post.category && (
            <div className="meta-item">
              <Icons.Tag />
              <span>{post.category}</span>
            </div>
          )}
          {post.pointsReward > 0 && (
            <div className="meta-item reward">
              <Icons.Star />
              <span>{post.pointsReward} Points Reward</span>
            </div>
          )}
        </div>

        {postAfterImageUrl && (
          <div className="proof-section">
            <h5>
              <Icons.CheckCircle />
              <span>Resolution Proof</span>
            </h5>
            <img src={postAfterImageUrl} alt="After" className="proof-image" />
          </div>
        )}

        {post.notes && (
          <div className="notes-section">
            <div className="notes-header">
              <Icons.MessageSquare />
              <strong>Volunteer Actions</strong>
            </div>
            <p>{post.notes}</p>
          </div>
        )}

        {msg && (
          <div className="success-alert">
            <Icons.CheckCircle />
            <span>{msg}</span>
          </div>
        )}
        {error && (
          <div className="error-alert">
            <Icons.AlertCircle />
            <span>{error}</span>
          </div>
        )}

        {canClaimOrComplete && !showCompleteForm && (
          <button className="resolve-button" onClick={() => setShowCompleteForm(true)}>
            <Icons.Send />
            <span>Mark as Resolved</span>
          </button>
        )}

        {showCompleteForm && (
          <div className="resolution-form">
            <h4>
              <Icons.Shield />
              <span>Provide Proof of Action</span>
            </h4>
            <div className="form-group">
              <label>After Photo Evidence *</label>
              <ImageUploadBox label="Upload after photo" file={afterImage} onChange={e => setAfterImage(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Action Notes</label>
              <textarea 
                value={resolutionNotes} 
                onChange={e => setResolutionNotes(e.target.value)} 
                placeholder="What did you do to resolve this issue?"
                rows={3}
                className="form-textarea"
              />
            </div>
            <div className="form-actions">
              <button className="confirm-button" onClick={handleSubmitResolution} disabled={loading || !afterImage}>
                {loading ? "Submitting..." : "Submit Proof"}
              </button>
              <button className="cancel-button" onClick={() => setShowCompleteForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="celebration-banner">
            <Icons.Award />
            <span>This issue is closed and fully resolved</span>
          </div>
        )}
      </div>
    </Modal>
  );
}

// MAIN COMMUNITY PAGE
export default function CommunityPage({ goToHome }) {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const all = await getAllPosts();
      setPosts(all);
      if (getToken()) {
        const my = await getMyPosts();
        setMyPosts(my);
        const points = await getUserPoints();
        setUserPoints(points);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const displayedPosts = activeTab === "all" ? posts : myPosts;
  const filtered = displayedPosts.filter(p => {
    let matchFilter = filter === "All" || p.status === filter;
    const matchSearch = !search || 
      (p.title || "").toLowerCase().includes(search.toLowerCase()) || 
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const isLoggedIn = !!getToken();

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-container">
          <div className="brand">
            <div className="brand-icon">
              <Icons.Globe />
            </div>
            <div className="brand-text">
              <h1>EcoCommunity</h1>
              <p>Environmental Issue Tracker</p>
            </div>
          </div>
          
          <div className="header-actions">
            {isLoggedIn && (
              <div className="points-display">
                <Icons.Star />
                <span className="points-value">{userPoints}</span>
                <span className="points-label">XP</span>
              </div>
            )}
            
            
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="tabs-wrapper">
          <button 
            className={`tab ${activeTab === "all" ? "active" : ""}`} 
            onClick={() => setActiveTab("all")}
          >
            <Icons.Globe />
            <span>All Issues</span>
            <span className="tab-count">{posts.length}</span>
          </button>
          {isLoggedIn && (
            <button 
              className={`tab ${activeTab === "my" ? "active" : ""}`} 
              onClick={() => setActiveTab("my")}
            >
              <Icons.User />
              <span>My Reports</span>
              <span className="tab-count">{myPosts.length}</span>
            </button>
          )}
        </div>

        <div className="controls">
          <div className="search-field">
            <Icons.Search />
            <input 
              type="text"
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search issues..."
              className="search-input"
            />
          </div>
          
          <div className="filters">
            {["All", "Pending", "InProgress", "Completed"].map(f => (
              <button 
                key={f} 
                className={`filter ${filter === f ? "active" : ""}`} 
                onClick={() => setFilter(f)}
              >
                {f === "InProgress" ? "In Progress" : f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading community reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icons.TrendingUp />
            </div>
            <h3>No reports found</h3>
            <p>No environmental issues match your criteria.</p>
            {activeTab === "all" && (
              <button className="report-button empty-report" onClick={() => setShowCreate(true)}>
                <Icons.FileText />
                <span>Create First Report</span>
              </button>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {filtered.map(post => <PostCard key={post.id} post={post} onOpen={setSelected} />)}
          </div>
        )}
      </main>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchData(); }} />}
      {selectedPost && <PostDetailModal post={selectedPost} onClose={() => setSelected(null)} onRefresh={() => { setSelected(null); fetchData(); }} />}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f7f9fc;
          min-height: 100vh;
        }

        /* Header */
        .app-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid #e9ecef;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          color: #10b981;
        }

        .brand-icon svg {
          width: 100%;
          height: 100%;
        }

        .brand-text h1 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .brand-text p {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .points-display {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef3c7;
          padding: 8px 16px;
          border-radius: 40px;
        }

        .points-display svg {
          width: 18px;
          height: 18px;
          color: #f59e0b;
        }

        .points-value {
          font-weight: 700;
          color: #92400e;
        }

        .points-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #b45309;
        }

        .exit-button, .report-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 40px;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .exit-button svg, .report-button svg {
          width: 18px;
          height: 18px;
        }

        .exit-button {
          background: #f1f3f5;
          color: #495057;
        }

        .exit-button:hover {
          background: #e9ecef;
        }

        .report-button {
          background: #10b981;
          color: white;
        }

        .report-button:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        /* Main Content */
        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 32px 80px;
        }

        /* Tabs */
        .tabs-wrapper {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 1px solid #e9ecef;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          border: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .tab svg {
          width: 18px;
          height: 18px;
        }

        .tab.active {
          color: #10b981;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #10b981;
        }

        .tab-count {
          background: #e9ecef;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Controls */
        .controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          background: white;
          padding: 16px 24px;
          border-radius: 16px;
          border: 1px solid #e9ecef;
        }

        .search-field {
          flex: 2;
          min-width: 260px;
          position: relative;
        }

        .search-field svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #adb5bd;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #dee2e6;
          border-radius: 40px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter {
          padding: 8px 20px;
          border-radius: 40px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          font-size: 0.8rem;
          font-weight: 500;
          color: #495057;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter.active {
          background: #0f172a;
          border-color: #0f172a;
          color: white;
        }

        /* Posts Grid */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
        }

        /* Post Card */
        .post-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .post-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.1);
          border-color: #10b981;
        }

        .card-media {
          height: 200px;
          position: relative;
          overflow: hidden;
          background: #f8f9fa;
        }

        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-media-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
        }

        .card-media-placeholder svg {
          width: 48px;
          height: 48px;
        }

        .card-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.2));
          pointer-events: none;
        }

        .status-badge {
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

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .claimed-badge, .points-badge {
          position: absolute;
          bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 500;
          backdrop-filter: blur(8px);
        }

        .claimed-badge svg, .points-badge svg {
          width: 12px;
          height: 12px;
        }

        .claimed-badge {
          left: 16px;
          background: rgba(15, 23, 42, 0.8);
          color: white;
        }

        .points-badge {
          right: 16px;
          background: rgba(254, 243, 199, 0.95);
          color: #92400e;
        }

        .card-content {
          padding: 20px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .author-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .author-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
        }

        .post-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #868e96;
        }

        .post-date svg {
          width: 12px;
          height: 12px;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .card-description {
          font-size: 0.8rem;
          color: #6c757d;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .tag svg {
          width: 12px;
          height: 12px;
        }

        .location-tag {
          background: #f1f3f5;
          color: #495057;
        }

        .category-tag {
          background: #e7f5ff;
          color: #1c7ed6;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal-container {
          background: white;
          border-radius: 28px;
          max-width: 640px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-container::-webkit-scrollbar {
          width: 6px;
        }

        .modal-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .modal-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .modal-icon svg {
          width: 28px;
          height: 28px;
          color: #10b981;
        }

        .modal-header-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-header-content p {
          font-size: 0.7rem;
          color: #6c757d;
          margin-top: 2px;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          background: #f1f3f5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close svg {
          width: 18px;
          height: 18px;
          color: #495057;
        }

        .modal-close:hover {
          background: #e9ecef;
        }

        .modal-body {
          padding: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
        }

        .form-group label svg {
          width: 16px;
          height: 16px;
        }

        .required {
          color: #ef4444;
        }

        .form-input, .form-select, .form-textarea {
          padding: 12px 14px;
          border: 1.5px solid #dee2e6;
          border-radius: 14px;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-textarea {
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* Upload Box */
        .upload-box {
          border: 2px dashed #dee2e6;
          background: #f8f9fa;
          padding: 28px;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-box:hover {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .upload-icon-wrapper svg {
          width: 36px;
          height: 36px;
          color: #adb5bd;
        }

        .upload-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }

        .upload-subtitle {
          font-size: 0.75rem;
          color: #6c757d;
        }

        .upload-hint {
          font-size: 0.65rem;
          color: #adb5bd;
        }

        .upload-preview {
          width: 100%;
          max-height: 160px;
          object-fit: contain;
          border-radius: 12px;
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          border-radius: 40px;
          background: #10b981;
          color: white;
          border: none;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .submit-button:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Detail Modal */
        .detail-hero {
          height: 260px;
          position: relative;
          overflow: hidden;
        }

        .detail-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-hero-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f3f5;
        }

        .detail-hero-placeholder svg {
          width: 60px;
          height: 60px;
          color: #adb5bd;
        }

        .detail-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4));
        }

        .detail-close {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          transition: all 0.2s;
          z-index: 10;
        }

        .detail-close svg {
          width: 20px;
          height: 20px;
          color: white;
        }

        .detail-close:hover {
          background: rgba(239, 68, 68, 0.8);
        }

        .detail-status-wrapper {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 10;
        }

        .detail-status-badge {
          padding: 6px 18px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.8rem;
          backdrop-filter: blur(8px);
        }

        .detail-content {
          padding: 28px;
        }

        .detail-author {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .detail-avatar {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .detail-author-info h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .detail-author-info span {
          font-size: 0.7rem;
          color: #868e96;
        }

        .detail-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .detail-description {
          font-size: 0.9rem;
          color: #495057;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .detail-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #f1f3f5;
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #495057;
        }

        .meta-item svg {
          width: 14px;
          height: 14px;
        }

        .meta-item.reward {
          background: #fef3c7;
          color: #92400e;
        }

        .proof-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 20px;
          margin-bottom: 20px;
        }

        .proof-section h5 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }

        .proof-section h5 svg {
          width: 18px;
          height: 18px;
          color: #10b981;
        }

        .proof-image {
          width: 100%;
          max-height: 260px;
          object-fit: contain;
          border-radius: 12px;
        }

        .notes-section {
          background: #ecfdf5;
          padding: 20px;
          border-radius: 20px;
          margin-bottom: 20px;
          border-left: 3px solid #10b981;
        }

        .notes-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .notes-header svg {
          width: 16px;
          height: 16px;
          color: #10b981;
        }

        .resolve-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 40px;
          background: #0f172a;
          color: white;
          border: none;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 16px;
        }

        .resolve-button svg {
          width: 18px;
          height: 18px;
        }

        .resolve-button:hover {
          background: #1e293b;
          transform: translateY(-2px);
        }

        .resolution-form {
          background: #f8f9fa;
          padding: 24px;
          border-radius: 20px;
          margin-top: 20px;
        }

        .resolution-form h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .resolution-form h4 svg {
          width: 20px;
          height: 20px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .confirm-button, .cancel-button {
          flex: 1;
          padding: 12px;
          border-radius: 40px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .confirm-button {
          background: #10b981;
          color: white;
        }

        .confirm-button:hover:not(:disabled) {
          background: #059669;
        }

        .confirm-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-button {
          background: #e9ecef;
          color: #495057;
        }

        .cancel-button:hover {
          background: #dee2e6;
        }

        .celebration-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-radius: 16px;
          color: #065f46;
          font-weight: 600;
          font-size: 0.85rem;
          margin-top: 24px;
        }

        .celebration-banner svg {
          width: 22px;
          height: 22px;
        }

        /* Alerts */
        .error-alert, .success-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 14px;
          font-size: 0.8rem;
          margin: 16px 0;
        }

        .error-alert svg, .success-alert svg {
          width: 18px;
          height: 18px;
        }

        .error-alert {
          background: #fef2f2;
          border-left: 3px solid #ef4444;
          color: #b91c1c;
        }

        .success-alert {
          background: #ecfdf5;
          border-left: 3px solid #10b981;
          color: #047857;
        }

        /* Loading & Empty States */
        .loading-state {
          text-align: center;
          padding: 80px 0;
        }

        .spinner {
          width: 44px;
          height: 44px;
          border: 3px solid #e9ecef;
          border-top-color: #10b981;
          border-radius: 50%;
          margin: 0 auto 16px;
          animation: spin 0.8s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 28px;
          max-width: 480px;
          margin: 40px auto;
        }

        .empty-icon svg {
          width: 56px;
          height: 56px;
          color: #adb5bd;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: #0f172a;
        }

        .empty-state p {
          color: #6c757d;
          margin-bottom: 24px;
        }

        .empty-report {
          display: inline-flex;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-container {
            padding: 12px 20px;
          }
          
          .main-content {
            padding: 32px 20px 60px;
          }
          
          .posts-grid {
            gap: 20px;
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filters {
            justify-content: center;
          }
          
          .detail-title {
            font-size: 1.25rem;
          }
          
          .detail-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}