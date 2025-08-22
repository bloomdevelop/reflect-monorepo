import type { Message, MessageEmbed, File } from "revolt.js";

// Utility function to compare message embeds
export const areEmbedsEqual = (
	prev: MessageEmbed[] = [],
	next: MessageEmbed[] = [],
): boolean => {
	if (prev.length !== next.length) return false;

	return prev.every((embed, i) => {
		const other = next[i];
		if (!other) return false;

		if ("id" in embed && "id" in other && embed.id && other.id) {
			return embed.id === other.id;
		}
		if ("url" in embed && "url" in other && embed.url && other.url) {
			return embed.url === other.url;
		}
		return embed.type === other.type;
	});
};

// Utility function to compare message attachments
export const areAttachmentsEqual = (
	prev: File[] = [],
	next: File[] = [],
): boolean => {
	return (
		prev.length === next.length &&
		prev.every((file, i) => file.id === next[i]?.id)
	);
};

// Utility function to compare messages
export const areMessagesEqual = (prev: Message, next: Message): boolean => {
	return (
		prev.id === next.id &&
		prev.content === next.content &&
		prev.editedAt?.getTime() === next.editedAt?.getTime()
	);
};
