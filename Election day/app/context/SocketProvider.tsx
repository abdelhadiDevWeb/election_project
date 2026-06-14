"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getAccessToken } from "@/lib/api";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    // Connect to the socket server
    const socketHost = typeof window !== "undefined" ? `http://${window.location.hostname}:4005` : "http://localhost:4005";
    const socketInstance = io(socketHost, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
      setIsConnected(false);
    });

    socketInstance.on("election:status_changed", (data: { isOpen: boolean }) => {
      if (!data.isOpen) {
        // Election is closed! Force logout.
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
        // Clear tokens and state
        logout().then(() => {
          window.location.href = "/login?reason=closed";
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("election:status_changed");
      socketInstance.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
