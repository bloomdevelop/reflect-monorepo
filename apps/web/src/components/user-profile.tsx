import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { client } from "@/lib/revolt";
import { Info, User as UserIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { User, UserProfile } from "revolt.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function UserProfileDialog({
	user,
	open,
	onClose,
}: {
	user: User;
	open: boolean;
	onClose: () => void;
}) {
	const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
	useEffect(() => {
		async function fetchUserProfile() {
			const userProfile = await client.users.get(user.id)?.fetchProfile();
			if (userProfile) {
				setUserInfo(userProfile);
			}
		}

		if (open) {
			fetchUserProfile();
		}
	}, [open, user.id]);

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) onClose();
			}}
		>
			<DialogContent className="max-w-sm p-0 overflow-hidden">
				<DialogHeader className="relative p-6 pb-0">
					<DialogTitle className="flex items-center gap-2">
						<UserIcon className="w-5 h-5 text-primary" />
						Profile
					</DialogTitle>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							aria-label="Close profile dialog"
						>
							<X className="w-5 h-5" />
						</Button>
					</DialogClose>
				</DialogHeader>
				<div className="flex flex-col items-center gap-3 px-6 pb-6 pt-2">
					<Avatar>
						<AvatarImage
							src={user.avatarURL || undefined}
							alt={`${user.username}'s avatar`}
						/>
						<AvatarFallback>
							{user.username.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<h2 className="text-lg font-semibold">{user.username}</h2>
					{user.status && (
						<span className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-300">
							{user.status.presence}
						</span>
					)}
					{userInfo?.content && (
						<div className="flex items-center gap-1 mt-2 text-zinc-500 dark:text-zinc-300 text-sm">
							<Info className="w-4 h-4" />
							<span>{userInfo.content}</span>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
