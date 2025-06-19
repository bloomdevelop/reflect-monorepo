import { ServerListSidebar } from "@/components/server-list-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { client } from "@/lib/revolt";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	client.on("disconnected", () => {
		toast.warning("Disconnected from server");
	});

	client.on("connecting", () => {
		toast.info("Connecting to server...");
	});

	client.on("connected", () => {
		toast.success("Connected to server");
	});

	client.on("error", (error) => {
		toast.error(error.message);
	});

	return (
		<SidebarProvider className="flex flex-row w-screen h-screen">
			<ServerListSidebar />
			<SidebarInset>
				<main className="flex flex-col w-full h-screen overflow-hidden">
					<div className="bg-sidebar border-b-1 border-sidebar-border py-2 px-4 flex-shrink-0">
						<SidebarTrigger />
					</div>
					<div className="flex-1 min-h-0">{children}</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
