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
import type { SystemMessageType } from "../types";

// Icon and color mapping for system message types
const SYSTEM_MESSAGE_STYLES: Record<string, { icon: ReactNode }> = {
	text: { icon: <MessageCircleIcon /> },
	user_joined: {
		icon: <UserPlusIcon />,
	},
	user_left: { icon: <LogOut /> },
	user_kicked: { icon: <UserMinus /> },
	user_banned: { icon: <HammerIcon /> },
	user_added: { icon: <UserPlus /> },
	user_remove: { icon: <UserMinus /> },
	channel_renamed: { icon: <Pen /> },
	channel_description_changed: {
		icon: <Pen />,
	},
	channel_icon_changed: {
		icon: <Image />,
	},
	channel_ownership_changed: {
		icon: <Replace />,
	},
	message_pinned: { icon: <Pin /> },
	message_unpinned: {
		icon: <PinOff />,
	},
};

function getUsername(systemMessage: SystemMessageType, id?: string) {
	if (!id) return undefined;
	const usernameMap = systemMessage as Record<string, unknown>;
	return (
		(typeof usernameMap[`${id}_username`] === "string"
			? (usernameMap[`${id}_username`] as string)
			: undefined) ?? id
	);
}

function getTextContent(systemMessage: SystemMessageType) {
	return <MessageContent content={systemMessage.content ?? ""} />;
}

function getUserJoinedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) ?? "A user"} joined the server`}
		/>
	);
}

function getUserLeftContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) ?? "A user"} left the server`}
		/>
	);
}

function getUserKickedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) ?? "A user"} was kicked from the server`}
		/>
	);
}

function getUserBannedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) ?? "A user"} was banned from the server`}
		/>
	);
}

function getUserAddedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) ?? "A user"} was added to the server by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
		/>
	);
}

function getUserRemoveContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`${getUsername(systemMessage, systemMessage.userId) ?? "A user"} was removed from the server by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
		/>
	);
}

function getChannelRenamedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel was renamed to "${systemMessage.name ?? "(unknown)"}" by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
		/>
	);
}

function getChannelDescriptionChangedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel description was changed by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
		/>
	);
}

function getChannelIconChangedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel icon was changed by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
		/>
	);
}

function getChannelOwnershipChangedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`Channel ownership was transferred from ${getUsername(systemMessage, systemMessage.fromId) ?? "someone"} to ${getUsername(systemMessage, systemMessage.toId) ?? "someone else"}`}
		/>
	);
}

function getMessagePinnedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`A message was pinned by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
		/>
	);
}

function getMessageUnpinnedContent(systemMessage: SystemMessageType) {
	return (
		<MessageContent
			content={`A message was unpinned by ${getUsername(systemMessage, systemMessage.byId) ?? "someone"}`}
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
}: {
	systemMessage: SystemMessageType;
}) {
	if (!systemMessage) {
		return null;
	}

	const type = systemMessage?.type ?? "default";
	const getContent = SYSTEM_MESSAGE_CONTENT_MAP[type];
	const content = getContent ? getContent(systemMessage) : null;

	const { icon } = SYSTEM_MESSAGE_STYLES[type] || { icon: null };

	if (!content) {
		return null;
	}

	return (
		<div
			className={
				"w-full my-3 mx-2 p-4 rounded-md text-center text-xs flex items-center gap-2 border border-dashed text-muted-foreground shadow"
			}
			style={{ justifyContent: "center" }}
		>
			<span className="text-lg" aria-hidden="true">
				{icon}
			</span>
			<span>{content}</span>
		</div>
	);
}
