import { memo } from "react";

// Extract the message content component to prevent re-renders
export const MessageContent = memo(({ content }: { content: string }) =>
    content ? <p className="whitespace-pre-wrap break-words">{content}</p> : null,
);
