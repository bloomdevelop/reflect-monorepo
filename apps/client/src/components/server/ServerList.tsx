import { For, Suspense } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { Server } from "revolt.js";
import ServerIcon from "../ServerIcon";
import { Fab } from "@suid/material";
import { Icon } from "@iconify-icon/solid";

interface ServerListProps {
  servers: Server[];
}

export default function ServerList(props: ServerListProps) {
  const location = useLocation();
  const active = (path: string) => path == location.pathname;
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate(`/app/home`);
  };

  return (
    <Suspense>
      <Fab color={active("/app/home") ? "primary" : "default"} onClick={navigateHome}>
        <Icon icon="material-symbols:home-rounded" class="text-2xl" />
      </Fab>
      <For each={props.servers}>
        {(server) => <ServerIcon server={server} />}
      </For>
    </Suspense>
  );
}
