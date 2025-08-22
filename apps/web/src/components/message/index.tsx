import { MoreHorizontal, Smile } from "lucide-react";
import { memo, useMemo } from "react";
import type { Message } from "revolt.js";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { useUser } from "@/hooks/use-user";
import { MessageEmbeds } from "./components/message-embeds";
import { SystemMessageComponent } from "./components/system-message";
import { MemoizedDiv } from "./memoization/memoized-div";
import type { SystemMessageType } from "./types";
import {
	areAttachmentsEqual,
	areEmbedsEqual,
	areMessagesEqual,
} from "./utils/message-utils";
import { MessageAttachmentsWrapper } from "./wrappers/message-attachments-wrapper";
import { MessageAuthor } from "./wrappers/message-author";
import { MessageContentWrapper } from "./wrappers/message-content-wrapper";

interface MessageComponentProps {
	message?: Message;
}

/**
 * Minimal reactions row renderer. Revolt message shape may vary; this renders
 * any reaction summary available on `message.reactions` as simple pills.
 */
function ReactionsRow({ message }: { message: Message }) {
	const reactions = (message as any).reactions ?? {};
	const entries = Object.entries(reactions) as [string, any][];
	if (!entries.length) return null;

	return (
		<div className="flex gap-2 items-center mt-1">
			{entries.map(([emoji, react]) => {
				const count = react?.count ?? 1;
				return (
					<div
						key={emoji}
						className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border bg-muted/30 text-xs"
						title={`${count} reactions`}
					>
						<span>{emoji}</span>
						<span className="text-muted-foreground">{count}</span>
					</div>
				);
			})}
		</div>
	);
}

/**
 * Floating actions menu (simple icon button placeholder)
 */
function ActionsFloating() {
	return (
		<div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
			<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
				<MoreHorizontal className="h-4 w-4" />
			</Button>
		</div>
	);
}

const MessageComponent = memo(
	function MessageComponent({ message }: MessageComponentProps) {
		// Call hooks unconditionally at the top of the component to satisfy hook rules
		const { settings } = useSettings();
		const { user: currentUser } = useUser();

		// Timestamp formatting helper (safe if message is undefined)
		const timestamp = useMemo(() => {
			if (!message) return "";
			try {
				// message.createdAt may be a Date or string
				const d =
					(message as any).createdAt instanceof Date
						? (message as any).createdAt
						: new Date((message as any).createdAt);
				return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
			} catch {
				return "";
			}
		}, [message]);

		if (!message) return null;

		if (!message.author || message.systemMessage) {
			return (
				<SystemMessageComponent
					systemMessage={message.systemMessage as SystemMessageType}
				/>
			);
		}

		const design = (settings?.message_design as string) ?? "normal";

		const isOwn = currentUser ? message.author?.id === currentUser.id : false;

		if (design === "bubble") {
			// Bubble design places messages in chat bubble style, right for own messages
			return (
				<div
					className={`mx-2 my-3 flex ${isOwn ? "justify-end" : "justify-start"}`}
				>
					<div className={"relative group max-w-[80%]"}>
						<ActionsFloating />
						<div
							className={`p-3 rounded-xl break-words shadow-sm ${
								isOwn
									? "bg-blue-500 text-white rounded-br-none"
									: "bg-card text-foreground rounded-bl-none border border-border"
							}`}
						>
							{/* Header: show small name on top for other users (own messages can be just bubble) */}
							{!isOwn && (
								<div className="text-xs text-muted-foreground mb-1">
									{message.author?.displayName ??
										`${message.author?.username}#${message.author?.discriminator}`}
								</div>
							)}

							{/* Content (markdown) */}
							{message.content && (
								<MessageContentWrapper content={message.content} />
							)}

							{/* Reactions below content (recommended) */}
							<ReactionsRow message={message} />
						</div>

						{/* Separated embeds and attachments below bubble */}
						<div className="mt-2 space-y-2">
							<MessageEmbeds embeds={message.embeds} messageId={message.id} />
							<MessageAttachmentsWrapper attachments={message.attachments} />
						</div>

						{/* Timestamp small */}
						<div
							className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : ""}`}
						>
							{timestamp}
						</div>
					</div>
				</div>
			);
		}

		// Default: normal design
		return (
			<MemoizedDiv className="mx-2 my-3 p-3 rounded-md break-words overflow-hidden border border-border">
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-3">
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<MessageAuthor user={message.author} />
								<div className="text-xs text-muted-foreground">{timestamp}</div>
							</div>

							{/* Content */}
							{message.content && (
								<div className="mt-2">
									<MessageContentWrapper content={message.content} />
								</div>
							)}
						</div>
					</div>

					{/* Actions floating on header (always top right) */}
					<div className="ml-4">
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Embeds and attachments (normal flow) */}
				<div className="mt-3 space-y-2">
					<MessageEmbeds embeds={message.embeds} messageId={message.id} />
					<MessageAttachmentsWrapper attachments={message.attachments} />
				</div>

				{/* Footer: reactions and actions */}
				<div className="mt-2 flex items-center justify-between">
					<div>
						<ReactionsRow message={message} />
					</div>
					<div>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<Smile className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</MemoizedDiv>
		);
	},
	(prevProps, nextProps) => {
		const prev = prevProps.message;
		const next = nextProps.message;

		if (!prev || !next) return prev === next;
		if (!areMessagesEqual(prev, next)) return false;
		if (!areAttachmentsEqual(prev.attachments, next.attachments)) return false;
		return areEmbedsEqual(prev.embeds, next.embeds);
	},
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;
