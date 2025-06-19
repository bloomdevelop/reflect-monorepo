import { memo, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const MessageAuthor = memo(
    ({ name, avatarUrl }: { name: string; avatarUrl: string }) => {
        // Memoize the first letter to prevent recalculation on re-renders
        const firstLetter = useMemo(() => name.charAt(0).toUpperCase(), [name]);

        return (
            <div className="flex flex-row items-center gap-3">
                <Avatar>
                    <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
                    <AvatarFallback>{firstLetter}</AvatarFallback>
                </Avatar>
                <p>{name}</p>
            </div>
        );
    },
);
MessageAuthor.displayName = "MessageAuthor";
