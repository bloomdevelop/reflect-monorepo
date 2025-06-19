"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/revolt";
import { Mail, MessageCircle, Settings, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Channel, User } from "revolt.js";

// Loading skeleton component for DM/Friend items
const SkeletonItem = () => (
	<div className="flex items-center gap-3">
		<Skeleton className="h-10 w-10 rounded-full" />
		<div className="flex-1 space-y-2">
			<Skeleton className="h-4 w-32" />
			<Skeleton className="h-3 w-48" />
		</div>
	</div>
);

export default function HomePage() {
	const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
	const [friends, setFriends] = useState<User[]>([]);
	const [dms, setDms] = useState<Channel[]>([]);
	const [loading, setLoading] = useState(true);
	const [clientReady, setClientReady] = useState(false);

	useEffect(() => {
		// Check if client is ready and authenticated
		if (!client.sessions) {
			window.location.href = "/login";
			return;
		}

		const checkClient = () => {
			if (client.ready()) {
				setClientReady(true);
			} else {
				setTimeout(checkClient, 100);
			}
		};
		checkClient();
	}, []);

	useEffect(() => {
		if (!clientReady) return;

		async function fetchData() {
			try {
				// Get current user
				const user = client.user;
				if (user) setCurrentUser(user);

				// Get DMs
				const channels = Array.from(client.channels.values());
				const directMessages = channels.filter(
					(channel) => channel.type === "DirectMessage" && channel.active,
				);
				setDms(directMessages);

				// Get friends
				const friendsList = Array.from(client.users.values()).filter(
					(user) => user.relationship === "Friend",
				);
				setFriends(friendsList);
			} catch (err) {
				console.error("Failed to fetch dashboard data:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [clientReady]);

	// Show loading state if client isn't ready or we're loading data
	if (!clientReady || loading) {
		return (
			<div className="p-6 space-y-6 max-w-6xl mx-auto">
				{/* Profile Card Skeleton */}
				<div className="bg-muted/40 rounded-lg p-6">
					<div className="flex items-start gap-4">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="flex-1 space-y-4">
							<div className="flex justify-between">
								<div className="space-y-2">
									<Skeleton className="h-8 w-48" />
									<Skeleton className="h-4 w-32" />
								</div>
								<Skeleton className="h-9 w-32" />
							</div>
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* DMs Skeleton */}
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-9 w-32" />
						</div>
						<div className="bg-muted/40 rounded-lg p-4 space-y-4">
							<SkeletonItem />
							<SkeletonItem />
							<SkeletonItem />
						</div>
					</div>

					{/* Friends Skeleton */}
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-9 w-32" />
						</div>
						<div className="bg-muted/40 rounded-lg p-4 space-y-4">
							<SkeletonItem />
							<SkeletonItem />
							<SkeletonItem />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// If client is ready but we have no user, show error or redirect
	if (!currentUser) {
		return (
			<div className="p-6 flex items-center justify-center h-[calc(100vh-4rem)]">
				<div className="text-center space-y-4">
					<h2 className="text-xl font-semibold">Not Logged In</h2>
					<p className="text-muted-foreground">
						Please log in to view your dashboard
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6 max-w-6xl mx-auto">
			{/* User Profile Card */}
			<div className="bg-muted/40 rounded-lg p-6">
				<div className="flex items-start gap-4">
					<Avatar className="h-20 w-20">
						<AvatarImage
							src={currentUser?.avatarURL || currentUser?.defaultAvatarURL}
							alt={currentUser?.username}
						/>
						<AvatarFallback>
							{currentUser?.username?.[0]?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-2xl font-bold">
									{currentUser?.displayName}
								</h1>
								<p className="text-sm text-muted-foreground">
									@{currentUser?.username}
								</p>
							</div>
							<Button variant="outline" size="sm">
								<Settings className="h-4 w-4 mr-2" />
								Edit Profile
							</Button>
						</div>
						{currentUser?.status && (
							<p className="mt-4 text-sm">{currentUser.status.presence}</p>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Direct Messages */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold flex items-center">
							<MessageCircle className="h-5 w-5 mr-2" />
							Direct Messages
						</h2>
						<Button variant="ghost" size="sm">
							<Mail className="h-4 w-4 mr-2" />
							New Message
						</Button>
					</div>
					<div className="bg-muted/40 rounded-lg divide-y divide-muted">
						{dms.length === 0 ? (
							<p className="p-4 text-sm text-muted-foreground text-center">
								No direct messages yet
							</p>
						) : (
							dms.map((dm) => {
								const recipient = Array.from(dm.recipients || []).find(
									(user) => user.id !== currentUser?.id,
								);
								return (
									<Link
										href={`/app/dm/${dm.id}`}
										key={dm.id}
										className="flex items-center gap-3 p-3 hover:bg-muted/60 transition-colors"
									>
										<Avatar>
											<AvatarImage src={recipient?.avatarURL} />
											<AvatarFallback>
												{recipient?.username?.[0]?.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium">{recipient?.username}</div>
											<p className="text-sm text-muted-foreground">
												{dm.lastMessage
													? `Last message: ${new Date(dm.lastMessage.createdAt).toLocaleDateString()}`
													: "No messages yet"}
											</p>
										</div>
									</Link>
								);
							})
						)}
					</div>
				</div>

				{/* Friends List */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold flex items-center">
							<UserCircle2 className="h-5 w-5 mr-2" />
							Friends
						</h2>
						<Button variant="ghost" size="sm">
							Add Friend
						</Button>
					</div>
					<div className="bg-muted/40 rounded-lg divide-y divide-muted">
						{friends.length === 0 ? (
							<p className="p-4 text-sm text-muted-foreground text-center">
								No friends added yet
							</p>
						) : (
							friends.map((friend) => (
								<div
									key={friend.id}
									className="flex items-center justify-between p-3"
								>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage
												src={friend.avatarURL || friend.defaultAvatarURL}
											/>
											<AvatarFallback>
												{friend.username[0].toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium">{friend.username}</div>
											<p className="text-sm text-muted-foreground">
												{friend.status?.presence || "No status"}
											</p>
										</div>
									</div>
									<Button variant="ghost" size="sm">
										<MessageCircle className="h-4 w-4" />
									</Button>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
