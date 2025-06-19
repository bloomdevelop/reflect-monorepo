import {
	HammerIcon,
	Image,
	Info,
	LogOut,
	MessageCircleIcon,
	Pen,
	Pin,
	PinOff,
	Replace,
	UserMinus,
	UserPlus,
	UserPlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { MessageContent } from "./message-content";
import type { SystemMessageType } from "./types";

// Icon and color mapping for system message types
const SYSTEM_MESSAGE_STYLES: Record<
	string,
	{ icon: ReactNode; color: string }
> = {
	text: { icon: <MessageCircleIcon />, color: "border-blue-400 bg-blue-50" },
	user_joined: {
		icon: <UserPlusIcon />,
		color: "border-green-400 bg-green-50",
	},
	user_left: { icon: <LogOut />, color: "border-yellow-400 bg-yellow-50" },
	user_kicked: { icon: <UserMinus />, color: "border-red-400 bg-red-50" },
	user_banned: { icon: <HammerIcon />, color: "border-red-600 bg-red-100" },
	user_added: { icon: <UserPlus />, color: "border-green-400 bg-green-50" },
	user_remove: { icon: <UserMinus />, color: "border-yellow-400 bg-yellow-50" },
	channel_renamed: { icon: <Pen />, color: "border-purple-400 bg-purple-50" },
	channel_description_changed: {
		icon: <Pen />,
		color: "border-purple-400 bg-purple-50",
	},
	channel_icon_changed: {
		icon: <Image />,
		color: "border-purple-400 bg-purple-50",
	},
	channel_ownership_changed: {
		icon: <Replace />,
		color: "border-blue-400 bg-blue-50",
	},
	message_pinned: { icon: <Pin />, color: "border-orange-400 bg-orange-50" },
	message_unpinned: {
		icon: <PinOff />,
		color: "border-orange-400 bg-orange-50",
	},
};

export function SystemMessageComponent({
	systemMessage,
}: { systemMessage: SystemMessageType }) {
	if (!systemMessage) {
		return null;
	}
	// Helper to get username from userId/byId/fromId/toId if available on the message object
	const getUsername = (id?: string) => {
		// Try to find a username in the systemMessage object (if hydrated)
		if (!id) return undefined;
		// If the backend hydrated usernames, use them; otherwise, fallback to ID
		// You can enhance this to use a user map/context if available
		const usernameMap = systemMessage as Record<string, unknown>;
		return (
			(typeof usernameMap[`${id}_username`] === "string"
				? (usernameMap[`${id}_username`] as string)
				: undefined) || id
		);
	};

	let content = null;
	const type = systemMessage?.type || "default";
	switch (type) {
		case "text":
			content = <MessageContent content={systemMessage.content || ""} />;
			break;
		case "user_joined":
			content = (
				<MessageContent
					content={`${getUsername(systemMessage.userId) || "A user"} joined the server`}
				/>
			);
			break;
		case "user_left":
			content = (
				<MessageContent
					content={`${getUsername(systemMessage.userId) || "A user"} left the server`}
				/>
			);
			break;
		case "user_kicked":
			content = (
				<MessageContent
					content={`${getUsername(systemMessage.userId) || "A user"} was kicked from the server`}
				/>
			);
			break;
		case "user_banned":
			content = (
				<MessageContent
					content={`${getUsername(systemMessage.userId) || "A user"} was banned from the server`}
				/>
			);
			break;
		case "user_added":
			content = (
				<MessageContent
					content={`${getUsername(systemMessage.userId) || "A user"} was added to the server by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		case "user_remove":
			content = (
				<MessageContent
					content={`${getUsername(systemMessage.userId) || "A user"} was removed from the server by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		case "channel_renamed":
			content = (
				<MessageContent
					content={`Channel was renamed to "${systemMessage.name || "(unknown)"}" by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		case "channel_description_changed":
			content = (
				<MessageContent
					content={`Channel description was changed by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		case "channel_icon_changed":
			content = (
				<MessageContent
					content={`Channel icon was changed by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		case "channel_ownership_changed":
			content = (
				<MessageContent
					content={`Channel ownership was transferred from ${getUsername(systemMessage.fromId) || "someone"} to ${getUsername(systemMessage.toId) || "someone else"}`}
				/>
			);
			break;
		case "message_pinned":
			content = (
				<MessageContent
					content={`A message was pinned by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		case "message_unpinned":
			content = (
				<MessageContent
					content={`A message was unpinned by ${getUsername(systemMessage.byId) || "someone"}`}
				/>
			);
			break;
		default:
			content = null;
	}

	const { icon, color } =
		SYSTEM_MESSAGE_STYLES[type] || SYSTEM_MESSAGE_STYLES.default;

	if (!content) {
		// If no content is generated, return null to avoid rendering an empty message
		return null;
	}

	return (
		<div
			className={`mx-auto w-fit my-3 p-4 rounded-md text-center text-xs flex items-center gap-2 border border-dashed ${color} text-muted-foreground shadow`}
			style={{ justifyContent: "center" }}
		>
			<span className="text-lg" aria-hidden="true">
				{icon}
			</span>
			<span>{content}</span>
		</div>
	);
}
