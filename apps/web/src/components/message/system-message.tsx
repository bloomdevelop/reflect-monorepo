import { memo } from "react";
import { MessageContent } from "./message-content";
import type { SystemMessageType } from "./types";

export function SystemMessageComponent({ systemMessage }: { systemMessage: SystemMessageType }) {
  // Helper to get username from userId/byId/fromId/toId if available on the message object
  const getUsername = (id?: string) => {
    // Try to find a username in the systemMessage object (if hydrated)
    if (!id) return undefined;
    // If the backend hydrated usernames, use them; otherwise, fallback to ID
    // You can enhance this to use a user map/context if available
    const usernameMap = systemMessage as Record<string, unknown>;
    return (typeof usernameMap[`${id}_username`] === "string"
        ? (usernameMap[`${id}_username`] as string)
        : undefined) || id;
  };

  let content = null;
  switch (systemMessage?.type) {
    case "text":
      content = <MessageContent content={systemMessage.content || ""} />;
      break;
    case "user_joined":
      content = <MessageContent content={`${getUsername(systemMessage.userId) || "A user"} joined the chat`} />;
      break;
    case "user_left":
      content = <MessageContent content={`${getUsername(systemMessage.userId) || "A user"} left the chat`} />;
      break;
    case "user_kicked":
      content = <MessageContent content={`${getUsername(systemMessage.userId) || "A user"} was kicked from the chat`} />;
      break;
    case "user_banned":
      content = <MessageContent content={`${getUsername(systemMessage.userId) || "A user"} was banned from the chat`} />;
      break;
    case "user_added":
      content = <MessageContent content={`${getUsername(systemMessage.userId) || "A user"} was added to the chat by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    case "user_remove":
      content = <MessageContent content={`${getUsername(systemMessage.userId) || "A user"} was removed from the chat by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    case "channel_renamed":
      content = <MessageContent content={`Channel was renamed to "${systemMessage.name || "(unknown)"}" by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    case "channel_description_changed":
      content = <MessageContent content={`Channel description was changed by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    case "channel_icon_changed":
      content = <MessageContent content={`Channel icon was changed by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    case "channel_ownership_changed":
      content = <MessageContent content={`Channel ownership was transferred from ${getUsername(systemMessage.fromId) || "someone"} to ${getUsername(systemMessage.toId) || "someone else"}`} />;
      break;
    case "message_pinned":
      content = <MessageContent content={`A message was pinned by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    case "message_unpinned":
      content = <MessageContent content={`A message was unpinned by ${getUsername(systemMessage.byId) || "someone"}`} />;
      break;
    default:
      content = <MessageContent content={systemMessage?.type ? `${systemMessage.type} is not supported.` : "System message"} />;
  }
  return (
    <div className="mx-2 my-3 p-4 rounded-md text-center text-xs text-muted-foreground bg-muted/40 border border-dashed border-border">
      {content}
    </div>
  );
}
