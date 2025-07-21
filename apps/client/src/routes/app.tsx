import { Splitter } from "@ark-ui/solid";
import { Icon } from "@iconify-icon/solid";
import { A, useNavigate, type RouteSectionProps } from "@solidjs/router";
import { ConnectionState, Server } from "revolt.js";
import { createEffect, createSignal, For, Suspense } from "solid-js";
import LeftSidebar from "~/components/LeftSidebar";
import IconButton from "~/components/ui/IconButton";
import MobileWarning from "~/components/ui/MobileWarning";
import ServerIcon from "~/components/ui/ServerIcon";
import { client } from "~/lib/revolt";
import { cn } from "~/lib/styling";

export default function AppLayout(props: RouteSectionProps) {
  const [isCollapsed, setIsCollapsed] = createSignal<boolean>(false);
  const [servers, setServers] = createSignal<Server[]>([]);
  const navigate = useNavigate();

  createEffect(() => {
    function getServers() {
      const servers = client.servers.values();
      setServers(Array.from(servers));
    }

    getServers();
  });

  return (
    <>
      <MobileWarning />
      <div class="w-full !h-screen flex flex-col">
        {client.events.state() === ConnectionState.Idle ||
        client.events.state() === ConnectionState.Disconnected ? (
          <div class="bg-red-500/30 text-center py-2">Not Connected</div>
        ) : null}
        <main class="flex-1 flex flex-row">
          <div class="flex flex-col gap-2 items-center flex-1 max-w-24 pt-4">
            <A href="/app/home">
              <IconButton variant="secondary" size="lg">
                <Icon icon="material-symbols:home" class="text-xl" />
              </IconButton>
            </A>
            <Suspense>
              <For each={servers()}>
                {(server) => <ServerIcon server={server} />}
              </For>
            </Suspense>
          </div>
          <Splitter.Root
            class="flex-1 flex flex-row"
            onCollapse={() => {
              setIsCollapsed(true);
            }}
            onExpand={() => {
              setIsCollapsed(false);
            }}
            defaultSize={[20, 80]}
            panels={[
              {
                id: "left",
                collapsible: true,
                minSize: 10,
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
            {!isCollapsed() && <LeftSidebar pathname={props.location.pathname} />}

            <Splitter.ResizeTrigger
              class={cn(
                "transition-colors",
                "flex-1",
                "w-0.5",
                "bg-gray-500/50",
                "hover:bg-blue-500/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              )}
              id="left:middle"
              aria-label="Resize"
            />
            <Splitter.Panel
              class={cn(
                "border-gray-500/50",
                "flex-1 flex flex-col"
              )}
              id="middle"
            >
              <div class="border-b-2 px-2 py-1 border-gray-500/50 shadow-md">
                Pathname: {props.location.pathname}
              </div>
              <main class="p-4">{props.children}</main>
            </Splitter.Panel>
          </Splitter.Root>
        </main>
      </div>
    </>
  );
}
