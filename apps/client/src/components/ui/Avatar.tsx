import { Avatar as ArkAvatar } from "@ark-ui/solid";
import { splitProps } from "solid-js";

interface AvatarProps {
    src: string,
    alt: string,
    fallback: string,
    class?: string
}

export default function Avatar(props: AvatarProps) {
    const [local, _] = splitProps(props, ["alt", "src", "fallback", "class"]);

    return (
        <ArkAvatar.Root class={local.class}>
            <ArkAvatar.Fallback>{local.fallback}</ArkAvatar.Fallback>
            <ArkAvatar.Image alt={local.alt} src={local.src} />
        </ArkAvatar.Root>
    );
}