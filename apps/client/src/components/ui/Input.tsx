import { splitProps } from "solid-js";
import { cn } from "~/lib/styling";

interface InputProps {
  class?: string;
  placeholder?: string;
  value?: string | string[] | number | undefined;
  onChange?: (
    e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }
  ) => void;
}

export default function Input(props: InputProps) {
  const [local, other] = splitProps(props, [
    "placeholder",
    "value",
    "onChange",
    "class"
  ]);

  return (
    <input
      placeholder={local.placeholder}
      value={local.value}
      onChange={local.onChange}
      class={cn(
        "px-4 py-2",
        "rounded-md transition-all",
        "text-md text-black",
        "ring-2 ring-neutral-400/50",
        "placeholder:text-black/30",
        "focus:outline-none focus:ring-blue-500/90",
        local.class
      )}
      {...other}
    />
  );
}
