import Link from "next/link";

import { createComponent, type  CustomComponentProps } from "./remarkRegexComponent";
import { client } from "@/lib/revolt";

export function RenderChannel({ match }: CustomComponentProps) {
    const channel = client.channels.get(match);

    if (!channel) {
        return <span>#unknown-channel</span>;
    }

    return (
        <Link
            href={`${
                channel.serverId ? `/app/server/${channel.serverId}` : ""
            }/channel/${match}`}>{`#${channel.name}`}</Link>
    );
}

export const remarkChannels = createComponent(
    "channel",
    /<#([A-z0-9]{26})>/g,
    (match) => client.channels.has(match)
);