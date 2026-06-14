// ────────────────────────────────────────────────────────────────
// Socket.IO client hook for real-time events.
// Connects with JWT auth, auto-reconnects, and provides
// event listeners for live dashboard updates.
// ────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/api";

export interface SocketEvent {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  detail?: string;
  location?: string;
  time: string;
  timestamp: number;
}

export function useSocket(options?: { playSound?: boolean }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<SocketEvent[]>([]);

  const playAudioNotification = useCallback((type: string) => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === "reclamation") {
        // 3-second alert sound (pulsating siren)
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.5);
        oscillator.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 1.0);
        oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 1.5);
        oscillator.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 2.0);
        oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 2.5);
        oscillator.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 3.0);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 3.0);
      } else {
        // 1-second simple beep
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 1.0);
      }
    } catch (err) {
      console.error("Audio playback failed", err);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken() || localStorage.getItem("pvp_token");
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connected", (data) => {
      console.log("[Socket] Connected:", data);
    });

    // Listen for real-time notification events
    socket.on("notification", (data: any) => {
      if (options?.playSound) {
        playAudioNotification(data.type);
      }
      
      const event: SocketEvent = {
        id: data._id || data.id || String(Date.now()),
        type: data.type === "alert" ? "warning" : data.type === "error" ? "warning" : "success",
        title: data.title || "New Notification",
        detail: data.body || "",
        location: data.location || "",
        time: formatTimeAgo(new Date(data.createdAt || Date.now())),
        timestamp: Date.now(),
      };
      setEvents((prev) => [event, ...prev].slice(0, 20));
    });

    // Listen for result submissions
    socket.on("result:new", (data: any) => {
      const event: SocketEvent = {
        id: String(Date.now()),
        type: "success",
        title: "New PV Submitted",
        detail: `Desk ${data.desk_number || "N/A"}`,
        location: data.center_name || "",
        time: "Just now",
        timestamp: Date.now(),
      };
      setEvents((prev) => [event, ...prev].slice(0, 20));
    });

    // Listen for status changes
    socket.on("result:status_changed", (data: any) => {
      const event: SocketEvent = {
        id: String(Date.now()),
        type: data.status === "approved" ? "success" : data.status === "rejected" ? "warning" : "info",
        title: `PV ${data.status === "approved" ? "Approved" : data.status === "rejected" ? "Rejected" : "Updated"}`,
        detail: data.detail || "",
        time: "Just now",
        timestamp: Date.now(),
      };
      setEvents((prev) => [event, ...prev].slice(0, 20));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { isConnected, events, emit, socket: socketRef.current };
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
