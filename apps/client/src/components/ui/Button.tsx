import { Icon } from "@iconify-icon/solid";
import { JSX, Match, splitProps, Switch } from "solid-js";
import { cn } from "~/lib/styling";

interface ButtonProps {
  children: JSX.Element;
  icon?: JSX.Element;
  onClick?: () => void;
  type?: HTMLButtonElement["type"];
  class?: string;
  loading?: boolean;
  disabled?: boolean;
  variant: "primary" | "secondary" | "danger";
}

export default function Button(props: ButtonProps) {
  const [local, other] = splitProps(props, [
    "icon",
    "children",
    "onClick",
    "type",
  ]);
  return (
    <button
      class={cn(
        "flex flex-row gap-2 px-4 py-2 rounded-md text-lg transition-all",
        "justify-center items-center",
        "focus:outline-none focus:ring-2",
        other.variant === "primary" &&
          "bg-blue-500 text-white hover:bg-blue-700 ring-blue-500/50",
        other.variant === "secondary" &&
          "bg-gray-500 text-white hover:bg-gray-700 ring-gray-500/50",
        other.variant === "danger" &&
          "bg-red-500 text-white hover:bg-red-700 ring-red-500/50",
        other.loading && "cursor-not-allowed opacity-50",
        other.class
      )}
      onClick={local.onClick}
      type={local.type}
      disabled={other.loading || other.disabled}
    >
      <Switch>
        <Match when={local.icon && !other.loading}>{local.icon}</Match>
        <Match when={other.loading}>
          <Icon
            class="animate-spin"
            icon="material-symbols:rotate-right-rounded"
          />
        </Match>
      </Switch>

      {local.children}
    </button>
  );
}
