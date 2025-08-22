import { memo } from "react";
import type { User } from "revolt.js";
import HoverCardComponent from "../../user-profile-hover";

export const MessageAuthor = memo(({ user }: { user: User }) => {
	return (
		<div className="flex flex-row items-center gap-3">
			<HoverCardComponent user={user} />
			{user.displayName ? (
				<p className="text-sm font-medium break-words">{user.displayName}</p>
			) : (
				<p className="text-sm font-medium break-words">
					{user.username}#{user.discriminator}
				</p>
			)}
		</div>
	);
});
MessageAuthor.displayName = "MessageAuthor";
