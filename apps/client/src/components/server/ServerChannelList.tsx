import { Icon } from "@iconify-icon/solid";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@suid/material";
import { Channel, Server } from "revolt.js";
import { For, Match, Switch} from "solid-js";

function ChannelListItem(props: { channel: Channel }) {
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <Switch>
            <Match when={props.channel.type === "TextChannel"}>
              <Icon icon="material-symbols:chat-rounded" class="text-2xl" />
            </Match>
            <Match when={props.channel.type === "VoiceChannel"}>
              <Icon
                icon="material-symbols:voice-chat-rounded"
                class="text-2xl"
              />
            </Match>
          </Switch>
        </ListItemIcon>
        <ListItemText primary={props.channel.name} />
      </ListItemButton>
    </ListItem>
  );
}

export default function ServerChannelList(props: { server: Server }) {
  return (
    <Switch>
      <Match when={props.server.categories?.length}>
        <For each={props.server.orderedChannels}>
          {(category) => (
            <List subheader={<ListSubheader>{category.title}</ListSubheader>}>
              <For each={category.channels}>
                {(channel) => <ChannelListItem channel={channel} />}
              </For>
            </List>
          )}
        </For>
      </Match>
      <Match when={!props.server.categories?.length}>
        <For each={props.server.channels}>
          {(channel) => <ChannelListItem channel={channel} />}
        </For>
      </Match>
    </Switch>
  );
}
