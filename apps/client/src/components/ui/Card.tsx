import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/styling";

interface CardProps {
  children: JSX.Element;
  class?: string;
}

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <div {...others} class={cn("p-4", "rounded-md", "border-2 border-gray-500/30", local.class)}>
      {local.children}
    </div>
  );
}

export function CardHeader(props: CardProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <div {...others} class={cn("mb-2", "text-2xl", "font-bold", local.class)}>
      {local.children}
    </div>
  );
}

export function CardContent(props: CardProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
      <div {...others} class={cn("p-4", local.class)}>
        {local.children}
      </div>
    );
}
