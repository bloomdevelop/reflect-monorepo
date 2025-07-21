import { Splitter } from "@ark-ui/solid";
import { Server } from "revolt.js";
import {
  createEffect,
  createSignal,
  Match,
  splitProps,
  Switch,
} from "solid-js";
import { cn } from "~/lib/styling";

interface LeftSidebarProps {
  pathname: string;
}

export default function LeftSidebar(props: LeftSidebarProps) {
  const [local, _] = splitProps(props, ["pathname"]);
  const [currentServer, setCurrentServer] = createSignal<string | undefined>();

  createEffect(() => {
    if (local.pathname.match(/\/server\/[A-Za-z0-9]+$/)) {
      const serverId = local.pathname.match(/\/server\/([A-Za-z0-9]+)$/)?.[1];
      setCurrentServer(serverId);
    } else {
      setCurrentServer(undefined);
    }
  });
  return (
    <Splitter.Panel
      class={cn("border-l-2", "p-4 border-gray-500/50")}
      id="left"
    >
      <Switch>
        <Match when={currentServer()}>
          <p>Current Server: {currentServer()}</p>
          <p>Server UI goes here</p>
        </Match>
        <Match when={!currentServer()}>
          <p>Direct Message UI goes here</p>
        </Match>
      </Switch>
    </Splitter.Panel>
  );
}
