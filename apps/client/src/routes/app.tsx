import { Splitter } from "@ark-ui/solid";
import type { RouteSectionProps } from "@solidjs/router";
import { cn } from "~/lib/styling";

export default function AppLayout(props: RouteSectionProps) {
  return (
    <Splitter.Root
      class="w-full !h-screen flex flex-row p-4"
      defaultSize={[20, 80]}
      panels={[
        {
          id: "left",
          collapsible: true,
          minSize: 10, 
          maxSize: 75,
          collapsedSize: 3,
        },
        {
          id: "middle",
          minSize: 50,
          maxSize: 100,
        },
      ]}
    >
      <Splitter.Panel
        class="p-4 rounded-xl border-2 border-gray-500/50"
        id="left"
      >
        Server
      </Splitter.Panel>
      <Splitter.ResizeTrigger
        class={cn(
          "transition-colors",
          "flex-1",
          "w-2 m-2",
          "rounded-full",
          "hover:bg-blue-500/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
        )}
        id="left:middle"
        aria-label="Resize"
      />
      <Splitter.Panel
        class="rounded-xl border-2 border-gray-500/50"
        id="middle"
      >
        <div class="border-b-2 px-2 py-1 border-gray-500/50 shadow-md">
          Pathname: {props.location.pathname}
        </div>
        <main class="p-4">{props.children}</main>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
