import { CircularProgress } from "@suid/material";
import { Server } from "revolt.js";
import {
  createEffect,
  createSignal,
  Match,
  on,
  Suspense,
  Switch,
} from "solid-js";
import { client } from "~/lib/revolt";
import { cn } from "~/lib/styling";
import ServerHeader from "./ServerHeader";
import ServerChannelList from "./ServerChannelList";

interface ServerUIProps {
  serverId: string;
}

export default function ServerUI(props: ServerUIProps) {
  const [server, setServer] = createSignal<Server | undefined>(undefined);

  createEffect(
    on(
      () => props.serverId,
      async (id) => {
        if (!id) return;

        try {
          const fetched = client.servers.get(id);
          setServer(fetched);
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  return (
    <div class="flex flex-col h-full">
      <Suspense
        fallback={
          <div
            class={cn(
              "w-full h-full",
              "flex flex-col items-center justify-center"
            )}
          >
            <CircularProgress size={34} />
          </div>
        }
      >
        <Switch>
          <Match when={server()}>
            <ServerHeader server={server()!} />
            <div class="flex-1 overflow-y-auto">
              <ServerChannelList server={server()!} />
            </div>
          </Match>
          <Match when={!server()}>
            <p>Server not found</p>
          </Match>
        </Switch>
      </Suspense>
    </div>
  );
}
