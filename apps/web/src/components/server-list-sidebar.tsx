"use client";

import { BugIcon, Home } from "lucide-react";
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
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import type { Server } from "revolt.js";
import { client } from "@/lib/revolt";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AnimatePresence, motion, type Variant } from "motion/react";
import { Spinner } from "./ui/spinner";

export function ServerListSidebar() {
	const [servers, setServers] = useState<Server[] | undefined>(undefined);

	useEffect(() => {
		function fetchServers() {
			const currentServers = Array.from(client?.servers?.entries() ?? []).map(([, server]) => server);
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
		<Sidebar collapsible="icon" className="flex flex-col h-full">
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
			</SidebarHeader>
			<SidebarContent className="flex-1 h-full overflow-y-auto">
				<SidebarGroup>
					<SidebarGroupLabel>Server List</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenu>
							<Suspense fallback={<AnimatePresence>
								<SidebarMenuItem>
									<motion.div
										layout
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										transition={{ type: "spring", stiffness: 120, damping: 8 }}
									>
										<SidebarMenuButton size="lg" asChild>
											<Spinner />
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-medium text-muted-foreground">
													Loading servers...
												</span>
											</div>
										</SidebarMenuButton>
									</motion.div>
									</SidebarMenuItem>
								</AnimatePresence>}>
								{servers?.length ? (
									<AnimatePresence>
										{servers.map((server, index) => (
											<SidebarMenuItem key={server.id}>
												<motion.div
													layout
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													transition={{
														type: "spring",
														stiffness: 120,
														damping: 8,
														delay: index * 0.1,
													}}
												>
													<SidebarMenuButton size="lg" asChild>
														<Link href={`/app/server/${server.id}`}>
															<Avatar>
																<AvatarImage
																	src={server.iconURL || ""}
																	alt={server.name}
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
												</motion.div>
											</SidebarMenuItem>
										))}
									</AnimatePresence>
								) : (
									<SidebarMenuItem>
										<motion.div
											layout
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											transition={{
												type: "spring",
												stiffness: 120,
												damping: 8,
											}}
										>
											<SidebarMenuButton size="lg" asChild>
												<div className="grid flex-1 text-left text-sm leading-tight">
													<span className="truncate font-medium text-muted-foreground">
														No servers found
													</span>
												</div>
											</SidebarMenuButton>
										</motion.div>
									</SidebarMenuItem>
								)}
							</Suspense>
						</SidebarMenu>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
