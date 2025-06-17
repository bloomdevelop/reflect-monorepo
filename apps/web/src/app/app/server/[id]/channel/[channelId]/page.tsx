"use client";

import { client } from "@/lib/revolt";
import { Suspense, useEffect, useState, useRef } from "react";
import type { Message } from "revolt.js";
import { Spinner } from "@/components/ui/spinner";
import MessageComponent from "@/components/message-component";

export default function ChannelPage({
  params,
}: {
  params: { channelId: string } | Promise<{ channelId: string }>;
}) {
  const [channelId, setChannelId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function resolveParams() {
      const resolved = (params instanceof Promise ? await params : params).channelId;
      if (!cancelled) setChannelId(resolved);
    }
    resolveParams();
    return () => {
      cancelled = true;
    };
  }, [params]);

	const [messages, setMessages] = useState<Message[] | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!channelId) return;

    async function fetchMessages() {
      const id = channelId as string;
      const channel = client.channels.get(id);

      if (!channel) return;

      const msgs = await channel.fetchMessages({ limit: 100 });
      setMessages(msgs);
    }

    fetchMessages();
  }, [channelId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    // Only scroll once we actually have messages
    if (!messages || messages.length === 0) return;

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

	return (
		<div className="flex flex-col flex-1 h-full overflow-y-auto">
			<Suspense fallback={<div className="flex items-center justify-center h-full"><Spinner /></div>}>
				{messages?.slice().reverse().map((message, index) => (
          <MessageComponent key={message.id} message={message} delay={index * 0.1} />
        ))}
        <div ref={bottomRef} />
			</Suspense>
		</div>
	);
}
