"use client";

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
import { client } from "@/lib/revolt";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useLog } from "../hooks/useLogContext";

const formSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export default function LoginPage() {
	const { addLog } = useLog();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		toast.promise(
			async () => {
				addLog(`Attempting to log in with email: ${values.email}`);
				setIsLoading(true);

				try {

					await client
						.login({
							email: values.email,
							password: values.password,
							friendly_name: "Reflect",
						})
						.catch((error) => {
							throw new Error(error);
						});
					addLog(`Logged in successfully with email: ${values.email}`);
					client.connect();
					addLog("Connected to Revolt WebSocket");
					

					setIsLoading(false);
					return router.push("/app/home");
				} catch (error) {
					if (error instanceof Error) {
						toast.error(error.message);
						console.log(error.message);
					} else {
						addLog("An unknown error occurred during login");
						toast.error("An unknown error occurred");
						console.log(error);
					}

					setIsLoading(false);
				}
			},
			{
				loading: "Logging in...",
				success: "Logged in successfully",
				error: "Failed to log in",
			},
		);
	}

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<Card className="w-full max-w-lg">
				<CardHeader>Let's get logged in</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
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
											<Input
												placeholder="example123"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2Icon className="animate-spin" />}
								Log In
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
