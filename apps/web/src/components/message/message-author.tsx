import { memo, useMemo } from "react";
import type { User } from "revolt.js";
import HoverCardComponent from "../user-profile-hover";

export const MessageAuthor = memo(({ user }: { user: User }) => {
	return (
		<div className="flex flex-row items-center gap-3">
			<HoverCardComponent user={user} />
			{user.displayName ? (
				<p className="text-lg font-semibold">{user.displayName}</p>
			) : (
				<p>
					{user.username}#{user.discriminator}
				</p>
			)}
		</div>
	);
});
MessageAuthor.displayName = "MessageAuthor";
