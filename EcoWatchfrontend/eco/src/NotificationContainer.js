import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import Notification from "./Notification";
import "./Notification.css";

// decode JWT payload safely (browser-safe)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn("parseJwt failed", e);
    return null;
  }
}

const NotificationContainer = ({ token, userId: propUserId }) => {
  const [notifications, setNotifications] = useState([]);
  const connectionRef = useRef(null);

  useEffect(() => {
    console.log("[NotificationContainer] useEffect start. token present:", !!token, " propUserId:", propUserId);

    const backendHost = "http://localhost:5233";
    let url = `${backendHost}/Notification`;

    // determine userId: prefer prop, otherwise try to decode from token
    const decoded = token ? parseJwt(token) : null;
    const tokenUserId = decoded?.sub ?? decoded?.nameid ?? decoded?.name ?? null;
    const userId = propUserId ?? tokenUserId;

    if (!token && userId) {
      url = `${backendHost}/Notification?user=${encodeURIComponent(userId)}`;
    }

    console.log("[Notification] Using userId:", userId, " url:", url);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => token || null,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // expose for manual testing from console
    window.signalRConnection = connection;
    connectionRef.current = connection;

    // register incoming handler BEFORE starting
    connection.on("NotifyReportStatus", (payload) => {
      console.log("NotifyReportStatus payload:", payload);
      const messageText = payload?.Message ?? payload?.message ?? `Report ${payload?.reportId ?? ""} -> ${payload?.status ?? ""}`;
      const title = payload?.title ?? "Updating Report Status";
      const id = `${payload?.reportId ?? "r"}-${Date.now()}`;
      setNotifications((prev) => [
        ...prev,
        { id, reportId: payload?.reportId, status: payload?.status, title, message: messageText },
      ]);
    });

    // helper - invoke server method to add this connection to group
    const addToUserGroup = async (uid) => {
      if (!connection) return;
      if (!uid) {
        console.warn("[Notification] No userId available to add to group");
        return;
      }
      try {
        console.log("[Notification] About to invoke NotifyCitizen with userId:", uid);
        await connection.invoke("NotifyCitizen", uid);
        console.log("[Notification] Invoked NotifyCitizen for user", uid);
      } catch (err) {
        console.error("[Notification] Failed to invoke NotifyCitizen:", err);
      }
    };

    let stopped = false;
    async function start() {
      try {
        await connection.start();
        if (stopped) return;
        console.log("[Notification] SignalR connected:", connection.connectionId);
        await addToUserGroup(userId);
      } catch (err) {
        console.error("[Notification] SignalR connection error:", err);
        // retry after delay
        setTimeout(() => {
          if (!stopped) start();
        }, 2000);
      }
    }
    start();

    // when reconnected, re-register to group
    connection.onreconnected((connectionId) => {
      console.log("[Notification] reconnected:", connectionId);
      addToUserGroup(userId);
    });

    // cleanup
    return () => {
      stopped = true;
      try {
        connection.off("NotifyReportStatus");
        connection.onreconnected(() => {});
        connection.stop().catch(() => {});
      } catch (e) {
        console.warn("[Notification] cleanup error", e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, propUserId]);

  const handleClose = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="notification-wrapper">
      {notifications.map((n) => (
        <Notification key={n.id} message={`${n.title ? n.title + " - " : ""}${n.message}`} type="info" duration={5000} onClose={() => handleClose(n.id)} />
      ))}
    </div>
  );
};

export default NotificationContainer;
