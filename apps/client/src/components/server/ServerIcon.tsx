import { useLocation, useNavigate } from "@solidjs/router";
import type { Server } from "revolt.js";
import { Fab } from "@suid/material";
import { createEffect, createSignal } from "solid-js";

interface ServerIconProps {
  server: Server | undefined;
  tabIndex: number;
}

export default function ServerIcon(props: ServerIconProps) {
  if (!props.server) return null;
  const [active, setActive] = createSignal<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  createEffect(() => {
    const segments = location.pathname.split('/');
    const serverIndex = segments.findIndex(seg => seg === 'server');
    if (serverIndex !== -1 && segments[serverIndex + 1] === props.server?.id) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  const onClick = () => {
    navigate(`/app/server/${props.server?.id}`);
  };

  return (
    <Fab
      onClick={onClick}
      color={active() ? "primary" : "default"}
      sx={{ width: "60px", height: "60px", p: 0.5 }}
      size="small"
      tabIndex={props.tabIndex}
    >
      {props.server.iconURL ? (
        <img src={props.server.iconURL} class="object-cover rounded-full" />
      ) : (
        <span class="text-2xl font-bold">
          {props.server.name.substring(0, 1)}
        </span>
      )}
    </Fab>
  );
}
