import Image from "next/image";
import { memo, useState } from "react";
import type { File } from "revolt.js";
import { ImageViewer } from "../image-viewer";

export const MessageAttachments = memo(
	({ attachments }: { attachments?: File[] }) => {
		const [viewerOpen, setViewerOpen] = useState(false);
		const [selectedImageIndex, setSelectedImageIndex] = useState(0);

		if (!attachments?.length) return null;

		// Filter only image attachments
		const imageAttachments = attachments.filter((attachment) => {
			const isImage =
				attachment.metadata?.type === "Image" ||
				(attachment.contentType?.startsWith("image/") ?? false);
			return isImage && attachment.url;
		});

		// Non-image attachments
		const nonImageAttachments = attachments.filter((attachment) => {
			const isImage =
				attachment.metadata?.type === "Image" ||
				(attachment.contentType?.startsWith("image/") ?? false);
			return !isImage;
		});

		const handleImageClick = (index: number) => {
			setSelectedImageIndex(index);
			setViewerOpen(true);
		};

		return (
			<>
				{imageAttachments.length > 0 && (
					<ImageViewer
						images={imageAttachments.map((img) => ({
							url: img.url,
							filename: img.filename || "image",
						}))}
						initialIndex={selectedImageIndex}
						isOpen={viewerOpen}
						onOpenChange={setViewerOpen}
					/>
				)}
				{imageAttachments.length > 0 && (
					<div
						className={`mt-2 grid gap-2 ${imageAttachments.length > 1 ? "grid-cols-2 sm:grid-cols-3" : ""}`}
					>
						{imageAttachments.map((attachment, index) => (
							<div
								key={attachment.id || index}
								className="relative w-fit h-auto aspect-video max-w-full max-h-[400px] rounded-md overflow-hidden border border-border bg-muted/20 flex justify-center"
							>
								<Image
									src={attachment.url}
									alt={`Attachment ${index + 1}`}
									width={300}
									height={200}
									style={{
										objectFit: "contain",
										width: "100%",
										height: "100%",
										maxHeight: "400px",
									}}
									className="rounded-md cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										handleImageClick(index);
									}}
								/>
							</div>
						))}
					</div>
				)}
				{nonImageAttachments.length > 0 && (
					<div className="mt-2 space-y-2">
						{nonImageAttachments.map((attachment, index) => {
							const fileSize = attachment.size
								? `${(attachment.size / 1024).toFixed(1)} KB`
								: "Unknown size";
							const fileName = attachment.filename || "Download File";
							return (
								<div
									key={attachment.id || index}
									className="relative w-fit max-w-full rounded-md overflow-hidden border border-border bg-muted/20 flex justify-center"
								>
									<a
										href={attachment.url}
										target="_blank"
										rel="noopener noreferrer"
										className="block p-3 bg-muted hover:bg-muted/80 transition-colors"
									>
										<div className="w-fit p-3">
											<div className="font-medium">{fileName}</div>
											<div className="text-xs text-muted-foreground">
												{fileSize}
											</div>
										</div>
									</a>
								</div>
							);
						})}
					</div>
				)}
			</>
		);
	},
);
MessageAttachments.displayName = "MessageAttachments";
