import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Icon } from "@iconify-icon/solid";

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <Suspense fallback={
            <div class="h-screen w-screen flex items-center justify-center">
              <Icon icon="material-symbols:rotate-right-rounded" class="animate-spin" />
            </div>
          }>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
