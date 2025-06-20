import { memo } from "react";
import type { Message, MessageEmbed } from "revolt.js";
import { MemoizedDiv } from "./memoized-div";
import { MessageAttachments } from "./message-attachments";
import { MessageAuthor } from "./message-author";
import { MessageContent } from "./message-content";
import MessageEmbedComponent from "./message-embed";
import { SystemMessageComponent } from "./system-message";
import type { SystemMessageType } from "./types";

function areEmbedsEqual(
  prev: MessageEmbed[] = [],
  next: MessageEmbed[] = []
): boolean {
  if (prev.length !== next.length) return false;
  return prev.every((embed, i) => {
    const other = next[i];
    if (!other) return false;
    // Compare by id if available, otherwise fallback to url or type
    if ("id" in embed && "id" in other && embed.id && other.id) {
      return embed.id === other.id;
    }
    if ("url" in embed && "url" in other && embed.url && other.url) {
      return embed.url === other.url;
    }
    // Fallback: compare type and basic fields
    return embed.type === other.type;
  });
}

// Memoized component for message content to prevent unnecessary re-renders
const MessageContentWrapper = memo(({ content }: { content: string }) => (
  <div className="w-full min-w-0">
    <MessageContent content={content} />
  </div>
));
MessageContentWrapper.displayName = "MessageContentWrapper";

interface EmbedType extends MessageEmbed {}

// Memoized component for embeds
const MessageEmbeds = memo(({ embeds, messageId }: { embeds?: EmbedType[], messageId: string }) => {
  if (!embeds || embeds.length === 0) return null;
  
  return (
    <>
      {embeds.map((embed, index) => (
        <div key={`${messageId}-embed-${'id' in embed && embed.id ? embed.id : index}`} className="w-full min-w-0">
          <MessageEmbedComponent embed={embed} />
        </div>
      ))}
    </>
  );
});
MessageEmbeds.displayName = "MessageEmbeds";

import type { File } from "revolt.js";

// Memoized component for attachments
const MessageAttachmentsWrapper = memo(({ attachments }: { attachments?: File[] }) => {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className="w-full min-w-0">
      <MessageAttachments attachments={attachments} />
    </div>
  );
});
MessageAttachmentsWrapper.displayName = "MessageAttachmentsWrapper";

// Helper function to compare message metadata
const areMessagesEqual = (prev: Message, next: Message): boolean => {
  if (prev.id !== next.id) return false;
  if (prev.content !== next.content) return false;
  
  const prevTime = prev.editedAt?.getTime();
  const nextTime = next.editedAt?.getTime();
  return prevTime === nextTime;
};

// Helper function to compare arrays of attachments
const areAttachmentsEqual = (prev: File[] = [], next: File[] = []): boolean => {
  if (prev.length !== next.length) return false;
  return !prev.some((att, i) => att.id !== next[i]?.id);
};

const MessageComponent = memo(
  function MessageComponent({ message }: { message?: Message }) {
    // Return early if no message
    if (!message) return null;

    // System message detection
    if (!message.author || message.systemMessage) {
      return <SystemMessageComponent systemMessage={message.systemMessage as SystemMessageType} />;
    }


    return (
      <MemoizedDiv className="mx-2 my-3 border border-border p-4 rounded-md flex flex-col gap-2 break-words overflow-hidden">
        <MessageAuthor user={message.author} />
        {message.content && <MessageContentWrapper content={message.content} />}
        <MessageEmbeds embeds={message.embeds} messageId={message.id} />
        <MessageAttachmentsWrapper attachments={message.attachments} />
      </MemoizedDiv>
    );
  },
  (prevProps, nextProps) => {
    const prevMessage = prevProps.message;
    const nextMessage = nextProps.message;

    // Handle null/undefined cases
    if (!prevMessage || !nextMessage) return prevMessage === nextMessage;
    if (!areMessagesEqual(prevMessage, nextMessage)) return false;
    if (!areAttachmentsEqual(prevMessage.attachments, nextMessage.attachments)) return false;
    if (!areEmbedsEqual(prevMessage.embeds, nextMessage.embeds)) return false;

    return true;
  }
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;

