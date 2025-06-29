"use client";
import { useLog } from "@/app/hooks/useLogContext";
import Markdown from "@/components/markdown/markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/revolt";
import { Dot, Server as ServerIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Server } from "revolt.js";

export default function ServerPage({
	params,
}: {
	params: { id: string } | Promise<{ id: string }>;
}) {
	const { addLog } = useLog();
	const [serverId, setServerId] = useState<string | null>(null);
	const [server, setServer] = useState<Server | undefined>(undefined);
	const [memberCount, setMemberCount] = useState<number>(0);

	useEffect(() => {
		let cancelled = false;
		async function resolveParams() {
			const resolved = (params instanceof Promise ? await params : params).id;
			try {
				if (!cancelled) setServerId(resolved);
			} catch (error) {
				console.error("Failed to resolve params:", error);
			}
		}
		resolveParams();
		return () => {
			cancelled = true;
		};
	}, [params]);

	useEffect(() => {
		async function fetchServer() {
			addLog(`Fetching server with ID: ${serverId}`);
			if (!serverId) {
				addLog("No serverId provided, cannot fetch server.");
				return;
			}

			const server = client.servers.get(serverId);
			if (!server) return;

			setServer(server);
			addLog(`Fetched server: ${server.name} (${server.id})`);

			// Get member count (optional, remove if not needed)
			try {
				addLog(`Fetching member count for server: ${server.name}`);
				const members = await server.fetchMembers();
				setMemberCount(members.members.filter((m) => m.user?.online).length);
				addLog(
					`Member count for server ${server.name}: ${members.members.length} (Online: ${members.members.filter((m) => m.user?.online).length})`,
				);
			} catch (err) {
				console.error("Failed to fetch member count:", err);
				addLog(`Failed to fetch member count for server ${server.name}`);
			}
		}
		if (serverId) {
			fetchServer();
		}
	}, [serverId, addLog]);

	if (!server) {
		return (
			<div className="p-6 space-y-4">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-16 w-16 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Server Header */}
			<div className="flex items-start space-x-4">
				{server.iconURL ? (
					<Image
						src={server.iconURL}
						alt={server.name}
						width={64}
						height={64}
						className="rounded-full"
					/>
				) : (
					<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
						<ServerIcon className="h-8 w-8 text-muted-foreground" />
					</div>
				)}
				<div className="space-y-2">
					<h1 className="text-2xl font-bold">{server.name}</h1>
					<div className="flex items-center text-sm text-muted-foreground">
						<span>{memberCount} online</span>
						<Dot className="size-6" />
						<span>{server.channels.length} channels</span>
					</div>
				</div>
			</div>

			{/* Server Description */}
			{server.description && (
				<div className="bg-muted/40 rounded-lg p-4">
					<h2 className="font-medium mb-2">About</h2>
					<p className="text-sm text-muted-foreground whitespace-pre-wrap">
						{server.description}
					</p>
				</div>
			)}

			{/* Owner Info */}
			<div className="bg-muted/40 rounded-lg p-4">
				<h2 className="font-medium mb-2">Server Info</h2>
				<div className="space-y-1 text-sm text-muted-foreground">
					<p>
						ID: <span className="font-mono">{server.id}</span>
					</p>
					{server.owner && <p>Owner: {server.owner.username}</p>}
					<p>Created: {new Date(server.createdAt).toLocaleDateString()}</p>
				</div>
			</div>

			{/* Channels */}
			<div className="space-y-2">
				<h2 className="font-medium">Channels</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
					{Array.from(server.channels.values()).map((channel) => (
						<div key={channel.id} className="bg-muted/40 p-3 rounded-lg">
							<div className="font-medium">#{channel.name}</div>
							{channel.description && (
								<p className="text-sm text-muted-foreground truncate">
									<Markdown content={channel.description} />
									{/* <ReactMarkdown>{channel.description}</ReactMarkdown> */}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
