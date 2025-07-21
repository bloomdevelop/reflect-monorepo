import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import suidPlugin from "@suid/vite-plugin";

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), suidPlugin()],
    build: {
      target: "esnext",
    },
  },
});
