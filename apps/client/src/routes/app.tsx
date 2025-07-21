import { Splitter } from "@ark-ui/solid";
import type { RouteSectionProps } from "@solidjs/router";
import { CssBaseline, ThemeProvider } from "@suid/material";
import { Server } from "revolt.js";
import { createEffect, createSignal } from "solid-js";
import LeftSidebar from "~/components/LeftSidebar";
import MobileWarning from "~/components/MobileWarning";
import ServerList from "~/components/server/ServerList";
import { client } from "~/lib/revolt";
import { borderStyles, cn } from "~/lib/styling";
import { defaultTheme } from "~/lib/themes";
import { useTheme } from "@suid/material/styles";
import OutletToolbar from "~/components/Toolbar";
import ConnectionStatus from "~/components/ConnectionStatus";

export default function AppLayout(props: RouteSectionProps) {
  const theme = useTheme(defaultTheme);
  const mode = theme.palette.mode;
  const [isCollapsed, setIsCollapsed] = createSignal<boolean>(false);
  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const [servers, setServers] = createSignal<Server[]>([]);

  createEffect(() => {
    function getServers() {
      const servers = client.servers.values();
      setServers(Array.from(servers));
    }

    getServers();
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline enableColorScheme />
      <MobileWarning />
      <div class="w-full h-screen flex flex-col overflow-hidden">
        <div class="flex-none w-full">
          <ConnectionStatus />
        </div>
        <main class="flex-1 flex flex-row overflow-auto">
          <div class="flex flex-col gap-2 items-center flex-1 max-w-24 pt-4">
            <ServerList servers={servers()} />
          </div>
          <Splitter.Root
            class="flex-1 flex flex-row"
            onCollapse={() => {
              setIsCollapsed(true);
            }}
            onExpand={() => {
              setIsCollapsed(false);
            }}
            onResizeStart={() => setIsDragging(true)}
            onResizeEnd={() => setIsDragging(false)}
            defaultSize={[20, 80]}
            panels={[
              {
                id: "left",
                collapsible: true,
                minSize: 15,
                maxSize: 75,
                collapsedSize: 0,
              },
              {
                id: "middle",
                minSize: 50,
                maxSize: 100,
              },
            ]}
          >
            {!isCollapsed() && (
              <LeftSidebar pathname={props.location.pathname} />
            )}

            <Splitter.ResizeTrigger
              class={cn("transition-colors", "flex-1", "w-0.5", "outline-none")}
              style={{
                "background-color": isDragging()
                  ? borderStyles[mode].focus
                  : borderStyles[mode].default,
              }}
              id="left:middle"
              aria-label="Resize"
            />
            <Splitter.Panel
              class={cn("border-gray-500/50", "flex-1 flex flex-col")}
              id="middle"
            >
              <OutletToolbar />
              <main class="flex-1 flex flex-col overflow-y-auto">{props.children}</main>
            </Splitter.Panel>
          </Splitter.Root>
        </main>
      </div>
    </ThemeProvider>
  );
}
