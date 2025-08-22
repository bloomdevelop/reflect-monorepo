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

  // Real-time updates: listen for new messages on this channel and append them (deduplicated)
  useEffect(() => {
    if (!channelId) return;

    const handleMessageCreate = (message: Message) => {
      // Normalize possible channel id locations and ensure message belongs to current channel
      const msgChannelId =
        ((message as any).channelId as string) ||
        ((message as any).channel && (message as any).channel.id);
      if (!msgChannelId || msgChannelId !== channelId) return;

      setMessages((prev) => {
        // Deduplicate by id to avoid double-inserts (e.g. local send + server event)
        if (prev && prev.some((m) => m.id === message.id)) return prev;
        return prev ? [...prev, message] : [message];
      });
    };

    client.on("messageCreate", handleMessageCreate);

    return () => {
      client.off("messageCreate", handleMessageCreate);
    };
  }, [channelId]);

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
          {messages?.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          <div ref={bottomRef} className="h-4" />
        </div>
      </Suspense>
      {channel && (
        <ComposeComponent
          channelId={channel.id}
          onMessageSent={(message) => {
            setMessages((prev) => {
              if (prev && prev.some((m) => m.id === message.id)) return prev;
              return prev ? [...prev, message] : [message];
            });
          }}
        />
      )}
    </div>
  );
}
