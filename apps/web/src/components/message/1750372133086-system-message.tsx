import {
	HammerIcon,
	Image,
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

function getUsername(systemMessage: SystemMessageType, id?: string) {
	if (!id) return undefined;
	const usernameMap = systemMessage as Record<string, unknown>;
	return (
		(typeof usernameMap[`${id}_username`] === "string"
			? (usernameMap[`${id}_username`] as string)
			: undefined) || id
	);
}

function getTextContent(systemMessage: SystemMessageType) {
	return <MessageContent content={systemMessage.content || ""} />;
}

function getUserJoinedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) || "A user"} joined the server`}
		/>
	);
}

function getUserLeftContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) || "A user"} left the server`}
		/>
	);
}

function getUserKickedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) || "A user"} was kicked from the server`}
		/>
	);
}

function getUserBannedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) || "A user"} was banned from the server`}
		/>
	);
}

function getUserAddedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) || "A user"} was added to the server by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

function getUserRemoveContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) || "A user"} was removed from the server by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

function getChannelRenamedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel was renamed to "${systemMessage.name || "(unknown)"}" by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

function getChannelDescriptionChangedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel description was changed by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

function getChannelIconChangedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel icon was changed by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

function getChannelOwnershipChangedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel ownership was transferred from ${getUsername(systemMessage, systemMessage.fromId) || "someone"} to ${getUsername(systemMessage, systemMessage.toId) || "someone else"}`}
		/>
	);
}

function getMessagePinnedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`A message was pinned by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

function getMessageUnpinnedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`A message was unpinned by ${getUsername(systemMessage, systemMessage.byId) || "someone"}`}
		/>
	);
}

const SYSTEM_MESSAGE_CONTENT_MAP: Record<
	string,
	(systemMessage: SystemMessageType) => ReactNode
> = {
	text: getTextContent,
	user_joined: getUserJoinedContent,
	user_left: getUserLeftContent,
	user_kicked: getUserKickedContent,
	user_banned: getUserBannedContent,
	user_added: getUserAddedContent,
	user_remove: getUserRemoveContent,
	channel_renamed: getChannelRenamedContent,
	channel_description_changed: getChannelDescriptionChangedContent,
	channel_icon_changed: getChannelIconChangedContent,
	channel_ownership_changed: getChannelOwnershipChangedContent,
	message_pinned: getMessagePinnedContent,
	message_unpinned: getMessageUnpinnedContent,
};

export function SystemMessageComponent({
	systemMessage,
}: { systemMessage: SystemMessageType }) {
	if (!systemMessage) {
		return null;
	}

	const type = systemMessage?.type || "default";
	const getContent = SYSTEM_MESSAGE_CONTENT_MAP[type];
	const content = getContent ? getContent(systemMessage) : null;

	const { icon, color } =
		SYSTEM_MESSAGE_STYLES[type] || SYSTEM_MESSAGE_STYLES.default;

	if (!content) {
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
