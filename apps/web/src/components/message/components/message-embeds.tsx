import { memo } from "react";
import type { MessageEmbed } from "revolt.js";
import { MessageEmbedComponent } from "./message-embed";

interface MessageEmbedsProps {
	embeds?: MessageEmbed[];
	messageId: string;
}

export const MessageEmbeds = memo(
	({ embeds, messageId }: MessageEmbedsProps) => {
		if (!embeds?.length) return null;

		return (
			<>
				{embeds.map((embed, index) => (
					<div
						key={`${messageId}-embed-${"id" in embed && embed.id ? embed.id : index}`}
						className="w-full min-w-0"
					>
						<MessageEmbedComponent embed={embed} />
					</div>
				))}
			</>
		);
	},
);

MessageEmbeds.displayName = "MessageEmbeds";
