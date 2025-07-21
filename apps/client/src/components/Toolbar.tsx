import {
  AppBar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@suid/material";
import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { client } from "~/lib/revolt";
import { Icon } from "@iconify-icon/solid";
import { Channel } from "revolt.js";

export default function OutletToolbar() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const open = () => Boolean(anchorEl());
  const handleClose = () => setAnchorEl(null);
  const location = useLocation();
  const [channel, setChannel] = createSignal<Channel | undefined>(undefined);
  const [channelName, setChannelName] = createSignal<string>("Direct Messages");

  createEffect(() => {
    const segments = location.pathname.split("/");
    const channelIndex = segments.findIndex((seg) => seg === "channel");
    if (channelIndex !== -1 && segments[channelIndex + 1]) {
      const channel = client.channels.get(segments[channelIndex + 1]);
      setChannel(channel);
      setChannelName(channel?.name || location.pathname);
    } else {
        setChannelName("Placeholder, I have no idea what to name this");
    }
  });

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>
            {channelName()}
          </Typography>
          <Show when={channel()}>
            <IconButton
              aria-label="more"
              id="channel-menu-button"
              aria-controls={open() ? "channel-menu" : undefined}
              aria-expanded={open() ? "true" : undefined}
              aria-haspopup="true"
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <Icon icon="material-symbols:more-vert" />
            </IconButton>
          </Show>
        </Toolbar>
      </AppBar>
      <Menu
        id="channel-menu"
        anchorEl={anchorEl()}
        open={open()}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon="material-symbols:pinboard-rounded" class="text-2xl" />
          </ListItemIcon>
          Pinned Messages
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon="material-symbols:group-rounded" class="text-2xl" />
          </ListItemIcon>
          Show Members
        </MenuItem>
        <Show when={channel()?.havePermission("ManageServer")}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Icon icon="material-symbols:settings" class="text-2xl" />
            </ListItemIcon>
            Channel Settings
          </MenuItem>
        </Show>
      </Menu>
    </>
  );
}
