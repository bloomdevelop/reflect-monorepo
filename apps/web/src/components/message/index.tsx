import { memo } from "react";
import type { Message } from "revolt.js";
import { MemoizedDiv } from "./memoized-div";
import { MessageAttachments } from "./message-attachments";
import { MessageAuthor } from "./message-author";
import { MessageContent } from "./message-content";
import MessageEmbedComponent from "./message-embed";
import { SystemMessageComponent } from "./system-message";
import type { SystemMessageType } from "./types";

const MessageComponent = memo(
	function MessageComponent({
		message,
	}: {
		message?: Message;
	}) {
		// Return early if no message
		if (!message) return null;

		// System message detection: no author, or a system flag (customize as needed)
		const isSystem = !message.author || message.systemMessage;

		if (isSystem) {
			return (
				<SystemMessageComponent
					systemMessage={message.systemMessage as SystemMessageType}
				/>
			);
		}

		return (
			<MemoizedDiv className="mx-2 my-3 border border-border p-4 rounded-md flex flex-col gap-2 break-words overflow-hidden">
				<MessageAuthor user={message.author} />

				{message.content && (
					<div className="w-full min-w-0">
						<MessageContent content={message.content} />
					</div>
				)}


				{message.embeds?.map((embed, index) => (
					<div key={`${message.id}-embed-${index}`} className="w-full min-w-0">
						<MessageEmbedComponent
							embed={embed}
						/>
					</div>
				))}

				{message.attachments && message.attachments.length > 0 && (
					<div className="w-full min-w-0">
						<MessageAttachments attachments={message.attachments} />
					</div>
				)}
			</MemoizedDiv>
		);
	},
	(prevProps, nextProps) => {
		const prevMessage = prevProps.message;
		const nextMessage = nextProps.message;

		if (!prevMessage || !nextMessage) return prevMessage === nextMessage;

		// Simple comparison for most message properties
		if (
			prevMessage.id !== nextMessage.id ||
			prevMessage.content !== nextMessage.content ||
			prevMessage.editedAt?.getTime() !== nextMessage.editedAt?.getTime()
		)
			return false;

		// Compare attachments
		if (
			JSON.stringify(prevMessage.attachments) !==
			JSON.stringify(nextMessage.attachments)
		)
			return false;

		// Define types for embed objects
		interface BaseEmbed {
			type: string;
			url?: string;
		}

		interface WebsiteEmbed extends BaseEmbed {
			type: "Website";
			title?: string;
			description?: string;
			siteName?: string;
			iconUrl?: string;
			colour?: string;
		}

		interface TextEmbed extends BaseEmbed {
			type: "Text";
			title?: string;
			description?: string;
			iconUrl?: string;
			colour?: string;
		}

		interface MediaEmbed extends BaseEmbed {
			type: "Image" | "Video";
			width?: number;
			height?: number;
		}

		type EmbedUnion = WebsiteEmbed | TextEmbed | MediaEmbed;

		// Custom safe stringify function that handles MessageEmbed and other non-serializable types
		const safeStringify = (obj: unknown): string => {
			if (obj === null || obj === undefined) return String(obj);

			// Handle MessageEmbed objects
			if (typeof obj === "object" && obj !== null && "type" in obj) {
				const embed = obj as EmbedUnion;
				const serialized: Record<string, unknown> = { type: embed.type };

				// Handle different embed types
				switch (embed.type) {
					case "Website": {
						const webEmbed = embed as WebsiteEmbed;
						serialized.title = webEmbed.title;
						serialized.description = webEmbed.description;
						serialized.url = webEmbed.url;
						serialized.siteName = webEmbed.siteName;
						serialized.iconUrl = webEmbed.iconUrl;
						serialized.colour = webEmbed.colour;
						break;
					}
					case "Text": {
						const textEmbed = embed as TextEmbed;
						serialized.title = textEmbed.title;
						serialized.description = textEmbed.description;
						serialized.url = textEmbed.url;
						serialized.iconUrl = textEmbed.iconUrl;
						serialized.colour = textEmbed.colour;
						break;
					}
					case "Image":
					case "Video": {
						const mediaEmbed = embed as MediaEmbed;
						serialized.url = mediaEmbed.url;
						serialized.width = mediaEmbed.width;
						serialized.height = mediaEmbed.height;
						break;
					}
				}
				return JSON.stringify(serialized);
			}

			// Handle other non-serializable types
			if (typeof obj === "bigint") return obj.toString();
			if (typeof obj === "object") {
				return JSON.stringify(obj, (key, value) => {
					if (typeof value === "bigint") return value.toString();
					return value;
				});
			}

			return JSON.stringify(obj);
		};

		// Compare embeds
		const prevEmbeds = prevMessage.embeds || [];
		const nextEmbeds = nextMessage.embeds || [];
		if (prevEmbeds.length !== nextEmbeds.length) return false;
		for (let i = 0; i < prevEmbeds.length; i++) {
			if (safeStringify(prevEmbeds[i]) !== safeStringify(nextEmbeds[i]))
				return false;
		}
		return true;
	},
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;
