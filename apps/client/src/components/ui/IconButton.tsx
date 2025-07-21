import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/styling";

interface IconButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  type?: HTMLButtonElement["type"];
  class?: string;
  variant: "primary" | "secondary" | "danger";
  size: "sm" | "md" | "lg";
}

export default function IconButton(props: IconButtonProps) {
  const [local, other] = splitProps(props, ["children", "onClick", "type"]);
  return (
    <button
      class={cn(
        "flex justify-center items-center p-2 size-11 rounded-md text-lg transition-all text-center",
        "focus:outline-none focus:ring-2",
        other.variant === "primary" &&
          "bg-blue-500 text-white hover:bg-blue-700 ring-blue-500/50",
        other.variant === "secondary" &&
          "bg-gray-500 text-white hover:bg-gray-700 ring-gray-500/50",
        other.variant === "danger" &&
          "bg-red-500 text-white hover:bg-red-700 ring-red-500/50",
        other.size === "sm" && "size-8 text-sm",
        other.size === "md" && "size-11 text-md",
        other.size === "lg" && "size-14 text-lg",
        other.class
      )}
      onClick={local.onClick}
      type={local.type}
    >
      {local.children}
    </button>
  );
}
