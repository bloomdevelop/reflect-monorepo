import { Box, Typography, Stack, Chip } from "@suid/material";
import { Server } from "revolt.js";
import { Switch, Match, Show } from "solid-js";

export default function ServerHeader(props: { server: Server }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <Switch>
        <Match when={props.server.bannerURL}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                p: 2,
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                zIndex: 2,
              }}
            >
              <Typography variant="h5" color="white">
                {props.server.name}
              </Typography>
              <Show when={props.server.flags}>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="Official" color="error" />
                  <Chip size="small" label="Verified" color="success" />
                </Stack>
              </Show>
            </Box>
            <img
              src={props.server.bannerURL}
              class="w-full h-48 object-cover"
            />
          </Box>
        </Match>
        <Match when={!props.server.bannerURL}>
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h5">{props.server.name}</Typography>
              <Show when={props.server.flags}>
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="Official" color="error" />
                  <Chip size="small" label="Verified" color="success" />
                </Stack>
              </Show>
            </Stack>
          </Box>
        </Match>
      </Switch>
    </Box>
  );
}
