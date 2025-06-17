"use client";
import { motion, type Variants } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Message } from "revolt.js";

export default function MessageComponent({
	message,
	delay,
}: {
	message?: Message;
	delay?: number;
}) {
	const variants: Variants = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
	}

	if (!message) return null;

	return (
		<motion.div
			className="z-1 mx-2 my-3 border border-border p-4 rounded-md flex flex-col gap-2"
			variants={variants}
			initial="initial"
			animate="animate"
			transition={{
				type: "spring",
				stiffness: 150,
				damping: 8,
				delay,
				staggerDirection: -1,
			}}
		>
			<div className="flex flex-row items-center gap-3">
				<Avatar>
					<AvatarImage
						src={
							message.author?.avatarURL ||
							message.author?.defaultAvatarURL ||
							""
						}
					/>
					<AvatarFallback>
						{message.author?.username.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<p>{message.author?.username || message.author?.username}</p>
			</div>
			{/* TODO)) Port Markdown */}
			<p>{message.content}</p>
		</motion.div>
	);
}
