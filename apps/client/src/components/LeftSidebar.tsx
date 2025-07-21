import { Splitter } from "@ark-ui/solid";
import { Server } from "revolt.js";
import {
  createEffect,
  createSignal,
  Match,
  splitProps,
  Switch,
} from "solid-js";
import { borderStyles, cn } from "~/lib/styling";
import { useTheme } from "@suid/material/styles";
import ServerUI from "./server/ServerUI";
import { defaultTheme } from "~/lib/themes";

interface LeftSidebarProps {
  pathname: string;
}

export default function LeftSidebar(props: LeftSidebarProps) {
  const [local, _] = splitProps(props, ["pathname"]);
  const [currentServer, setCurrentServer] = createSignal<string | undefined>();

  createEffect(() => {
    const segments = local.pathname.split('/');
    const serverIndex = segments.findIndex(seg => seg === 'server');
    if (serverIndex !== -1 && segments[serverIndex + 1]) {
      setCurrentServer(segments[serverIndex + 1]);
    } else {
      setCurrentServer(undefined);
    }
  });
  const theme = useTheme(defaultTheme);
  const mode = theme.palette.mode;

  return (
    <Splitter.Panel
      class={cn("h-screen", "border-l-2")}
      style={{
        "border-color": borderStyles[mode].default,
      }}
      id="left"
    >
      <Switch>
        <Match when={currentServer()}>
          <ServerUI serverId={currentServer()!} />
        </Match>
        <Match when={!currentServer()}>
          <p>Direct Message UI goes here</p>
        </Match>
      </Switch>
    </Splitter.Panel>
  );
}
