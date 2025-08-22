"use client";

import { ConnectionState } from "revolt.js";
import { client } from "@/lib/revolt";
import { connectionMonitor } from "./connection-monitor";
import { redirectToLogin, saveRedirectPath, redirectToHome } from "./redirect";

const SESSION_STORAGE_KEY = "revolt-session";

/**
 * Save session to localStorage
 */
function saveSession(session: any): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (error) {
    console.warn("Failed to save session to localStorage:", error);
  }
}

/**
 * Load session from localStorage
 */
function loadSession(): any | null {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  } catch (error) {
    console.warn("Failed to load session from localStorage:", error);
  }
  return null;
}

/**
 * Clear session from localStorage
 */
function clearSession(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to clear session from localStorage:", error);
  }
}

/**
 * Restore session if available
 */
export async function restoreSession(): Promise<boolean> {
  const session = loadSession();
  if (!session || !session.token) {
    console.log("No session to restore");
    return false;
  }

  try {
    console.log("Restoring session from storage...");

    // Check if client is already authenticated with this session
    if (
      client.sessionToken === session.token &&
      client.ready() &&
      client.user
    ) {
      console.log("Session already restored and ready");
      return true;
    }

    // Helper to extract message from unknown error values
    const getErrorMessage = (err: unknown): string => {
      if (typeof err === "string") return err;
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        return (err as { message: string }).message;
      }
      try {
        return String(err);
      } catch {
        return "Unknown error";
      }
    };

    // If client has different session, we need to restore
    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("Session restore timeout after 10 seconds");
        cleanup();
        // Don't clear session immediately - might be connectivity issue
        resolve(false);
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        client.off("ready", handleReady);
        client.off("error", handleError);
        client.off("connecting", handleConnecting);
        client.off("connected", handleConnected);
        client.off("disconnected", handleDisconnected);
      };

      const handleReady = () => {
        console.log(
          "✅ Session restore successful - client ready with user data",
        );
        // Verify we got the right user for this session
        if (client.user && client.sessionToken) {
          console.log(
            `Restored user: ${client.user.username} (${client.user.id})`,
          );
          // If the user is currently on the login or root page, redirect them into the app
          try {
            if (typeof window !== "undefined") {
              const path = window.location.pathname;
              if (path === "/" || path === "/login") {
                // Prefer the redirect helper to keep behaviour consistent
                try {
                  redirectToHome();
                } catch {
                  // Fallback to direct navigation if helper fails
                  window.location.href = "/app/home";
                }
              }
            }
          } catch (e) {
            // Ignore any errors while attempting to redirect
          }
          cleanup();
          resolve(true);
        } else {
          console.warn("Client ready but missing user data");
          cleanup();
          clearSession();
          resolve(false);
        }
      };

      const handleConnecting = () => {
        console.log("🔄 Session restore: WebSocket connecting...");
      };

      const handleConnected = () => {
        console.log(
          "✅ Session restore: WebSocket connected, waiting for authentication...",
        );
        debugConnectionStatus();
      };

      const handleDisconnected = () => {
        console.log("❌ Session restore: WebSocket disconnected");
      };

      const handleError = (err: unknown) => {
        console.error("❌ Session restore error:", err);

        const message = getErrorMessage(err).toLowerCase();
        // If it's a session-related error, clear the invalid session
        if (
          message.includes("session") ||
          message.includes("401") ||
          message.includes("403")
        ) {
          console.log("Invalid session detected, clearing stored session");
          clearSession();
        }

        cleanup();
        resolve(false);
      };

      // Set up event listeners before attempting restore
      client.on("ready", handleReady);
      client.on("error", handleError);
      client.on("connecting", handleConnecting);
      client.on("connected", handleConnected);
      client.on("disconnected", handleDisconnected);

      // Attempt to use the stored session
      try {
        console.log("Setting up session and initiating connection...");

        const clientAsWithFn = client as unknown as {
          useExistingSession?: (s: unknown) => unknown | Promise<unknown>;
        };

        const assignSessionFallback = (): Promise<void> => {
          try {
            // Assign token/id directly so we can attempt a reconnect
            (client as unknown as Record<string, unknown>).sessionToken =
              session.token;
            if (session._id || session.id) {
              (client as unknown as Record<string, unknown>).sessionId =
                session._id || session.id;
            }
            console.log("Assigned session token/id manually (fallback)");
            return Promise.resolve();
          } catch (assignErr) {
            console.error("Fallback session assignment failed:", assignErr);
            cleanup();
            clearSession();
            // resolve(false) here to ensure the outer promise is fulfilled
            resolve(false);
            return Promise.reject(assignErr);
          }
        };

        const useExistingFn = clientAsWithFn.useExistingSession;
        const assignPromise: Promise<void> =
          typeof useExistingFn === "function"
            ? // If function returns a Promise or throws, handle both
              Promise.resolve()
                .then(() => useExistingFn.call(client, session))
                .then(() => undefined)
                .catch((err) => {
                  console.warn(
                    "useExistingSession call failed, falling back to manual session assign:",
                    err,
                  );
                  return assignSessionFallback();
                })
            : assignSessionFallback();

        assignPromise
          .then(() => {
            // Only connect if not already connecting/connected
            const currentState = client.events.state();
            if (
              currentState === ConnectionState.Idle ||
              currentState === ConnectionState.Disconnected
            ) {
              // Ensure server configuration is loaded so file/attachment URLs are available
              const cfgPromise = client.configuration
                ? Promise.resolve()
                : client.api
                    .get("/")
                    .then((cfg) => {
                      client.configuration = cfg;
                      console.log("Configuration fetched");
                    })
                    .catch((cfgErr: unknown) => {
                      console.warn(
                        "Failed to fetch configuration before connect:",
                        cfgErr,
                      );
                      // Continue to connect even if config fetch fails
                    });

              cfgPromise
                .then(() => {
                  try {
                    client.connect();
                    console.log("Session restore: connection initiated");
                  } catch (connectErr) {
                    console.error(
                      "Failed to initiate session restore connection:",
                      connectErr,
                    );
                    cleanup();
                    clearSession();
                    resolve(false);
                  }
                })
                .catch((cfgErr) => {
                  // This catch is defensive; errors are handled above
                  console.warn(
                    "Unexpected error fetching configuration:",
                    cfgErr,
                  );
                });
            } else {
              console.log(
                `Session restore: connection already in progress (${currentState})`,
              );
            }

            debugConnectionStatus();
          })
          .catch((assignErr) => {
            console.error(
              "Failed to initiate session restore connection:",
              assignErr,
            );
            cleanup();
            clearSession();
            resolve(false);
          });
      } catch (connectError) {
        console.error(
          "Failed to initiate session restore connection:",
          connectError,
        );
        cleanup();
        clearSession();
        resolve(false);
      }
    });
  } catch (error) {
    console.error("Session restore setup failed:", error);
    clearSession();
    return false;
  }
}

