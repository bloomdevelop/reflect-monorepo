"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
import { client } from "@/lib/revolt";
import type { Server, Channel } from "revolt.js";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

export function ChannelListSidebar({ serverId }: { serverId: string }) {
	const [server, setServer] = useState<Server | undefined>(undefined);

	useEffect(() => {
		const server = client.servers.get(serverId);
		if (!server) return;

		setServer(server);
	}, [serverId]);

	return (
		<Sidebar className="flex flex-col h-full overflow-auto" collapsible="none">
			<SidebarHeader>
				<div className="relative">
					<img
						src={server?.bannerURL || null || ""}
						alt={server?.name || ""}
					/>
				</div>
				{server?.name || "Missing Server???"}
			</SidebarHeader>
			<SidebarContent className="flex-1 h-full overflow-y-auto">
				<SidebarGroup>
					<Accordion type="multiple">
						{server?.categories?.map((category) => (
							<AccordionItem key={category.id} value={category.id}>
								<AccordionTrigger>{category.title}</AccordionTrigger>
								<AccordionContent>
									<SidebarMenu>
										{Array.from(category.channels?.values() || [])
											.map((id) => client.channels.get(id))
											.filter((ch): ch is Channel => !!ch) // keep only resolved channels
											.map((channel) => (
												<SidebarMenuItem key={channel.id}>
													<SidebarMenuButton asChild>
														<Link
															href={`/app/server/${serverId}/channel/${channel.id}`}
														>
															{channel.name}
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
									</SidebarMenu>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
