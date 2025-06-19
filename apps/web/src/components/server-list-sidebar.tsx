"use client";

import { client } from "@/lib/revolt";
import { BugIcon, Home, MessagesSquare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import type { Server } from "revolt.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import { Spinner } from "./ui/spinner";

export function ServerListSidebar() {
	const [servers, setServers] = useState<Server[] | undefined>(undefined);

	useEffect(() => {
		function fetchServers() {
			const currentServers = Array.from(client?.servers?.entries() ?? []).map(
				([, server]) => server,
			);
			setServers(currentServers);
		}

		// Fetch immediately after component mounts (e.g., right after login)
		fetchServers();

		// Re-fetch whenever the Revolt client becomes ready or the server list changes
		client.on?.("ready", fetchServers);
		client.on?.("serverCreate", fetchServers);
		client.on?.("serverDelete", fetchServers);

		// Clean up listeners when component unmounts
		return () => {
			client.off?.("ready", fetchServers);
			client.off?.("serverCreate", fetchServers);
			client.off?.("serverDelete", fetchServers);
		};
	}, []);

	return (
		<Sidebar collapsible="icon" className="z-1 flex flex-col h-full">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/app/home">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Home className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Home</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/app/dm">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<MessagesSquare className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Direct Message</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/app/debug">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<BugIcon className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Debug</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<Separator />
			</SidebarHeader>
			<SidebarContent className="flex-1 h-full overflow-y-auto">
				<SidebarGroup>
					<SidebarGroupLabel>Server List</SidebarGroupLabel>
					<SidebarMenu>
						<Suspense
							fallback={
								<SidebarMenuItem>
									<SidebarMenuButton size="lg" asChild>
										<Spinner />
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium text-muted-foreground">
												Loading servers...
											</span>
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							}
						>
							{servers?.length ? (
								<AnimatePresence>
									{servers.map((server, index) => (
										<SidebarMenuItem key={server.id}>
											{index < 5 ? (
												<SidebarMenuButton
													tooltip={server.name}
													size="lg"
													asChild
												>
													<Link href={`/app/server/${server.id}`}>
														<Avatar>
															<AvatarImage
																src={server.iconURL || ""}
																alt={server.name}
																width={32}
																height={32}
															/>
															<AvatarFallback>
																{server.name.charAt(0).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className="grid flex-1 text-left text-sm leading-tight">
															<span className="truncate font-medium">
																{server.name}
															</span>
														</div>
													</Link>
												</SidebarMenuButton>
											) : (
												<SidebarMenuButton
													tooltip={server.name}
													size="lg"
													asChild
												>
													<Link href={`/app/server/${server.id}`}>
														<Avatar>
															<AvatarImage
																src={server.iconURL || ""}
																alt={server.name}
																width={32}
																height={32}
															/>
															<AvatarFallback>
																{server.name.charAt(0).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className="grid flex-1 text-left text-sm leading-tight">
															<span className="truncate font-medium">
																{server.name}
															</span>
														</div>
													</Link>
												</SidebarMenuButton>
											)}
										</SidebarMenuItem>
									))}
								</AnimatePresence>
							) : (
								<SidebarMenuItem>
									<SidebarMenuButton size="lg" asChild>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium text-muted-foreground">
												No servers found
											</span>
										</div>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)}
						</Suspense>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
