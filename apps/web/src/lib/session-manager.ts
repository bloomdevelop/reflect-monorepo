"use client";

import { client } from "@/lib/revolt";
import { restoreSession, hasStoredSession } from "@/lib/auth";
import { ConnectionState } from "revolt.js";

export interface SessionInitResult {
	success: boolean;
	hasUser: boolean;
	isReady: boolean;
	needsLogin: boolean;
	error?: string;
}

class SessionManager {
	private initialized = false;
	private initPromise: Promise<SessionInitResult> | null = null;

	/**
	 * Initialize session on app startup
	 */
	async initialize(): Promise<SessionInitResult> {
		// Return existing promise if already initializing
		if (this.initPromise) {
			return this.initPromise;
		}

		// Return cached result if already initialized
		if (this.initialized) {
			return this.getCurrentStatus();
		}

		console.log("🚀 SessionManager: Starting initialization");

		this.initPromise = this.performInitialization();
		const result = await this.initPromise;
		this.initialized = true;

		return result;
	}

	private async performInitialization(): Promise<SessionInitResult> {
		try {
			// Step 1: Check if client is already ready
			if (client.ready() && client.user) {
				console.log("✅ SessionManager: Client already ready with user data");
				return {
					success: true,
					hasUser: true,
					isReady: true,
					needsLogin: false,
				};
			}

			// Step 2: Check if we have a stored session
			if (!hasStoredSession()) {
				console.log("📭 SessionManager: No stored session found");
				return {
					success: true,
					hasUser: false,
					isReady: false,
					needsLogin: true,
				};
			}

			// Step 3: Attempt to restore session
			console.log("🔄 SessionManager: Attempting session restoration");
			const restored = await restoreSession();

			if (restored) {
				console.log("✅ SessionManager: Session restored successfully");
				return {
					success: true,
					hasUser: !!client.user,
					isReady: client.ready(),
					needsLogin: false,
				};
			}

			console.log("SessionManager: Session restoration failed");
			return {
				success: true,
				hasUser: false,
				isReady: false,
				needsLogin: true,
			};
		} catch (error) {
			console.error("❌ SessionManager: Initialization error:", error);
			return {
				success: false,
				hasUser: false,
				isReady: false,
				needsLogin: true,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get current session status
	 */
	getCurrentStatus(): SessionInitResult {
		return {
			success: true,
			hasUser: !!client.user,
			isReady: client.ready(),
			needsLogin: !client.user || !client.ready(),
		};
	}

	/**
	 * Reset initialization state
	 */
	reset(): void {
		this.initialized = false;
		this.initPromise = null;
		console.log("🔄 SessionManager: Reset initialization state");
	}

	/**
	 * Check if initialization is complete
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * Wait for client to be ready with timeout
	 */
	async waitForReady(timeoutMs = 10000): Promise<boolean> {
		if (client.ready() && client.user) {
			return true;
		}

		return new Promise((resolve) => {
			const timeout = setTimeout(() => {
				cleanup();
				resolve(false);
			}, timeoutMs);

			const cleanup = () => {
				clearTimeout(timeout);
				client.off("ready", handleReady);
				client.off("error", handleError);
			};

			const handleReady = () => {
				if (client.user) {
					cleanup();
					resolve(true);
				}
			};

			const handleError = () => {
				cleanup();
				resolve(false);
			};

			client.on("ready", handleReady);
			client.on("error", handleError);
		});
	}

	/**
	 * Get detailed connection info for debugging
	 */
	getConnectionInfo(): {
		hasSession: boolean;
		sessionToken: boolean;
		connectionState: string;
		hasUser: boolean;
		isReady: boolean;
		wsUrl: string | undefined;
	} {
		const state = client.events.state();
		const stateNames = {
			[ConnectionState.Idle]: "Idle",
			[ConnectionState.Connecting]: "Connecting",
			[ConnectionState.Connected]: "Connected",
			[ConnectionState.Disconnected]: "Disconnected",
		};

		return {
			hasSession: hasStoredSession(),
			sessionToken: !!client.sessionToken,
			connectionState: stateNames[state] || `Unknown(${state})`,
			hasUser: !!client.user,
			isReady: client.ready(),
			wsUrl: client.configuration?.ws,
		};
	}
}

// Global session manager instance
export const sessionManager = new SessionManager();

// React hook for session initialization
import { useEffect, useState } from "react";

export function useSessionInit() {
	const [result, setResult] = useState<SessionInitResult | null>(null);
	const [isInitializing, setIsInitializing] = useState(false);

	useEffect(() => {
		let mounted = true;

		const initialize = async () => {
			if (sessionManager.isInitialized()) {
				setResult(sessionManager.getCurrentStatus());
				return;
			}

			setIsInitializing(true);

			try {
				const initResult = await sessionManager.initialize();

				if (mounted) {
					setResult(initResult);
					setIsInitializing(false);
				}
			} catch (error) {
				console.error("Session initialization failed:", error);
				if (mounted) {
					setResult({
						success: false,
						hasUser: false,
						isReady: false,
						needsLogin: true,
						error: error instanceof Error ? error.message : "Unknown error",
					});
					setIsInitializing(false);
				}
			}
		};

		initialize();

		return () => {
			mounted = false;
		};
	}, []);

	return {
		result,
		isInitializing,
		isReady: result?.isReady ?? false,
		hasUser: result?.hasUser ?? false,
		needsLogin: result?.needsLogin ?? true,
		connectionInfo: sessionManager.getConnectionInfo(),
	};
}

// Utility for components that need to wait for session init
export function useWaitForSession() {
	const { result, isInitializing } = useSessionInit();

	const waitForSession = async (timeoutMs = 10000): Promise<boolean> => {
		if (result?.hasUser && result?.isReady) {
			return true;
		}

		return sessionManager.waitForReady(timeoutMs);
	};

	return {
		isSessionReady: result?.hasUser && result?.isReady,
		isInitializing,
		waitForSession,
	};
}
