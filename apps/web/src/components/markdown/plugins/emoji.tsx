import { useState } from "react";

import { emojiDictionary } from "@/assets/emojis";
import { parseEmoji } from "@/components/markdown/components/emoji";
import { createComponent, type CustomComponentProps } from "./remarkRegexComponent";
import { client } from "@/lib/revolt";
import Image from "next/image";

const RE_EMOJI = /:([a-zA-Z0-9\-_]+):/g;
const RE_ULID = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

export function RenderEmoji({ match }: CustomComponentProps) {
    const [fail, setFail] = useState(false);
    const url = RE_ULID.test(match)
        ? `${
              client.configuration?.features
                  .autumn.url
          }/emojis/${match}`
        : parseEmoji(
              match in emojiDictionary
                  ? emojiDictionary[match as keyof typeof emojiDictionary]
                  : match,
          );

    if (fail) return <span>{`:${match}:`}</span>;

    return (
        <Image
            alt={`:${match}:`}
            loading="lazy"
            className="object-contain  m-[0.05em] inline-block align-middle bg-muted"
            draggable={false}
            src={url}
            onError={() => setFail(true)}
        />
    );
}

export const remarkEmoji = createComponent(
    "emoji",
    RE_EMOJI,
    (match) => match in emojiDictionary || RE_ULID.test(match),
);

export function isOnlyEmoji(text: string) {
    return text.replaceAll(RE_EMOJI, "").trim().length === 0;
}