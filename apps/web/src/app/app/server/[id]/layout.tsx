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
		<div className="flex flex-1 h-full min-h-0">
			<div className="flex-shrink-0 h-full border-r border-sidebar-border">
				<ChannelListSidebar serverId={id} />
			</div>
			<div className="flex-1 min-w-0 min-h-0 overflow-auto">{children}</div>
		</div>
	);
}
