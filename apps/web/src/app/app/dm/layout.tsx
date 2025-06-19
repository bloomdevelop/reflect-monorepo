import DMSidebar from "@/components/dm-sidebar";

export default function DMLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 h-full min-h-0">
					<div className="flex-shrink-0 h-full border-r border-sidebar-border">
						<DMSidebar />
					</div>
					<div className="flex-1 min-w-0 min-h-0 overflow-auto">
						{children}
					</div>
				</div>
	);
}