/**
 * Log in with credentials and save session
 */
export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<void> {
  console.log("Starting login process...");

  // Start connection monitoring
  connectionMonitor.start();

  // Set up event listeners before login to catch connection events
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error(
        "Login timeout - client didn't become ready within 15 seconds",
      );
      cleanup();
      reject(new Error("Connection timeout - please try again"));
    }, 15000); // 15 second timeout

    const cleanup = () => {
      clearTimeout(timeout);
      client.off("ready", handleReady);
      client.off("error", handleError);
      client.off("connecting", handleConnecting);
      client.off("connected", handleConnected);
    };

    const handleReady = () => {
      console.log("Client ready event received");
      debugConnectionStatus();

      // Save session for next time
      if (client.sessionToken) {
        saveSession({
          token: client.sessionToken,
          _id: client.sessionId,
        });
        console.log("Session saved to localStorage");
      }

      cleanup();
      console.log("✅ Login successful - client is ready with user data");
      resolve();
    };

    const handleConnecting = () => {
      console.log("WebSocket connecting...");
      debugConnectionStatus();
    };

    const handleConnected = () => {
      console.log("✅ WebSocket connected, waiting for ready event...");
      debugConnectionStatus();
    };

    const handleError = (error: any) => {
      console.error("Client error during login:", error);
      debugConnectionStatus();
      cleanup();
      reject(new Error(`Connection failed: ${error.message || error}`));
    };

    // Listen to all relevant events BEFORE calling login
    client.on("ready", handleReady);
    client.on("error", handleError);
    client.on("connecting", handleConnecting);
    client.on("connected", handleConnected);

    // Step 1: Validate client state before login
    const validation = validateClientState();
    if (!validation.valid) {
      console.warn("Client validation issues:", validation.issues);
    }

    // Step 3: Call login API (this will also call connect() internally)
    client
      .login({
        email,
        password,
        friendly_name: "Reflect",
      })
      .then(() => {
        console.log(
          "✅ Login API call successful - WebSocket connection should start automatically",
        );
        debugConnectionStatus();

        // The client.login() method should automatically call connect()
        // If it doesn't connect within 2 seconds, something is wrong
        setTimeout(() => {
          const currentState = client.events.state();
          if (currentState === ConnectionState.Idle) {
            console.warn(
              "⚠️ WebSocket not connecting automatically, forcing connect...",
            );
            try {
              client.connect();
            } catch (connectError) {
              console.error("❌ Failed to force connect:", connectError);
            }
          }
        }, 2000);
      })
      .catch((error) => {
        console.error("Login API call failed:", error);
        debugConnectionStatus();
        cleanup();
        reject(new Error(`Login failed: ${error.message || error}`));
      });
  });
}

