"use client";

import { useLog } from "@/app/hooks/useLogContext";
import ComposeComponent from "@/components/compose";
import MessageComponent from "@/components/message-component";
import { Spinner } from "@/components/ui/spinner";
import { client } from "@/lib/revolt";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Channel, Message } from "revolt.js";

export default function ChannelPage({
	params,
}: {
	params: { channelId: string } | Promise<{ channelId: string }>;
}) {
	const { addLog } = useLog();
	const [channelId, setChannelId] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		async function resolveParams() {
			try {
				const resolved = (params instanceof Promise ? await params : params)
					.channelId;
				if (!cancelled) {
					setChannelId(resolved);
				} else {
					console.warn("Channel ID resolution was cancelled");
				}
			} catch (error) {
				console.error("Failed to resolve params:", error);
			}
		}
		resolveParams();
		return () => {
			cancelled = true;
		};
	}, [params]);

	const [messages, setMessages] = useState<Message[] | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [channel, setChannel] = useState<Channel | null>(null);

	useEffect(() => {
		if (!channelId) return;

		async function fetchMessages() {
			const id = channelId;
			if (!id) {
				addLog("No channelId provided, cannot fetch messages.");
				return;
			}
			addLog(`Fetching messages for channel ${id}`);
			const channel = client.channels.get(id) as Channel;

			if (!channel) return;

			setChannel(channel);

			addLog(`Fetched channel ${channel.name} (${channel.id})`);
			const msgs = (await channel.fetchMessages({ limit: 100 })).reverse();
			setMessages(msgs);
			addLog(
				`Fetched ${msgs.length} messages for channel ${channel.name} (${channel.id})`,
			);
		}

		fetchMessages();
	}, [channelId, addLog]);

	// Scroll to bottom whenever messages update

	useEffect(() => {
		// Only scroll once we actually have messages
		if (!messages || messages.length === 0) return;

		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "instant" });
		}
	}, [messages]);

	// Memoize messages array to avoid unnecessary re-renders
	const memoizedMessages = useMemo(
		() => messages,
		[messages, ...(messages?.map((m) => m.id) || [])],
	);

	return (
		<div className="flex flex-col h-full overflow-x-hidden">
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full">
						<Spinner />
					</div>
				}
			>
				<div className="space-y-4 py-4">
					{memoizedMessages?.map((message) => (
						<MessageComponent key={message.id} message={message} />
					))}
					<div ref={bottomRef} className="h-4" />
				</div>
			</Suspense>
			{channel && (
				<ComposeComponent
					channel={channel}
					onMessageSent={(message) => {
						setMessages((prev) => (prev ? [...prev, message] : [message]));
					}}
				/>
			)}
		</div>
	);
}
