"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { ServerListSidebar } from "@/components/server-list-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { client } from "@/lib/revolt";
import { useSessionInit } from "@/lib/session-manager";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isInitializing, connectionInfo } = useSessionInit();

  useEffect(() => {
    // Set up connection event handlers
    const handleDisconnected = () => {
      toast.warning("Disconnected from server");
    };

    const handleConnecting = () => {
      toast.loading("Connecting to server...");
    };

    const handleConnected = () => {
      toast.success("Connected to server");
    };

    const handleError = (error: any) => {
      toast.error(error.message);
    };

    client.on("disconnected", handleDisconnected);
    client.on("connecting", handleConnecting);
    client.on("connected", handleConnected);
    client.on("error", handleError);

    return () => {
      client.off("disconnected", handleDisconnected);
      client.off("connecting", handleConnecting);
      client.off("connected", handleConnected);
      client.off("error", handleError);
    };
  }, []);

  // Show loading screen while session is initializing
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Initializing session...
            </p>
            {connectionInfo.connectionState !== "Idle" && (
              <p className="text-xs text-muted-foreground mt-1">
                Connection: {connectionInfo.connectionState}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
