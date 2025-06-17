import { ChannelListSidebar } from "@/components/channel-list-sidebar";
import type { ReactNode } from "react";

export default async function ServerLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="flex h-full flex-1 flex-row">
            <ChannelListSidebar serverId={id} />
            <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
    );
}