/**
 * Debug WebSocket connection status
 */
function debugConnectionStatus(): void {
  const state = client.events.state();
  const stateNames = {
    [ConnectionState.Idle]: "Idle",
    [ConnectionState.Connecting]: "Connecting",
    [ConnectionState.Connected]: "Connected",
    [ConnectionState.Disconnected]: "Disconnected",
  };

  console.log("🔍 === Connection Debug ===");
  console.log("Session token:", !!client.sessionToken);
  console.log("Session ID:", client.sessionId);
  console.log("User object:", !!client.user);
  console.log("User ID:", client.user?.id);
  console.log("Ready state:", client.ready());
  console.log("Connection state:", stateNames[state] || state);
  console.log("Configuration loaded:", !!client.configuration);
  console.log("WebSocket URL:", client.configuration?.ws || "not loaded");
  console.log("API Base URL:", client.api ? "configured" : "not configured");
  console.log("========================");
}

/**
 * Validate client configuration and session
 */
function validateClientState(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!client.configuration) {
    issues.push("No client configuration loaded");
  }

  if (!client.configuration?.ws) {
    issues.push("No WebSocket URL in configuration");
  }

  if (!client.sessionToken) {
    issues.push("No session token available");
  }

  if (!client.sessionId) {
    issues.push("No session ID available");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Comprehensive session cleanup utility
 */
function destroySession(): void {
  try {
    // Clear user data completely
    client.user = undefined;

    // Clear session token and session ID
    client.sessionToken = undefined;

    // Clear internal session reference (try different possible property names)
    try {
      (client as any)._session = undefined;
    } catch {}

    try {
      (client as any).session = undefined;
    } catch {}

    // Reset client ready state
    try {
      (client as any)._setReady?.(false);
    } catch {}

    // Clear stored session from localStorage
    clearSession();

    // Clear any additional session storage
    if (typeof window !== "undefined") {
      try {
        // Clear session storage
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem("revolt-token");
        sessionStorage.removeItem("revolt-session");
        sessionStorage.removeItem("revolt-user");

        // Clear local storage variants
        localStorage.removeItem("revolt-token");
        localStorage.removeItem("revolt-user");
        localStorage.removeItem("revolt-session-data");
        localStorage.removeItem("revolt_session");

        // Clear any other potential revolt-related keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("revolt")) {
            keysToRemove.push(key);
          }
        }

        for (const key of keysToRemove) {
          localStorage.removeItem(key);
        }
      } catch (storageError) {
        console.warn("Failed to clear storage:", storageError);
      }
    }

    // Note: Collections don't have clear methods, they are managed internally by the client
  } catch (error) {
    console.warn("Error during session destruction:", error);
  }
}

/**
 * Log out the current user and clean up the session
 */
export async function logout(shouldRedirect = true): Promise<void> {
  try {
    // Try to call logout API endpoint if we have a session
    if (client.sessionToken) {
      try {
        await client.api.post("/auth/session/logout");
      } catch (apiError) {
        console.warn("Failed to logout via API:", apiError);
        // Continue with local cleanup even if API call fails
      }
    }

    // Disconnect from WebSocket first
    try {
      client.events.disconnect();
    } catch (disconnectError) {
      console.warn("Failed to disconnect WebSocket:", disconnectError);
    }

    // Perform comprehensive session cleanup
    destroySession();

    // Emit logout event to notify components
    client.emit("logout");

    console.log("User logged out and session destroyed successfully");

    // Redirect to login page after successful logout
    if (shouldRedirect && typeof window !== "undefined") {
      // Save current path before redirect (if it was a protected route)
      saveRedirectPath();

      // Use setTimeout to ensure all cleanup is complete before redirect
      setTimeout(() => {
        redirectToLogin();
      }, 100);
    }
  } catch (error) {
    console.error("Error during logout:", error);
    // Still perform local cleanup even if there's an error
    destroySession();
    client.emit("logout");

    // Still redirect on error if requested
    if (shouldRedirect && typeof window !== "undefined") {
      setTimeout(() => {
        redirectToLogin();
      }, 100);
    }
  }
}

/**
 * Force logout without API calls - use when connection is broken
 */
