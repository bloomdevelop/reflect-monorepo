import { memo } from "react";
import type { File } from "revolt.js";
import { MessageAttachments } from "../components/message-attachments";

interface MessageAttachmentsWrapperProps {
	attachments?: File[];
}

export const MessageAttachmentsWrapper = memo(
	({ attachments }: MessageAttachmentsWrapperProps) => {
		if (!attachments?.length) return null;

		return (
			<div className="w-full min-w-0">
				<MessageAttachments attachments={attachments} />
			</div>
		);
	},
);

MessageAttachmentsWrapper.displayName = "MessageAttachmentsWrapper";
