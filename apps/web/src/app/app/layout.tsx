import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { ServerListSidebar } from "@/components/server-list-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<ServerListSidebar />
			<SidebarInset>
				<main className="flex flex-col w-full h-full">
					<div className="bg-sidebar border-b-1 border-sidebar-border py-2 px-4">
						<SidebarTrigger />
					</div>
					<div className="flex-1 h-full overflow-y-auto">
						{children}
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
