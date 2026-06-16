import React, { useState } from "react";
import RewardPoints from "./RewardPoints";
import CompanyList from "./CompanyList";

function RecyclingPage({ goToHome, goToLogin, goToUploadMaterial}) {
  const userId = localStorage.getItem("userId");
  const [refreshTrigger, setRefreshTrigger] = useState(0);



  // Refresh points when upload or contract is successful
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="py-4">
      

      {/* ✅ Three components in one page */}
      <div className="row g-4">
        {/* Column 1 - Reward Points */}
        
       

        {/* Column 3 - Company List (full width) */}
        <div className="col-12 mt-4">
        <CompanyList 
  userId={userId}
  onCreateContract={goToUploadMaterial}
/>


        </div>
      </div>
      
    </div>
  );
}

export default RecyclingPage;