export function forceLogout(shouldRedirect = true): void {
  try {
    console.log("Force logout initiated");

    // Disconnect from WebSocket immediately
    try {
      client.events.disconnect();
    } catch {}

    // Perform comprehensive session cleanup
    destroySession();

    // Emit logout event to notify components
    client.emit("logout");

    console.log("Force logout completed");

    // Redirect to login page after force logout
    if (shouldRedirect && typeof window !== "undefined") {
      // Save current path before redirect (if it was a protected route)
      saveRedirectPath();

      setTimeout(() => {
        redirectToLogin();
      }, 100);
    }
  } catch (error) {
    console.error("Error during force logout:", error);
    // Still perform cleanup
    destroySession();
    client.emit("logout");

    // Still redirect on error if requested
    if (shouldRedirect && typeof window !== "undefined") {
      setTimeout(() => {
        redirectToLogin();
      }, 100);
    }
  }
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return !!(client.user && client.ready());
}

/**
 * Check if we have a stored session that might be valid
 */
export function hasStoredSession(): boolean {
  const session = loadSession();
  return !!session?.token;
}

/**
 * Check if client is currently connecting
 */
export function isConnecting(): boolean {
  return client.events.state() === ConnectionState.Connecting;
}

/**
 * Get current session status
 */
export function getSessionStatus(): {
  hasUser: boolean;
  hasToken: boolean;
  isReady: boolean;
  isConnected: boolean;
} {
  return {
    hasUser: !!client.user,
    hasToken: !!client.sessionToken,
    isReady: client.ready(),
    isConnected: client.events.state() === ConnectionState.Connected,
  };
}

/**
 * Wait for client to be ready with timeout
 */
export function waitForReady(timeoutMs = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    if (client.ready()) {
      resolve(true);
      return;
    }

    const timeout = setTimeout(() => {
      client.off("ready", handleReady);
      client.off("error", handleError);
      resolve(false);
    }, timeoutMs);

    const handleReady = () => {
      clearTimeout(timeout);
      client.off("ready", handleReady);
      client.off("error", handleError);
      resolve(true);
    };

    const handleError = () => {
      clearTimeout(timeout);
      client.off("ready", handleReady);
      client.off("error", handleError);
      resolve(false);
    };

    client.on("ready", handleReady);
    client.on("error", handleError);
  });
}

/**
 * Check if client is fully connected and ready
 */
export function isClientReady(): boolean {
  return !!(
    client.user &&
    client.ready() &&
    client.events.state() === ConnectionState.Connected
  );
}

/**
 * Test WebSocket connection by attempting to connect
 */
export async function testWebSocketConnection(): Promise<{
  success: boolean;
  error?: string;
  steps: string[];
}> {
  const steps: string[] = [];

  try {
    steps.push("Starting connection test...");

    // Check if already connected
    if (isClientReady()) {
      steps.push("Already connected and ready");
      return { success: true, steps };
    }

    // Check configuration
    if (!client.configuration) {
      steps.push("No configuration - fetching...");
      await client.api.get("/");
    }

    const wsUrl = client.configuration?.ws;
    if (!wsUrl) {
      steps.push("ERROR: No WebSocket URL in configuration");
      return { success: false, error: "No WebSocket URL", steps };
    }

    steps.push(`WebSocket URL: ${wsUrl}`);

    // Check session
    if (!client.sessionToken) {
      steps.push("ERROR: No session token available");
      return { success: false, error: "No session token", steps };
    }

    steps.push("Session token found");

    // Test actual WebSocket connection
    steps.push("Testing WebSocket connectivity...");

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        steps.push("TIMEOUT: Connection test failed");
        resolve({ success: false, error: "Connection timeout", steps });
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        client.off("connected", handleConnected);
        client.off("ready", handleReady);
        client.off("error", handleError);
      };

      const handleConnected = () => {
        steps.push("✅ WebSocket connected");
      };

      const handleReady = () => {
        steps.push("✅ Client ready with user data");
        cleanup();
        resolve({ success: true, steps });
      };

      const handleError = (error: any) => {
        steps.push(`❌ Connection error: ${error?.message || error}`);
        cleanup();
        resolve({
          success: false,
          error: error?.message || "Connection failed",
          steps,
        });
      };

      // Set up event listeners
      client.on("connected", handleConnected);
      client.on("ready", handleReady);
      client.on("error", handleError);

      // Trigger connection
      try {
        steps.push("Initiating connection...");
        client.connect();
      } catch (connectError) {
        steps.push(`❌ Failed to initiate connection: ${connectError}`);
        cleanup();
        resolve({
          success: false,
          error: `Failed to connect: ${connectError}`,
          steps,
        });
      }
    });
  } catch (error) {
    steps.push(`❌ Test setup failed: ${error}`);
    return {
      success: false,
      error: `Test setup failed: ${error}`,
      steps,
    };
  }
}
