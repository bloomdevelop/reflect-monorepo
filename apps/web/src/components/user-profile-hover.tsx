import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { User } from "revolt.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function HoverCardComponent({
	user,
}: {
	user: User;
}) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Avatar>
					<AvatarImage src={user.avatarURL} />
					<AvatarFallback>
						{user.username.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</HoverCardTrigger>
			<HoverCardContent className="w-[340px]">
				<div className="flex items-start gap-3">
					<Avatar>
						<AvatarImage src={user.avatarURL} />
						<AvatarFallback>
							{user.username.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						{user.displayName && (
							<p className="text-lg font-semibold">{user.displayName}</p>
						)}
						<p className="text-sm font-medium">
							@{user.username}#{user.discriminator}
						</p>
						<p className="text-muted-foreground text-sm">Bio Here</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
