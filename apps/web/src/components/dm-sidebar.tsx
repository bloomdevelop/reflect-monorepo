"use client";

import { client } from "@/lib/revolt";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Channel, User } from "revolt.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import { escape as qEscape } from "node:querystring";

export default function DMSidebar() {
	const [clientReady, setClientReady] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
	const [dms, setDms] = useState<Channel[]>([]);

	useEffect(() => {
		// Check if client is ready and authenticated
		if (!client.sessions) {
			window.location.href = qEscape("/login");
			return;
		}

		const checkClient = () => {
			if (client.ready()) {
				setClientReady(true);
			} else {
				setTimeout(checkClient, 100);
			}
		};
		checkClient();
	}, []);

	useEffect(() => {
		if (!clientReady) return;

		function fetchData() {
			try {
				// Get current user
				const user = client.user;
				if (user) setCurrentUser(user);

				// Get DMs
				const channels = Array.from(client.channels.values());
				const directMessages = channels.filter(
					(channel) => channel.type === "DirectMessage" && channel.active,
				);
				setDms(directMessages);
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [clientReady]);

	return (
		<Sidebar className="flex flex-col h-full" collapsible="none">
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{dms.length === 0 ? (
							<p className="p-4 text-sm text-muted-foreground text-center">
								No direct messages yet
							</p>
						) : (
							dms.map((dm) => {
								const recipient = Array.from(dm.recipients || []).find(
									(user) => user.id !== currentUser?.id,
								);
								return (
									<SidebarMenuItem key={dm.id}>
										<SidebarMenuButton size="lg" asChild>
											<Link href={`/app/dm/${dm.id}`}>
												<Avatar>
													<AvatarImage
														src={recipient?.avatar ? recipient.avatar.url : ""}
														alt={"User Avatar"}
														width={32}
														height={32}
													/>
													<AvatarFallback>
														{recipient?.username?.[0]?.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className="grid flex-1 text-left text-sm leading-tight">
													<span className="truncate font-medium">
														{recipient?.displayName ||
															recipient?.username ||
															"Unknown User"}
													</span>
													<span className="text-xs text-muted-foreground truncate">
														{dm.lastMessage?.content || "No messages yet"}
													</span>
												</div>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})
						)}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
