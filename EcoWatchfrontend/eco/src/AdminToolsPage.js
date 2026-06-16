import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthoritiesPage from "./AuthoritiesPage";
import EmailQueuePage from "./EmailQueuePage";
import RoutingRulesPage from "./RoutingRulesPage";

export default function AdminToolsPage() {
  const [activeTab, setActiveTab] = useState("authorities");

  return (
    <div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "authorities" ? "active bg-success text-white" : ""}`}
            onClick={() => setActiveTab("authorities")}
          >
            📋 Authorities
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "routing" ? "active bg-success text-white" : ""}`}
            onClick={() => setActiveTab("routing")}
          >
            🔄 Routing Rules
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "emails" ? "active bg-success text-white" : ""}`}
            onClick={() => setActiveTab("emails")}
          >
            📧 Email Queue
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "authorities" && <AuthoritiesPage goToHome={() => setActiveTab("authorities")} />}
        {activeTab === "routing" && <RoutingRulesPage />}
        {activeTab === "emails" && <EmailQueuePage />}
      </div>
    </div>
  );
}