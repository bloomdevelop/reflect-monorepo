"use client";

import { client } from "@/lib/revolt";
import { Suspense, useEffect, useState } from "react";
import type { Message } from "revolt.js";
import { Spinner } from "@/components/ui/spinner";
import MessageComponent from "@/components/message-component";

export default function ChannelPage({
  params,
}: {
  params: { channelId: string } | Promise<{ channelId: string }>;
}) {
  const [channelId, setChannelId] = useState<string | null>(null);

  // Resolve params (it may be a Promise in Next.js dev mode)
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

  useEffect(() => {
    if (!channelId) return;

    async function fetchMessages() {
      const id = channelId as string; // safe due to early return
      const channel = client.channels.get(id);
      if (!channel) return;
      const msgs = await channel.fetchMessages({ limit: 100 });
      setMessages(msgs);
    }

    fetchMessages();
  }, [channelId]);

	return (
		<div>
			<Suspense fallback={<div className="flex items-center justify-center h-full"><Spinner /></div>}>
				{messages?.map((message, index) => (
					<MessageComponent key={message.id} message={message} delay={index * 0.1} />
				))}
			</Suspense>
		</div>
	);
}
