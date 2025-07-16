import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/styling";

interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  type?: HTMLButtonElement["type"];
  class?: string;
  variant: "primary" | "secondary" | "danger";
}

export default function Button(props: ButtonProps) {
  const [local, other] = splitProps(props, ["children", "onClick", "type"]);
  return (
    <button
      class={cn(
        "px-4 py-2 rounded-md text-lg transition-all",
        "focus:outline-none focus:ring-2",
        other.variant === "primary" &&
          "bg-blue-500 text-white hover:bg-blue-700 ring-blue-500/50",
        other.variant === "secondary" &&
          "bg-gray-500 text-white hover:bg-gray-700 ring-gray-500/50",
        other.variant === "danger" &&
          "bg-red-500 text-white hover:bg-red-700 ring-red-500/50",
        other.class
      )}
      onClick={local.onClick}
      type={local.type}
    >
      {local.children}
    </button>
  );
}
