"use client";

import { useEffect, useState } from "react";
import type { User } from "revolt.js";
import {
  forceLogout,
  logout as performLogout,
  restoreSession,
  hasStoredSession,
} from "@/lib/auth";
import { client } from "@/lib/revolt";

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  isReady: boolean;
  isConnected: boolean;
  logout: (shouldRedirect?: boolean) => Promise<void>;
  forceLogout: (shouldRedirect?: boolean) => void;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(client.user || null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isReady, setIsReady] = useState(client.ready());
  const [isConnected, setIsConnected] = useState(false);

  // Logout function that destroys session completely
  const logout = async (shouldRedirect = true) => {
    try {
      setIsLoading(true);
      // Perform complete logout and session cleanup
      await performLogout(shouldRedirect);

      // Force clear all local state immediately
      setUser(null);
      setIsReady(false);
      setIsLoading(false);
      setIsConnected(false);
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsReady(false);
      setIsLoading(false);
      setIsConnected(false);
    }
  };

  // Force logout without API calls - for when connection is broken
  const handleForceLogout = (shouldRedirect = true) => {
    try {
      forceLogout(shouldRedirect);
      // Force clear all local state immediately
      setUser(null);
      setIsReady(false);
      setIsLoading(false);
      setIsConnected(false);
    } catch (error) {
      console.error("Error during force logout:", error);
      // Still clear local state
      setUser(null);
      setIsReady(false);
      setIsLoading(false);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Set initial state based on current client state
    setUser(client.user || null);
    setIsReady(client.ready());

    // Check if we already have a ready client
    if (client.ready() && client.user) {
      console.log("Client already ready with user data");
      setIsLoading(false);
      setIsConnected(true);
      return;
    }

    // If there's a stored session on disk, attempt to restore it immediately.
    // This ensures page reloads land back in the app when a valid stored session exists.
    if (hasStoredSession() && !client.ready()) {
      console.log("Stored session present — attempting to restore");
      setIsLoading(true);
      // Attempt restore; let the client's 'ready' event drive state when successful
      restoreSession()
        .then((restored) => {
          if (!restored) {
            console.log("No valid session to restore");
            setIsLoading(false);
          }
          // If restored successfully, the ready event will handle state updates
        })
        .catch((error) => {
          console.error("Failed to restore session:", error);
          setIsLoading(false);
        });
      // Return to allow event handlers to update state once ready
      return;
    }

    // If we have a session token in-memory and are waiting for ready, keep waiting
    if (client.sessionToken && !client.ready()) {
      console.log("Found session token, waiting for client to be ready");
      setIsLoading(true);
      // Don't restore again, just wait for ready event
      return;
    }

    // If there's no session stored and no token, not loading
    if (!client.user && !client.sessionToken) {
      console.log("No session found");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    // Handle ready event - user has successfully logged in
    const handleReady = () => {
      console.log("Client ready event - user authenticated");
      setUser(client.user || null);
      setIsReady(true);
      setIsLoading(false);
      setIsConnected(true);
    };

    // Handle connecting state
    const handleConnecting = () => {
      console.log("Client connecting...");
      setIsLoading(true);
      setIsConnected(false);
    };

    // Handle connected state
    const handleConnected = () => {
      console.log("Client connected, waiting for ready event");
      setIsConnected(true);
      // Keep loading true until ready event if we don't have user data yet
      if (client.ready() && client.user) {
        setIsLoading(false);
      }
    };

    // Handle disconnected state
    const handleDisconnected = () => {
      console.log("Client disconnected");
      setIsLoading(false);
      setIsConnected(false);
      setIsReady(false);
      // Don't clear user data on disconnect - they might reconnect
    };

    // Handle logout
    const handleLogout = () => {
      console.log("User logged out");
      setUser(null);
      setIsReady(false);
      setIsLoading(false);
      setIsConnected(false);
    };

    // Handle user updates
    const handleUserUpdate = (updatedUser: User) => {
      // Only update if this is the current user
      if (client.user && updatedUser.id === client.user.id) {
        setUser(updatedUser);
      }
    };

    // Handle errors
    const handleError = (error: Error) => {
      console.error("Client error:", error);
      setIsLoading(false);
    };

    // Add event listeners
    client.on("ready", handleReady);
    client.on("connecting", handleConnecting);
    client.on("connected", handleConnected);
    client.on("disconnected", handleDisconnected);
    client.on("logout", handleLogout);
    client.on("userUpdate", handleUserUpdate);
    client.on("error", handleError);

    // Cleanup event listeners on unmount
    return () => {
      client.off("ready", handleReady);
      client.off("connecting", handleConnecting);
      client.off("connected", handleConnected);
      client.off("disconnected", handleDisconnected);
      client.off("logout", handleLogout);
      client.off("userUpdate", handleUserUpdate);
      client.off("error", handleError);
    };
  }, []);

  return {
    user,
    isLoading,
    isReady,
    isConnected,
    logout,
    forceLogout: handleForceLogout,
  };
}
