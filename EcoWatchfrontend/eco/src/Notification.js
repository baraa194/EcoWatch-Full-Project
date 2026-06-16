import React, { useEffect, useState } from "react";

const Notification = ({ message, type = "info", duration = 15000, onClose }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!duration) return;

    const fadeTimer = setTimeout(() => setFade(true), duration - 400); // start fade out
    const removeTimer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`notification ${type} ${fade ? "fade-out" : ""}`}>
      <div className="notification-message">{message}</div>

      <button 
        className="notification-close" 
        onClick={() => {
          setFade(true);
          setTimeout(onClose, 600);
        }}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification;
