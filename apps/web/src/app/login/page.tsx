"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { loginWithCredentials } from "@/lib/auth";
import { clearSavedRedirectPath, getRedirectPath } from "@/lib/redirect";
import { client } from "@/lib/revolt";
import { useLog } from "../hooks/useLogContext";

const formSchema = z.object({
	email: z.string(),
	password: z.string(),
});

const MemoizedInput = memo(Input);

export default function LoginPage() {
	const { addLog } = useLog();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [connectionStep, setConnectionStep] = useState<string>("");
	const [progress, setProgress] = useState<number>(0);
	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onChange",
		reValidateMode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Listen to connection events for progress tracking
	useEffect(() => {
		if (!isLoading) return;

		const handleConnecting = () => {
			setConnectionStep("Connecting to server...");
			setProgress(25);
		};

		const handleConnected = () => {
			setConnectionStep("Connected! Authenticating...");
			setProgress(50);
		};

		const handleReady = () => {
			setConnectionStep("Authentication complete!");
			setProgress(100);
			setTimeout(() => {
				setConnectionStep("");
				setProgress(0);
			}, 1000);
		};

		const handleError = () => {
			setConnectionStep("Connection failed");
			setProgress(0);
			setTimeout(() => {
				setConnectionStep("");
			}, 2000);
		};

		client.on("connecting", handleConnecting);
		client.on("connected", handleConnected);
		client.on("ready", handleReady);
		client.on("error", handleError);

		return () => {
			client.off("connecting", handleConnecting);
			client.off("connected", handleConnected);
			client.off("ready", handleReady);
			client.off("error", handleError);
		};
	}, [isLoading]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (isLoading) return; // Prevent double submission
		setIsLoading(true);
		addLog(`Attempting to log in with email: ${values.email}`);

		setConnectionStep("Logging in...");
		setProgress(10);

		toast.promise(
			async () => {
				try {
					addLog("Calling login API...");
					await loginWithCredentials(values.email, values.password);
					addLog(`Login API successful for: ${values.email}`);
					addLog("WebSocket connected and client is ready");

					// Get appropriate redirect path
					const redirectPath = getRedirectPath();
					addLog(`Redirecting to: ${redirectPath}`);

					// Clear any saved redirect path
					clearSavedRedirectPath();

					// Don't set loading false here - let redirect handle it
					return router.push(redirectPath);
				} catch (error) {
					setIsLoading(false);
					setConnectionStep("");
					setProgress(0);

					if (error instanceof Error) {
						addLog(`Login failed: ${error.message}`);
						throw error;
					}
					addLog("An unknown error occurred during login");
					throw new Error("An unknown error occurred");
				}
			},
			{
				loading: "Authenticating...",
				success: "Connected! Redirecting...",
				error: "Failed to connect",
			},
		);
	}

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<Card className="w-full max-w-lg">
				<CardHeader>Let's get logged in</CardHeader>
				<CardContent>
					{isLoading && connectionStep && (
						<div className="mb-6 space-y-3">
							<div className="flex items-center space-x-2">
								<Loader2Icon className="h-4 w-4 animate-spin" />
								<span className="text-sm text-muted-foreground">
									{connectionStep}
								</span>
							</div>
							<Progress value={progress} className="w-full" />
						</div>
					)}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<MemoizedInput
												type="email"
												placeholder="example@domain.com"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<MemoizedInput
												placeholder="example123"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isLoading} className="w-full">
								{isLoading && (
									<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
								)}
								{isLoading ? "Connecting..." : "Log In"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
