import { A } from "@solidjs/router";
import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/styling";

interface LinkProps {
  href: string;
  children: JSX.Element;
}

export default function Link(props: LinkProps) {
  const [local, others] = splitProps(props, ["href", "children"]);

  const isExternal =
    local.href.startsWith("http://") || local.href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        class={cn(
          "text-blue-500 hover:underline",
          "dark:text-blue-400 dark:hover:underline"
        )}
        {...others}
        href={local.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {local.children}
      </a>
    );
  }

  return (
    <A
      class={cn(
        "text-blue-500 hover:underline",
        "dark:text-blue-400 dark:hover:underline"
      )}
      {...others}
      href={local.href}
    >
      {local.children}
    </A>
  );
}
