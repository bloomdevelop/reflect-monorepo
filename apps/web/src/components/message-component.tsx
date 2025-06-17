"use client";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Message } from "revolt.js";

export default function MessageComponent({
  message,
  delay,
}: {
  message?: Message;
  delay?: number;
}) {
  if (!message) return null;

  return (
    <AnimatePresence>
			<motion.div
				className="mx-2 my-3 border border-border p-4 rounded-md flex flex-col gap-2"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ type: "spring", stiffness: 120, damping: 8, delay }}
			>
				<div className="flex flex-row items-center gap-3">
					<Avatar>
						<AvatarImage src={message.author?.avatarURL || message.author?.defaultAvatarURL || ""} />
						<AvatarFallback>{message.author?.username.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>
					<p>{message.author?.username || message.author?.username}</p>
				</div>
				{/* TODO)) Port Markdown */}
				<p>{message.content}</p>
			</motion.div>
		</AnimatePresence>
	);
}
