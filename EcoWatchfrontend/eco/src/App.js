import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Login from "./Login";
import RegisterPage from "./Register";
import Home1 from "./Home1";
import HomePage from "./HomePage";
import CitizenHomePage from "./CitizenHomePage";
import ReportForm from "./ReportForm";
import ForgotPassword from "./ForgotPassword";
import VerifyToken from "./VerifyToken";
import Notification from "./Notification";
import NotificationContainer from "./NotificationContainer";
import MyReports from "./MyReports";
import RecyclingPage from "./RecyclingPage";
import AdminCompanies from "./AdminCompanies";
import UploadMaterial from "./UploadMaterial";
import UploadImage from "./Uploadimage";
import RecyclerDashboard from "./RecyclerDashboard";
import RewardPointsPage from "./RewardPointsPage";
import CompanyList from "./CompanyList";
import CommunityPage from "./CommunityPage";
import AuthorityReports from "./AuthorityReports"; 
import "leaflet/dist/leaflet.css";

// ─── helpers ────────────────────────────────────────────────────────────────
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// ─── APP ───────────────────────────────────────────────────────────────────
function App() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState("home1");
  const [userRole, setUserRole] = useState("");
  const [notification, setNotification] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [refreshPoints, setRefreshPoints] = useState(0);

  const navigate = (newPage) => {
    setHistory(prev => [...prev, page]);
    setPage(newPage);
  };

  const handleBack = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const previousPage = prev[prev.length - 1];
      setPage(previousPage);
      return prev.slice(0, -1);
    });
  };

  const showNotification = (message, type = "info", duration = 3000) =>
    setNotification({ message, type, duration });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("userRole");
    setAccessToken(token || null);
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        const role = decoded.role || decoded.Role ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          decoded["roles"] || savedRole || "Citizen";
        const uid = decoded.sub || decoded.subs || decoded.nameid ||
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
          decoded.userId || decoded.id;
        setUserRole(role);
        localStorage.setItem("userRole", role);
        if (uid) { setUserId(uid); localStorage.setItem("userId", uid); }
        if (role === "Admin" || role === "admin") navigate("admin");
        else if (role === "Recycler" || role === "recycler") navigate("recycler");
        else if (role === "Authority" || role === "authority") navigate("authority"); 
        else navigate("citizen");
      } else if (savedRole) {
        setUserRole(savedRole);
        if (savedRole === "Admin") navigate("admin");
        else if (savedRole === "Recycler") navigate("recycler");
        else navigate("citizen");
      }
    }
  }, []);

  const handleLogin = async (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      localStorage.setItem("accessToken", mockToken);
      setAccessToken(mockToken);
      const decoded = decodeJWT(mockToken);
      if (decoded) { const role = decoded.role || "Admin"; setUserRole(role); localStorage.setItem("userRole", role); navigate("admin"); }
      showNotification("Login successful", "success", 4000);
    } else {
      showNotification("Invalid email or password", "error", 4000);
    }
  };

  const handleAPILogin = (token, refreshToken, roleFromAPI = null) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(token);
    const decoded = decodeJWT(token);
    let role = "Citizen", extractedUserId = null;
    if (decoded) {
      role = decoded.role || decoded.Role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        roleFromAPI || "Citizen";
      extractedUserId = decoded.sub || decoded.nameid || decoded.userId ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }
    setUserRole(role); localStorage.setItem("userRole", role);
    if (extractedUserId) { setUserId(extractedUserId); localStorage.setItem("userId", extractedUserId); }
    if (role === "Admin" || role === "admin") navigate("admin");
    else if (role === "Recycler" || role === "recycler") navigate("recycler");
    else if (role === "Authority" || role === "authority") navigate("authority"); 
    else navigate("citizen");
  };

  const handleAPIRegister = (token, refreshToken, roleFromForm = null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      setAccessToken(token);
      const decoded = decodeJWT(token);
      if (decoded) {
        const role = decoded.role || roleFromForm || "Citizen";
        const uid = decoded.sub || decoded.nameid || decoded.userId ||
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        setUserRole(role); localStorage.setItem("userRole", role);
        if (uid) { setUserId(uid); localStorage.setItem("userId", uid); }
        if (role === "Recycler" || role === "recycler") navigate("recycler");
        else if (role === "Admin" || role === "admin") navigate("admin");
        else navigate("citizen");
      }
    } else if (roleFromForm) {
      setUserRole(roleFromForm); localStorage.setItem("userRole", roleFromForm);
      if (roleFromForm === "Recycler") navigate("recycler");
      else if (roleFromForm === "Admin") navigate("admin");
      else navigate("citizen");
    }
  };

  const handleLogout = () => {
    ["loggedInUser", "accessToken", "refreshToken", "currentUserName", "userRole", "userId", "companyName"]
      .forEach(k => localStorage.removeItem(k));
    setUserRole(""); setAccessToken(null); setUserId(null);
    navigate("home1");
    showNotification("Logged out successfully", "success", 3000);
  };

  const goToHome = () => {
    if (userRole === "Admin" || userRole === "admin") navigate("admin");
    else if (userRole === "Recycler" || userRole === "recycler") navigate("recycler");
    else if (userRole === "Authority" || userRole === "authority") navigate("authority"); 
    else navigate("citizen");
  };

  return (
    <div>
      <NotificationContainer token={localStorage.getItem("accessToken")} userId={localStorage.getItem("userId")} />
      {notification && (
        <Notification message={notification.message} type={notification.type} duration={notification.duration} onClose={() => setNotification(null)} />
      )}
      {page !== "home1" && page !== "login" && page !== "register" && (
        <Navbar showBack={history.length > 0} onBack={handleBack} onLogout={handleLogout} />
      )}

      {page === "home1" && <Home1 goToLogin={() => navigate("login")} goToRegister={() => navigate("register")} />}
      {page === "login" && <Login goToRegister={() => navigate("register")} onAPILogin={handleAPILogin} goToForgotPassword={() => navigate("forgot")} onLocalLogin={handleLogin} />}
      {page === "register" && <RegisterPage goToLogin={() => navigate("login")} onAPIRegister={handleAPIRegister} />}

      {page === "admin" && <HomePage goToLogin={handleLogout} goToReportForm={() => navigate("report")} goToRecycling={() => navigate("recycling")} goToAdminCompanies={() => navigate("admin-companies")} userRole={userRole} />}

      {page === "citizen" && (
        <CitizenHomePage
          goToLogin={handleLogout}
          goToReportForm={() => navigate("report")}
          goToMyReports={() => navigate("myreports")}
          goToRecycling={() => navigate("recycling")}
          goToRewardPoints={() => navigate("rewardpoints")}
          goToCommunity={() => navigate("community")}
          showNotification={showNotification}
        />
      )}

      {page === "recycler" && (
        <RecyclerDashboard
          goToLogin={handleLogout}
          goToRecycling={() => navigate("recycling")}
          uploadImage={() => navigate("upload-image")}
          goToCompanies={() => navigate("companies")}
          goToRewardPoints={() => navigate("rewardpoints")}
          userId={userId}
        />
      )}

      {page === "authority" && (
        <AuthorityReports 
          goToLogin={handleLogout} 
          userId={userId} 
          userRole={userRole} 
        />
      )}

      {page === "upload-image" && (
        <UploadImage 
          goToHome={goToHome} 
          userId={userId}
          onUploadSuccess={data => {
            const pointsEarned = data && data.points ? data.points : "some";
            showNotification(`Photo uploaded successfully for verification! ⭐`, "success", 4000);
          }} 
        />
      )}

      {page === "companies" && (
        <CompanyList userId={userId}
          onCreateContract={company => showNotification(`Contract created with ${company.name}!`, "success", 4000)}
          goToHome={goToHome}
          navigateToUpload={company => { setSelectedCompany(company); navigate("upload-material"); }} />
      )}

      {page === "myreports" && <MyReports goToHome={goToHome} goToReportForm={() => navigate("report")} />}
      {page === "recycling" && <RecyclingPage goToHome={goToHome} goToLogin={handleLogout} goToUploadMaterial={company => { setSelectedCompany(company); navigate("upload-material"); }} />}
      {page === "upload-material" && <UploadMaterial selectedCompany={selectedCompany} goToHome={goToHome} userId={userId} onUploadSuccess={() => showNotification("Materials uploaded! Points added.", "success", 4000)} onPointsUpdate={() => setRefreshPoints(p => p + 1)} />}
      {page === "rewardpoints" && <RewardPointsPage goToHome={goToHome} />}
      {page === "admin-companies" && <AdminCompanies goToHome={() => navigate("admin")} userRole={userRole} />}
      {page === "report" && <ReportForm goToHome={goToHome} />}
      {page === "forgot" && <ForgotPassword goToVerifyToken={() => navigate("verify")} />}
      {page === "verify" && <VerifyToken goToLogin={() => navigate("login")} />}

      {/* Community Page */}
      {page === "community" && <CommunityPage goToHome={goToHome} />}
      
    </div>
  );
}

export default App;