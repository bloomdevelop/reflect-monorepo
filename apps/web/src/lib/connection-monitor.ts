"use client";

import { useEffect, useState } from "react";
import { ConnectionState } from "revolt.js";
import { client } from "@/lib/revolt";

export interface ConnectionEvent {
	timestamp: Date;
	event: string;
	details?: any;
	connectionState?: ConnectionState;
	hasUser?: boolean;
	hasToken?: boolean;
	isReady?: boolean;
}

class ConnectionMonitor {
	private events: ConnectionEvent[] = [];
	private listeners: ((event: ConnectionEvent) => void)[] = [];
	private isActive = false;

	start() {
		if (this.isActive) return;
		this.isActive = true;
		this.events = [];

		this.log("MONITOR_START", "Connection monitoring started");

		// Listen to all connection events
		client.on("connecting", this.handleConnecting);
		client.on("connected", this.handleConnected);
		client.on("disconnected", this.handleDisconnected);
		client.on("ready", this.handleReady);
		client.on("error", this.handleError);
		client.on("logout", this.handleLogout);

		console.log("🔍 Connection monitor started");
	}

	stop() {
		if (!this.isActive) return;
		this.isActive = false;

		// Remove all event listeners
		client.off("connecting", this.handleConnecting);
		client.off("connected", this.handleConnected);
		client.off("disconnected", this.handleDisconnected);
		client.off("ready", this.handleReady);
		client.off("error", this.handleError);
		client.off("logout", this.handleLogout);

		this.log("MONITOR_STOP", "Connection monitoring stopped");
		console.log("🔍 Connection monitor stopped");
	}

	private handleConnecting = () => {
		this.log("CONNECTING", "WebSocket connection initiating");
	};

	private handleConnected = () => {
		this.log("CONNECTED", "WebSocket connection established");
	};

	private handleDisconnected = () => {
		this.log("DISCONNECTED", "WebSocket connection lost");
	};

	private handleReady = () => {
		this.log("READY", "Client ready - user data received", {
			userId: client.user?.id,
			username: client.user?.username,
		});
	};

	private handleError = (error: any) => {
		this.log("ERROR", "Connection error occurred", {
			error: error?.message || error,
		});
	};

	private handleLogout = () => {
		this.log("LOGOUT", "User logged out");
	};

	private log(event: string, details?: any, extra?: any) {
		const connectionEvent: ConnectionEvent = {
			timestamp: new Date(),
			event,
			details,
			connectionState: client.events.state(),
			hasUser: !!client.user,
			hasToken: !!client.sessionToken,
			isReady: client.ready(),
			...extra,
		};

		this.events.push(connectionEvent);

		// Notify listeners
		for (const listener of this.listeners) {
			listener(connectionEvent);
		}

		// Console log with emoji for easy identification
		const emoji = this.getEventEmoji(event);
		console.log(`${emoji} [${event}]`, details || "", {
			state: client.events.state(),
			ready: client.ready(),
			user: !!client.user,
			token: !!client.sessionToken,
		});
	}

	private getEventEmoji(event: string): string {
		const emojiMap: { [key: string]: string } = {
			MONITOR_START: "🔍",
			MONITOR_STOP: "⏹️",
			CONNECTING: "🔄",
			CONNECTED: "✅",
			DISCONNECTED: "❌",
			READY: "🚀",
			ERROR: "🚨",
			LOGOUT: "👋",
		};
		return emojiMap[event] || "📡";
	}

	getEvents(): ConnectionEvent[] {
		return [...this.events];
	}

	getLatestEvent(): ConnectionEvent | null {
		return this.events.length > 0 ? this.events[this.events.length - 1] : null;
	}

	clearEvents() {
		this.events = [];
	}

	onEvent(listener: (event: ConnectionEvent) => void): () => void {
		this.listeners.push(listener);
		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}

	getCurrentStatus() {
		return {
			connectionState: client.events.state(),
			connectionStateString: this.getConnectionStateString(
				client.events.state(),
			),
			hasUser: !!client.user,
			hasToken: !!client.sessionToken,
			isReady: client.ready(),
			sessionId: client.sessionId,
			wsUrl: client.configuration?.ws,
			isActive: this.isActive,
			eventCount: this.events.length,
			lastEvent: this.getLatestEvent(),
		};
	}

	private getConnectionStateString(state: ConnectionState): string {
		switch (state) {
			case ConnectionState.Idle:
				return "Idle";
			case ConnectionState.Connecting:
				return "Connecting";
			case ConnectionState.Connected:
				return "Connected";
			case ConnectionState.Disconnected:
				return "Disconnected";
			default:
				return "Unknown";
		}
	}

	// Test connection by attempting to connect and monitoring the process
	async testConnection(): Promise<{
		success: boolean;
		events: ConnectionEvent[];
		error?: string;
	}> {
		this.clearEvents();
		this.start();

		return new Promise((resolve) => {
			const timeout = setTimeout(() => {
				const events = this.getEvents();
				const success = events.some((e) => e.event === "READY");
				resolve({
					success,
					events,
					error: success ? undefined : "Connection timeout",
				});
			}, 10000);

			const unsubscribe = this.onEvent((event) => {
				if (event.event === "READY") {
					clearTimeout(timeout);
					unsubscribe();
					resolve({
						success: true,
						events: this.getEvents(),
					});
				} else if (event.event === "ERROR") {
					clearTimeout(timeout);
					unsubscribe();
					resolve({
						success: false,
						events: this.getEvents(),
						error: event.details?.error || "Connection failed",
					});
				}
			});
		});
	}

	// Get a formatted log for debugging
	getFormattedLog(): string {
		return this.events
			.map((event) => {
				const timestamp = event.timestamp.toISOString().slice(11, 23);
				const state = this.getConnectionStateString(
					event.connectionState || ConnectionState.Idle,
				);
				const flags = [
					event.hasUser ? "U" : "-",
					event.hasToken ? "T" : "-",
					event.isReady ? "R" : "-",
				].join("");

				return `[${timestamp}] ${event.event.padEnd(12)} ${state.padEnd(12)} [${flags}] ${event.details || ""}`;
			})
			.join("\n");
	}
}

// Global monitor instance
export const connectionMonitor = new ConnectionMonitor();

// Hook for React components
export function useConnectionMonitor() {
	const [events, setEvents] = useState<ConnectionEvent[]>([]);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const unsubscribe = connectionMonitor.onEvent(() => {
			setEvents(connectionMonitor.getEvents());
		});

		setEvents(connectionMonitor.getEvents());
		setIsActive(connectionMonitor.getCurrentStatus().isActive);

		return unsubscribe;
	}, []);

	const start = () => {
		connectionMonitor.start();
		setIsActive(true);
	};

	const stop = () => {
		connectionMonitor.stop();
		setIsActive(false);
	};

	const clear = () => {
		connectionMonitor.clearEvents();
		setEvents([]);
	};

	const test = () => connectionMonitor.testConnection();

	return {
		events,
		isActive,
		start,
		stop,
		clear,
		test,
		getCurrentStatus: () => connectionMonitor.getCurrentStatus(),
		getFormattedLog: () => connectionMonitor.getFormattedLog(),
	};
}

// Auto-start monitor in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
	connectionMonitor.start();
}
