"use client";

import { client } from "@/lib/revolt";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Channel, Server } from "revolt.js";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";

export function ChannelListSidebar({ serverId }: { serverId: string }) {
	const [server, setServer] = useState<Server | undefined>(undefined);

	useEffect(() => {
		const server = client.servers.get(serverId);
		if (!server) return;

		setServer(server);
	}, [serverId]);

	return (
		<Sidebar className="flex flex-col h-full" collapsible="none">
			<SidebarHeader className="flex-shrink-0">
				<h1 className="text-2xl font-bold">
					{server?.name || "Missing Server???"}
				</h1>
				<Separator />
			</SidebarHeader>
			<SidebarContent className="flex-1 min-h-0">
				<SidebarGroup>
					{server?.categories?.length ? (
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
					) : (
						<SidebarMenu>
							{server?.channels.map((channel) => (
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
					)}
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
