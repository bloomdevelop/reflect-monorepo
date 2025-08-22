import { memo } from "react";
import { MessageContent } from "../components/message-content";

interface MessageContentWrapperProps {
	content: string;
}

export const MessageContentWrapper = memo(
	({ content }: MessageContentWrapperProps) => (
		<div className="w-full min-w-0">
			<MessageContent content={content} />
		</div>
	),
);

MessageContentWrapper.displayName = "MessageContentWrapper";
