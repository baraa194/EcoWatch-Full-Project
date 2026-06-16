import React, { useState, useEffect } from "react";

const getToken = () => localStorage.getItem("accessToken");

const statusColor = (s) => {
  const map = {
    "Pending":  { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b", label: "Pending" },
    "Approved": { bg: "#d1fae5", text: "#065f46", dot: "#10b981", label: "Approved" },
    "Rejected": { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444", label: "Rejected" },
  };
  return map[s] || map["Pending"];
};

const getStatusString = (status) => {
  if (status === 1 || status === "Approved") return "Approved";
  if (status === 2 || status === "Cancelled" || status === "Rejected") return "Rejected";
  return "Pending";
};

// ─── CARD ────────────────────────────────────────────────────────────────────

function RecyclingTransactionCard({ transaction, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localError, setLocalError] = useState("");
  const [currentStatus, setCurrentStatus] = useState(() => getStatusString(transaction.status));

  const sc = statusColor(currentStatus);
  const transactionId = transaction.id || transaction.Id || transaction.transactionId;
  const contractId = transaction.contractId ?? 0;
  const weight = transaction.totalWeight ?? 0;
  const date = transaction.createdat
    ? new Date(transaction.createdat).toLocaleDateString()
    : "N/A";

  const isPending = currentStatus === "Pending";

  useEffect(() => {
    console.log("Transaction data:", transaction);
    console.log("Transaction ID:", transactionId);
  }, [transaction, transactionId]);

  // Function to call the points API
  const awardPointsForRecycling = async (transactionId) => {
    try {
      const token = getToken();
      console.log("Calling points API for transaction:", transactionId);
      
      const response = await fetch(
        `http://localhost:5233/api/UserPoints/ForUploadRecyling?transactionid=${transactionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Points API failed: ${response.status} - ${errorText}`);
      }

      const result = await response.text();
      console.log("Points awarded successfully:", result);
      return true;
    } catch (error) {
      console.error("Error awarding points:", error);
      throw error;
    }
  };

  const handleAccept = async () => {
    if (!transactionId) {
      setLocalError("Transaction ID is missing!");
      console.error("No transaction ID found:", transaction);
      return;
    }

    setIsUpdating(true);
    setLocalError("");
    try {
      const token = getToken();
      
      console.log("Attempting to approve transaction:", transactionId);
      
      // First, approve the transaction
      const res = await fetch(
        `http://localhost:5233/api/AdminRecycling/changeStatus/${transactionId}?approve=true`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Approval failed: ${res.status}: ${errText}`);
      }
      
      console.log("Transaction approved successfully, now awarding points...");
      
      // After successful approval, award points
      await awardPointsForRecycling(transactionId);
      
      setCurrentStatus("Approved");
      onStatusUpdate?.();
    } catch (err) {
      setLocalError(err.message);
      console.error("Error in handleAccept:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!transactionId) {
      setLocalError("Transaction ID is missing!");
      return;
    }

    setIsUpdating(true);
    setLocalError("");
    try {
      const token = getToken();
      const res = await fetch(
        `http://localhost:5233/api/AdminRecycling/changeStatus/${transactionId}?approve=false`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status}: ${errText}`);
      }
      setCurrentStatus("Rejected");
      onStatusUpdate?.();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 4px 20px #1a4a2e0a",
      border: "1px solid #e2e8f0",
      padding: "20px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #113c1c, #1a5928)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700,
          }}>C</div>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#113c1c" }}>
              {contractId > 0 ? `Contract #${contractId}` : "Direct Upload Request"}
            </h4>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Date: {date}</span>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
              ID: {transactionId}
            </div>
          </div>
        </div>
        <span style={{
          background: sc.bg, color: sc.text,
          borderRadius: 20, padding: "4px 12px",
          fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot }} />
          {sc.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px", marginBottom: 15 }}>
        <div style={{ marginBottom: 8, fontSize: 14, color: "#334155" }}>
          <strong>Request Type:</strong>{" "}
          <span style={{ color: "#1a5928", fontWeight: 600 }}>Recycling Contract</span>
        </div>
        <div style={{ fontSize: 14, color: "#334155" }}>
          <strong>Total Weight:</strong> {weight} kg
        </div>
      </div>

      {/* Error */}
      {localError && (
        <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 10px" }}>⚠️ {localError}</p>
      )}

      {/* Actions */}
      {isPending ? (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleAccept}
            disabled={isUpdating}
            style={{
              flex: 1, padding: "12px",
              background: "#16a34a", color: "#fff",
              border: "none", borderRadius: 12,
              fontWeight: 600, fontSize: 14,
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
            }}
          >
            {isUpdating ? "Processing..." : "Accept"}
          </button>
          <button
            onClick={handleReject}
            disabled={isUpdating}
            style={{
              flex: 1, padding: "12px",
              background: "#dc2626", color: "#fff",
              border: "none", borderRadius: 12,
              fontWeight: 600, fontSize: 14,
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
            }}
          >
            {isUpdating ? "Processing..." : "Reject"}
          </button>
        </div>
      ) : (
        <div style={{
          background: sc.bg, borderRadius: 12, padding: "10px",
          textAlign: "center", fontSize: 13, color: sc.text, fontWeight: 600,
        }}>
          Processed as {sc.label}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ImageRecyclingRequest({ goToHome }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5233/api/AdminRecycling/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Failed to load: ${response.status}`);

      const data = await response.json();
      console.log("API Response data:", data); 
        
      const list = Array.isArray(data) ? data : (data.$values || []);
      console.log("Transactions list:", list); 
        
      setTransactions(list);
      setFilteredTransactions(list);
    } catch (e) {
      console.error("Error fetching transactions:", e);
      setError(e.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  useEffect(() => {
    let filtered = [...transactions];
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(t =>
        (t.contractId && t.contractId.toString().includes(term)) ||
        (t.totalWeight && t.totalWeight.toString().includes(term)) ||
        (t.id && t.id.toString().includes(term)) ||
        (t.Id && t.Id.toString().includes(term))
      );
    }
    setFilteredTransactions(filtered);
  }, [search, transactions]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fbf8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #113c1c 0%, #1a5928 100%)", padding: "30px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff" }}>
                Admin - Recycling Requests
              </h1>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.8)" }}>
                Review citizen recycling contracts and approve transactions safely.
              </p>
            </div>
            <button
              onClick={goToHome}
              style={{
                padding: "10px 20px", background: "rgba(255,255,255,.15)",
                color: "#fff", border: "1px solid rgba(255,255,255,.3)",
                borderRadius: 10, cursor: "pointer",
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 40px" }}>
        {/* Search */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "15px", marginBottom: 30, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
          <input
            type="text"
            placeholder="Search by contract ID or Transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            Fetching recycling requests...
          </div>
        ) : error ? (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "30px", textAlign: "center", color: "#dc2626" }}>
            {error}
            <button onClick={fetchTransactions} style={{ marginLeft: 16, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
              Retry
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#374151", fontWeight: 600, fontSize: 18 }}>
            No recycling requests found
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 25 }}>
            {filteredTransactions.map((transaction, index) => (
              <RecyclingTransactionCard
                key={transaction.id || transaction.Id || index}         
                transaction={transaction}
                onStatusUpdate={fetchTransactions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}