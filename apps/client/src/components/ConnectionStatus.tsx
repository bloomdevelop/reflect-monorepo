import { client } from "~/lib/revolt";
import { ConnectionState } from "revolt.js";
import { Alert, Button } from "@suid/material";
import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createTimer } from "@solid-primitives/timer";

export default function ConnectionStatus() {
    const navigate = useNavigate();
    const [currentState, setCurrentState] = createSignal<ConnectionState>(client.events.state());
    
    createTimer(() => {
        setCurrentState(client.events.state());
    }, 500, setInterval);

  if (currentState() === ConnectionState.Connected) {
    const [visible, setVisible] = createSignal(true);
    createTimer(() => setVisible(false), 5000, setTimeout);
    return (
      <Alert
        severity="success"
        square
        style={{ display: visible() ? "flex" : "none" }}
      >
        Connected
      </Alert>
    );
  }

  if (
    currentState() === ConnectionState.Idle ||
    currentState() === ConnectionState.Disconnected
  ) {
        return (
      <Alert severity="error" square action={
        <Button color="inherit" size="small" onClick={() => {
            if (!client.sessionToken) {
                navigate("/login");
            } else {
                client.connect();
            }
        }}>
            Reconnect
        </Button>
      }>
        Disconnected
      </Alert>
    );
  }

  if (currentState() === ConnectionState.Connecting) {
    return (
      <Alert severity="warning" square>
        Connecting...
      </Alert>
    );
  }

  if (currentState() === ConnectionState.Connected || currentState() === ConnectionState.Idle || currentState() === ConnectionState.Disconnected) {
    return null;
  }
}
