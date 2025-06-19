"use client";
import { memo, useCallback } from "react";
import type { Message } from "revolt.js";
import { MessageAuthor } from "./message-author";
import { MessageContent } from "./message-content";
import { MessageAttachments } from "./message-attachments";
import { SystemMessageComponent } from "./system-message";
import type { SystemMessageType } from "./types";
import { MemoizedMotionDiv } from "./memoized-motion-div";

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
            return <SystemMessageComponent systemMessage={message.systemMessage as SystemMessageType} />;
        }

        // Extract message data
        const authorName = message.author?.username || "";
        const avatarUrl =
            message.author?.avatarURL || message.author?.defaultAvatarURL || "";

        return (
            <MemoizedMotionDiv className="z-1 mx-2 my-3 border border-border p-4 rounded-md flex flex-col gap-2">
                <MessageAuthor name={authorName} avatarUrl={avatarUrl} />
                <div className="space-y-1">
                    <MessageContent content={message.content} />
                    <MessageAttachments attachments={message.attachments} />
                </div>
            </MemoizedMotionDiv>
        );
    },
    // Custom comparison function for memo
    (prevProps, nextProps) => {
        const prevMessage = prevProps.message;
        const nextMessage = nextProps.message;
        
        // If both messages are null or undefined, they're equal
        if (!prevMessage && !nextMessage) return true;
        // If only one message is null or undefined, they're different
        if (!prevMessage || !nextMessage) return false;
        
        // Compare essential properties to determine if re-render is needed
        return (
            prevMessage.id === nextMessage.id &&
            prevMessage.content === nextMessage.content &&
            prevMessage.author?.id === nextMessage.author?.id &&
            prevMessage.systemMessage === nextMessage.systemMessage
        );
    },
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;
