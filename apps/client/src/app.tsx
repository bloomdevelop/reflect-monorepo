import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import { onMount } from "solid-js";
import { client } from "./lib/revolt";

export default function App() {
  onMount(() => {
    const session = sessionStorage.getItem("session");
    if (session) {
      client.useExistingSession(JSON.parse(session));
    }
  });

  return (
    <Router>
      <FileRoutes />
    </Router>
  );
}
