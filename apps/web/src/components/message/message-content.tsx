import { memo } from "react";
import Markdown from "../markdown/markdown";
import ReactMarkdown from "react-markdown";

// Extract the message content component to prevent re-renders
export const MessageContent = memo(
	({
		content,
		useNewMarkdown,
	}: { content: string; useNewMarkdown?: boolean }) => (
		<div className="w-full min-w-0 break-all">
			{useNewMarkdown ? (
				<Markdown content={content} />
			) : content ? (
				<ReactMarkdown>{content}</ReactMarkdown>
			) : null}
		</div>
	),
);
