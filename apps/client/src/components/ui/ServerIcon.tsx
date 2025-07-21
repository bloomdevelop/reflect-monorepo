import { A } from "@solidjs/router";
import type { Server } from "revolt.js";
import { cn } from "~/lib/styling";

interface ServerIconProps {
    server: Server | undefined;
}

export default function ServerIcon(props: ServerIconProps) {
    if (!props.server) return null;
    return (
        <A href={`/app/server/${props.server.id}`} class={cn(
            "size-14 rounded-md bg-neutral-300 hover:rounded-2xl transition-all duration-300",
            "flex items-center justify-center",
            "overflow-hidden"
        )}>
            {props.server.iconURL ? <img src={props.server.iconURL} class="object-cover"/> : <span>{props.server.name.substring(0,1)}</span>}
            
        </A>
    )
}