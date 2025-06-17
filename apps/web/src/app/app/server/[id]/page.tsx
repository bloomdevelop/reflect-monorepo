"use client";
import { client } from "@/lib/revolt";
import { useEffect, useState } from "react";
import type { Server } from "revolt.js";

export default function ServerPage({
    params
}: {
    params: {id: string} | Promise<{id: string}>
}) {
    const [serverId, setServerId] = useState<string | null>(null);

    const [server, setServer] = useState<Server | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        async function resolveParams() {
          const resolved = (params instanceof Promise ? await params : params).id;
          if (!cancelled) setServerId(resolved);
        }
        resolveParams();
        return () => {
          cancelled = true;
        };
      }, [params]);

    useEffect(() => {
        async function fetchServer() {
            const server = client.servers.get(serverId as string);
            if (!server) return;

            setServer(server);
        }
        fetchServer();
    }, [serverId]);
    
    return <p>Hello from Server {server?.name}</p>
}