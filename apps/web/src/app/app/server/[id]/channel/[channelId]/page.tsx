"use client";

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
	const [channelId, setChannelId] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		async function resolveParams() {
			const resolved = (params instanceof Promise ? await params : params)
				.channelId;
			if (!cancelled) setChannelId(resolved);
		}
		resolveParams();
		return () => {
			cancelled = true;
		};
	}, [params]);

	const [messages, setMessages] = useState<Message[] | undefined>(undefined);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [channel, setChannel] = useState<Channel | undefined>(undefined);

	useEffect(() => {
		if (!channelId) return;

		async function fetchMessages() {
			const id = channelId as string;
			const channel = client.channels.get(id) as Channel;

			if (!channel) return;

			setChannel(channel);

			const msgs = (await channel.fetchMessages({ limit: 100 })).reverse();
			setMessages(msgs);
		}

		fetchMessages();
	}, [channelId]);

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
		<div className="flex flex-col flex-1 h-full overflow-hidden">
			<div className="flex-1 overflow-y-auto">
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-full">
							<Spinner />
						</div>
					}
				>
					{memoizedMessages?.map((message) => (
						<MessageComponent key={message.id} message={message} />
					))}
					<div ref={bottomRef} />
				</Suspense>
			</div>
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
