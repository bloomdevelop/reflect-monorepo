import { memo } from "react";
import type { Message } from "revolt.js";
import { MemoizedDiv } from "./memoization/memoized-div";
import { MessageAuthor } from "./wrappers/message-author";
import { SystemMessageComponent } from "./components/system-message";
import type { SystemMessageType } from "./types";
import { areMessagesEqual, areAttachmentsEqual, areEmbedsEqual } from "./utils/message-utils";
import { MessageContentWrapper } from "./wrappers/message-content-wrapper";
import { MessageEmbeds } from "./components/message-embeds";
import { MessageAttachmentsWrapper } from "./wrappers/message-attachments-wrapper";

interface MessageComponentProps {
  message?: Message;
}

const MessageComponent = memo(
  function MessageComponent({ message }: MessageComponentProps) {
    if (!message) return null;

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
    const prev = prevProps.message;
    const next = nextProps.message;

    if (!prev || !next) return prev === next;
    if (!areMessagesEqual(prev, next)) return false;
    if (!areAttachmentsEqual(prev.attachments, next.attachments)) return false;
    return areEmbedsEqual(prev.embeds, next.embeds);
  }
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;

