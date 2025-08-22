"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useLog } from "@/app/hooks/useLogContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import {
	getSessionStatus,
	isClientReady,
	testWebSocketConnection,
} from "@/lib/auth";

export default function DebugPage() {
	const { logs, addLog } = useLog();
	const { user, isLoading, isReady, isConnected, logout, forceLogout } =
		useUser();
	const logIdRef = useRef(1);
	const sessionStatus = getSessionStatus();
	const clientReady = isClientReady();
	const [testing, setTesting] = useState(false);
	const id = useId();

	function handleTestLog() {
		addLog(`Test log #${logIdRef.current}`);
		logIdRef.current++;
	}

	const handleLogout = async () => {
		addLog("Logging out...");
		await logout(true); // Will redirect to login
		addLog("Logged out successfully - should redirect to login");
	};

	const handleLogoutNoRedirect = async () => {
		addLog("Logging out without redirect...");
		await logout(false); // Won't redirect
		addLog("Logged out without redirect");
	};

	const handleForceLogout = () => {
		addLog("Force logging out...");
		forceLogout(true); // Will redirect to login
		addLog("Force logout completed - should redirect to login");
	};

	const handleForceLogoutNoRedirect = () => {
		addLog("Force logging out without redirect...");
		forceLogout(false); // Won't redirect
		addLog("Force logout without redirect completed");
	};

	const handleTestConnection = async () => {
		if (testing) return;

		setTesting(true);
		addLog("Starting WebSocket connection test...");

		try {
			const result = await testWebSocketConnection();

			addLog("=== Connection Test Results ===");
			for (const step of result.steps) {
				addLog(step);
			}

			if (result.success) {
				addLog("✅ Connection test PASSED");
			} else {
				addLog(`❌ Connection test FAILED: ${result.error}`);
			}
			addLog("=== End Connection Test ===");
		} catch (error) {
			addLog(`❌ Connection test error: ${error}`);
		} finally {
			setTesting(false);
		}
	};

	return (
		<div className="p-4 space-y-6">
			<h1 className="text-4xl font-bold">Debug</h1>
			<Separator />

			{/* Navigation Tools */}
			<div className="flex flex-wrap gap-2">
				<Link href="/login">
					<Button>Login</Button>
				</Link>
				<Link href="/settings">
					<Button>Open Settings</Button>
				</Link>
				<Link href="/">
					<Button>Home</Button>
				</Link>
				<Link href="/profile">
					<Button>Profile</Button>
				</Link>
				<Button variant="secondary" onClick={handleTestLog}>
					Add Test Log
				</Button>
				<Button
					variant="outline"
					onClick={handleTestConnection}
					disabled={testing}
				>
					{testing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
					Test Connection
				</Button>
			</div>

			{/* Logout Options */}
			<Card>
				<CardHeader>
					<CardTitle>Logout Testing</CardTitle>
					<CardDescription>Test different logout scenarios</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="destructive"
							onClick={handleLogout}
							disabled={!user}
						>
							Logout (→ Login)
						</Button>
						<Button
							variant="destructive"
							onClick={handleLogoutNoRedirect}
							disabled={!user}
						>
							Logout (No Redirect)
						</Button>
						<Button
							variant="destructive"
							onClick={handleForceLogout}
							disabled={!user}
						>
							Force Logout (→ Login)
						</Button>
						<Button
							variant="destructive"
							onClick={handleForceLogoutNoRedirect}
							disabled={!user}
						>
							Force Logout (No Redirect)
						</Button>
					</div>

					<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
							Logout Options:
						</h4>
						<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
							<li>
								• <strong>Logout (→ Login):</strong> Normal logout + redirect to
								login page
							</li>
							<li>
								• <strong>Logout (No Redirect):</strong> Normal logout without
								redirect
							</li>
							<li>
								• <strong>Force Logout (→ Login):</strong> Immediate cleanup +
								redirect
							</li>
							<li>
								• <strong>Force Logout (No Redirect):</strong> Immediate cleanup
								without redirect
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* User Authentication Status */}
			<Card>
				<CardHeader>
					<CardTitle>User Authentication Status</CardTitle>
					<CardDescription>
						Real-time authentication state using the useUser hook
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap gap-2">
						<Badge variant={isLoading ? "secondary" : "outline"}>
							Loading: {isLoading ? "Yes" : "No"}
						</Badge>
						<Badge variant={isReady ? "default" : "outline"}>
							Ready: {isReady ? "Yes" : "No"}
						</Badge>
						<Badge variant={isConnected ? "default" : "outline"}>
							Connected: {isConnected ? "Yes" : "No"}
						</Badge>
						<Badge variant={clientReady ? "default" : "outline"}>
							Client Ready: {clientReady ? "Yes" : "No"}
						</Badge>
						<Badge variant={user ? "default" : "destructive"}>
							User: {user ? "Authenticated" : "Not logged in"}
						</Badge>
					</div>

					<div className="mt-3 p-3 bg-muted/50 rounded-lg">
						<h4 className="font-semibold mb-2">Detailed Status:</h4>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div>Has User: {sessionStatus.hasUser ? "✓" : "✗"}</div>
							<div>Has Token: {sessionStatus.hasToken ? "✓" : "✗"}</div>
							<div>Is Ready: {sessionStatus.isReady ? "✓" : "✗"}</div>
							<div>Is Connected: {sessionStatus.isConnected ? "✓" : "✗"}</div>
						</div>
					</div>

					{user && (
						<div className="p-3 bg-muted rounded-lg">
							<h4 className="font-semibold mb-2">User Information:</h4>
							<div className="text-sm space-y-1">
								<div>
									<strong>Username:</strong> {user.username}
								</div>
								<div>
									<strong>Display Name:</strong> {user.displayName || "None"}
								</div>
								<div>
									<strong>ID:</strong> {user.id}
								</div>
								{user.discriminator && (
									<div>
										<strong>Discriminator:</strong> {user.discriminator}
									</div>
								)}
							</div>
						</div>
					)}

					<div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
						<h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
							Connection Debugging:
						</h4>
						<p className="text-sm text-amber-800 dark:text-amber-200">
							If you're having connection issues, click "Test Connection" to run
							diagnostics. The test will attempt to establish a WebSocket
							connection and report each step.
						</p>
					</div>

					<p className="text-sm text-muted-foreground">
						This component automatically updates when you log in or out. Try
						logging in from the login page and watch this status change in
						real-time!
					</p>
				</CardContent>
			</Card>

			{/* Logs Section */}
			<div>
				<h2 className="text-2xl font-semibold mb-2">Logs</h2>
				<div className="bg-neutral-900 text-neutral-100 rounded p-4 max-h-64 overflow-y-auto text-sm font-mono border border-neutral-700">
					{logs.map((log) => (
						<div key={id}>{log}</div>
					))}
				</div>
			</div>
		</div>
	);
}
