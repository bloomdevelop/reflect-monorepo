"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Paperclip, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { Channel, Message } from "revolt.js";
import { toast } from "sonner";
import { z } from "zod";
import { client as appClient } from "@/lib/revolt";
import { CdnClass } from "@/lib/utils";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";

const composeSchema = z.object({
	content: z.string().optional(),
});

type FileWithPreview = {
	file: File;
	preview: string;
};

type AttachmentsPreviewProps = {
	files: FileWithPreview[];
	onRemove: (index: number) => void;
	onAdd: (files: FileList) => void;
};

const AttachmentsPreview = React.memo(function AttachmentsPreview({
	files,
	onRemove,
	onAdd,
}: AttachmentsPreviewProps) {
	const [isDragging, setIsDragging] = useState(false);
	const inputId = React.useId();

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const droppedFiles = e.dataTransfer.files;
		if (droppedFiles.length > 0) {
			onAdd(droppedFiles);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onAdd(e.target.files);
		}
	};

	return (
		<div>
			<section
				aria-label="Attachments dropzone"
				className={`w-full p-4 transition-colors max-h-56 overflow-auto ${
					isDragging ? "bg-blue-500/10" : ""
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className="flex flex-row flex-wrap items-start gap-4">
					{files.map((file, index) => (
						<AnimatePresence key={file.file.name}>
							<motion.div
								className="relative flex flex-col gap-2 group/item"
								initial={{ opacity: 0, scale: 2, rotateZ: 10 }}
								animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
								exit={{ opacity: 0, scale: 0 }}
								transition={{
									type: "spring",
									stiffness: 120,
									damping: 14,
									mass: 1,
								}}
							>
								<div className="relative">
									<div className="relative w-24 h-24 overflow-hidden rounded-lg bg-transparent">
										<Image
											src={file.preview}
											alt="Preview"
											fill
											className="object-contain"
										/>
									</div>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute -top-2 -right-2 opacity-100 transition-opacity duration-200 ease-in-out group-hover/item:opacity-100 backdrop-blur-md h-5 w-5 rounded-full shadow-md"
										onClick={() => {
											onRemove(index);
										}}
									>
										<X className="h-3 w-3" />
									</Button>
								</div>
							</motion.div>
						</AnimatePresence>
					))}

					<div className="relative">
						<motion.label
							htmlFor={inputId}
							className={`flex flex-col items-center justify-center w-24 h-24 border-2 rounded-lg cursor-pointer transition-colors ${
								isDragging
									? "border-primary bg-primary/10 scale-105"
									: "border-border hover:border-primary/50 hover:bg-accent/20"
							}`}
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							transition={{
								type: "spring",
								stiffness: 200,
								damping: 20,
							}}
						>
							<Plus
								className={`h-6 w-6 mb-1.5 transition-colors ${
									isDragging ? "text-primary" : "text-muted-foreground"
								}`}
							/>
							<span
								className={`text-xs text-center px-1.5 transition-colors ${
									isDragging
										? "text-primary font-medium"
										: "text-muted-foreground"
								}`}
							>
								Add Image/Video
							</span>
							<input
								id={inputId}
								name="file-upload"
								type="file"
								className="sr-only"
								accept="image/*,video/*"
								multiple
								onChange={handleFileChange}
							/>
						</motion.label>
					</div>
				</div>
				<div className="mt-3 text-center">
					<p className="text-xs text-muted-foreground">
						Tip: You can drag and drop files here
					</p>
				</div>
			</section>
		</div>
	);
});

export default function ComposeComponent({
	channel: channelProp,
	channelId,
	onMessageSent,
}: {
	channel?: Channel;
	channelId?: string;
	onMessageSent?: (message: Message) => void;
}) {
	const cdn = new CdnClass();
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [showAttachments, setShowAttachments] = useState<boolean>(false);
	const [channel, setChannel] = useState<Channel | null>(channelProp ?? null);

	const form = useForm<z.infer<typeof composeSchema>>({
		resolver: zodResolver(composeSchema),
		defaultValues: {
			content: "",
		},
	});

	React.useEffect(() => {
		let mounted = true;

		// If a channel prop was provided, prefer it immediately.
		if (channelProp) {
			if (mounted) setChannel(channelProp);
			return () => {
				mounted = false;
			};
		}

		// Use the application's shared revolt client instance first, then fall back to globals.
		try {
			let ch: Channel | null = null;

			if (typeof channelId === "string" && channelId.length > 0) {
				ch =
					appClient?.channels?.get?.(channelId) ??
					(globalThis as any).revolt?.channels?.get?.(channelId) ??
					(globalThis as any).client?.channels?.get?.(channelId) ??
					(globalThis as any).revoltClient?.channels?.get?.(channelId) ??
					null;
			} else {
				ch = null;
			}

			if (mounted) {
				setChannel(ch ?? null);
			}
		} catch (_e) {
			if (mounted) setChannel(null);
		}

		return () => {
			mounted = false;
		};
	}, [channelId, channelProp]);

	const handleAddFiles = useCallback((fileList: FileList) => {
		const newFiles = Array.from(fileList).map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));
		setFiles((prev) => [...prev, ...newFiles]);
	}, []);

	const removeFile = useCallback((index: number) => {
		setFiles((prev) => {
			const newFiles = [...prev];
			if (index >= 0 && index < newFiles.length) {
				URL.revokeObjectURL(newFiles[index].preview);
				newFiles.splice(index, 1);
			}
			return newFiles;
		});
	}, []);

	// Cleanup previews on unmount
	React.useEffect(() => {
		return () => {
			for (const f of files) {
				try {
					URL.revokeObjectURL(f.preview);
				} catch {
					// ignore
				}
			}
		};
		// We intentionally do not include files in deps to only run on unmount.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);

	const onSubmit = async (values: z.infer<typeof composeSchema>) => {
		if (!values.content?.trim() && files.length === 0) return;

		if (!channel) {
			toast.error("Channel is not available");
			return;
		}

		try {
			const attachments: string[] = [];

			// Upload files if any
			if (files.length > 0) {
				// Use Promise.all to wait for all uploads to complete
				const uploadPromises = files.map(async (fileWithPreview) => {
					try {
						const imageId = await cdn.uploadFile(
							"attachments",
							fileWithPreview.file,
						);
						toast.info("File uploaded successfully", { description: imageId });
						return imageId;
					} catch (error) {
						if (error instanceof Error) {
							toast.error("Failed to upload file", {
								description: error.message,
							});
						} else {
							toast.error("Failed to upload file", {
								description: "Please try again",
							});
						}
						console.error("Upload error:", error);
						return null;
					}
				});

				// Wait for all uploads to complete and filter out any failed uploads
				const uploadedIds = (await Promise.all(uploadPromises)).filter(
					Boolean,
				) as string[];
				attachments.push(...uploadedIds);
			}

			// Send message with content and/or attachments
			const sentMessage = await channel.sendMessage({
				content: values.content || undefined,
				attachments: attachments,
			});

			// Notify parent component about the new message
			onMessageSent?.(sentMessage);

			// Reset form
			form.reset({ content: "" });
			setFiles([]);
			setShowAttachments(false);
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message");
		}
	};

	return (
		<div className="sticky bottom-0 flex flex-col">
			<Form {...form}>
				<motion.form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full !bg-transparent flex flex-col gap-2 p-3 shadow-md"
				>
					<div className="w-full flex flex-col gap-2 bg-muted/50 border backdrop-blur-md rounded-2xl p-3">
						{showAttachments && (
							<AttachmentsPreview
								files={files}
								onRemove={removeFile}
								onAdd={handleAddFiles}
							/>
						)}
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<textarea
											className="resize-none min-w-full h-min outline-none"
											disabled={!channel?.havePermission?.("SendMessage")}
											placeholder={
												files.length > 0
													? "Add a caption..."
													: "Send a message..."
											}
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="flex flex-row">
							<Button
								type="button"
								variant="outline"
								size="default"
								disabled={!channel?.havePermission?.("UploadFiles")}
								onClick={() => setShowAttachments(!showAttachments)}
							>
								<Paperclip className="size-5" />
								Attach
							</Button>
							<div className="flex-1" />
							<Button
								type="submit"
								size="icon"
								disabled={
									!channel?.havePermission?.("SendMessage") ||
									(!form.watch("content")?.trim() && files.length === 0)
								}
							>
								<ArrowUp className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</motion.form>
			</Form>
		</div>
	);
}
