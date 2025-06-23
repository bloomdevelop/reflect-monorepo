import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { client } from "@/lib/revolt";
import { Info, User as UserIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { User, UserProfile } from "revolt.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Markdown from "./markdown/markdown";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Badge } from "./ui/badge";

export default function UserProfileDialog({
	user,
	open,
	useNewMarkdown,
	onClose,
}: {
	user: User;
	open: boolean;
	useNewMarkdown?: boolean;
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

	// Convert banner which may be a File object into a string URL that Next.js <Image> can consume
	let bannerSrc: string | undefined;
	if (userInfo?.banner) {
		if (typeof userInfo.banner === "string") {
			bannerSrc = userInfo.banner;
		} else if (typeof window !== "undefined") {
			bannerSrc = userInfo.bannerURL;
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) onClose();
			}}
		>
			<DialogContent className="w-full min-w-4xl p-0 overflow-hidden">
				<DialogHeader className="relative p-6 pb-0">
					<DialogTitle className="flex items-center gap-2">
						<UserIcon className="w-5 h-5 text-primary" />
						Profile
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col relative w-full h-48">
					{bannerSrc ? (
						<img
							src={bannerSrc || ""}
							alt={`${user.username}'s banner`}
							className="object-cover absolute w-full h-full"
						/>
					) : (
						<div className="absolute bottom-2 left-2 flex flex-row items-center gap-4 bg-background p-2 rounded border border-border">
							<Avatar className="size-12">
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
								<Badge variant="outline">
									{user.status.presence}
								</Badge>
							)}
						</div>
					)}
					<div className="absolute bottom-2 left-2 flex flex-row items-center gap-4 bg-background p-2 rounded border border-border">
						<Avatar className="size-12">
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
							<Badge variant="outline">
								{user.status.presence}
							</Badge>
						)}
					</div>
				</div>
				<div className="flex flex-col items-center gap-3 px-6 pb-6 pt-2">
					{userInfo?.content && (
						<div className="prose dark:prose-invert prose-p:text-xs prose-a:text-primary">
							{useNewMarkdown ? (
								<Markdown content={userInfo.content} />
							) : (
								<ReactMarkdown>{userInfo.content}</ReactMarkdown>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
