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
			<MemoizedDiv className="relative mx-2 my-3 border border-border p-4 rounded-md flex flex-col gap-2">
				<MessageAuthor user={message.author} />
				<div className="space-y-1">
					<MessageContent content={message.content} />
					{message.embeds?.map((embed, index) => (
						<MessageEmbedComponent
							key={`${message.id}-embed-${index}`}
							embed={embed}
						/>
					))}
					<MessageAttachments attachments={message.attachments} />
				</div>
			</MemoizedDiv>
		);
	},
	// Improved custom comparison function for memo
	(prevProps, nextProps) => {
		const prevMessage = prevProps.message;
		const nextMessage = nextProps.message;

		// Both null/undefined
		if (!prevMessage && !nextMessage) return true;
		// Only one is null/undefined
		if (!prevMessage || !nextMessage) return false;

		// Compare essential properties
		if (prevMessage.id !== nextMessage.id) return false;
		if (prevMessage.content !== nextMessage.content) return false;
		if ((prevMessage.author?.id || null) !== (nextMessage.author?.id || null))
			return false;
		if (prevMessage.systemMessage !== nextMessage.systemMessage) return false;

		// Compare embeds shallowly by stringified content
		const prevEmbeds = prevMessage.embeds || [];
		const nextEmbeds = nextMessage.embeds || [];
		if (prevEmbeds.length !== nextEmbeds.length) return false;
		for (let i = 0; i < prevEmbeds.length; i++) {
			if (JSON.stringify(prevEmbeds[i]) !== JSON.stringify(nextEmbeds[i]))
				return false;
		}
		return true;
	},
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;
