import { Icon } from "@iconify-icon/solid";
import { useParams } from "@solidjs/router";
import { CircularProgress, Typography } from "@suid/material";
import { Channel, Message } from "revolt.js";
import {
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { client } from "~/lib/revolt";
import { cn } from "~/lib/styling";

export default function ChannelPage() {
  const params = useParams();
  const [messages, setMessages] = createSignal<Message[] | undefined>();
  const [channel, setChannel] = createSignal<Channel | undefined>(undefined);

  createEffect(() => {
    const channel = client.channels.get(params.id);
    setChannel(channel);

    if (!channel) {
      return;
    }

    channel.fetchMessages().then((messages) => {
      setMessages(messages);
    });
  });

  return (
    <Switch
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
      <Match when={channel()?.type === "VoiceChannel"}>
        <div class="flex flex-col gap-2 items-center justify-center h-full p-8">
          <Icon icon="material-symbols:voice-chat-rounded" class="text-8xl" />
          <Typography variant="h6">Voice Chat support not supported</Typography>
        </div>
      </Match>
      <Match when={messages()}>
        <For each={messages()}>{(message) => <div>{message.content}</div>}</For>
      </Match>
    </Switch>
  );
}
