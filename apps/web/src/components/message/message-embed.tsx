import { Globe } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";
import type {
	ImageEmbed,
	MessageEmbed as RevoltMessageEmbed,
	TextEmbed,
	VideoEmbed,
	WebsiteEmbed,
} from "revolt.js";

interface EmbedMediaProps {
	url: string;
	width?: number;
	height?: number;
	size?: "Large" | "Preview" | undefined;
	previewUrl?: string;
}

const EmbedMedia = memo(
	({ url, width, height, size, previewUrl }: EmbedMediaProps) => {
		// Use preview URL if available, otherwise use the original URL
		const displayUrl = previewUrl || url;

		return (
			<div
				className="relative overflow-hidden rounded-md"
				style={{ display: "inline-block" }}
			>
				<Image
					src={displayUrl}
					alt="Embed media"
					width={width || 400}
					height={height || 300}
					style={{
						width: "auto",
						height: "auto",
						maxWidth: "100%",
						maxHeight: size === "Large" ? 400 : size === "Preview" ? 200 : 300,
						objectFit: "contain",
					}}
				/>
			</div>
		);
	},
);
EmbedMedia.displayName = "EmbedMedia";

interface EmbedIconProps {
	url?: string;
	name: string;
}

const EmbedIcon = memo(({ url, name }: EmbedIconProps) => {
	const [imgError, setImgError] = useState(false);

	if (!url || imgError) {
		return (
			<div className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-muted rounded-sm">
				<Globe size={18} />
			</div>
		);
	}

	return (
		<div className="flex-shrink-0">
			<Image
				src={url}
				alt={`${name} icon`}
				width={24}
				height={24}
				className="rounded-sm"
				onError={() => setImgError(true)}
			/>
		</div>
	);
});
EmbedIcon.displayName = "EmbedIcon";

interface MessageEmbedProps {
	embed: RevoltMessageEmbed;
}

export const MessageEmbedComponent = memo(({ embed }: MessageEmbedProps) => {
	// Cast embed to specific type based on its type property
	const getEmbedContent = () => {
		switch (embed.type) {
			case "Website": {
				const websiteEmbed = embed as WebsiteEmbed;
				return {
					title: websiteEmbed.title,
					description: websiteEmbed.description,
					url: websiteEmbed.url,
					colour: websiteEmbed.colour,
					iconUrl: websiteEmbed.proxiedIconURL,
					media: websiteEmbed.image,
					video: websiteEmbed.video,
					site: websiteEmbed.siteName,
					embedUrl: websiteEmbed.embedURL,
				};
			}
			case "Text": {
				const textEmbed = embed as TextEmbed;
				return {
					title: textEmbed.title,
					description: textEmbed.description,
					url: textEmbed.url,
					colour: textEmbed.colour,
					iconUrl: textEmbed.proxiedIconURL,
					media: textEmbed.media,
				};
			}
			case "Image": {
				const imageEmbed = embed as ImageEmbed;
				return {
					media: imageEmbed,
					url: imageEmbed.proxiedURL,
				};
			}
			case "Video": {
				const videoEmbed = embed as VideoEmbed;
				return {
					video: videoEmbed,
					url: videoEmbed.proxiedURL,
				};
			}
			default:
				return {};
		}
	};

	const content = getEmbedContent();

	// Helper to determine if we should show media
	const hasMedia = Boolean(content.media || content.video || content.embedUrl);

	// Convert hex color to RGB for opacity support
	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: Number.parseInt(result[1], 16),
					g: Number.parseInt(result[2], 16),
					b: Number.parseInt(result[3], 16),
				}
			: null;
	};

	// Get color styles
	const getColorStyle = () => {
		if (!content.colour) return {};
		const rgb = hexToRgb(content.colour);
		if (!rgb) return {};
		return {
			borderLeftColor: content.colour,
			backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
		};
	};

	return (
		<div
			className="my-2 rounded-md border-l-4 border-border p-3 overflow-hidden break-words"
			style={getColorStyle()}
		>
			<div className="flex flex-col gap-2">
				<div className="flex items-start gap-2">
					{(content.iconUrl || content.site) && (
						content.iconUrl ? (
								<EmbedIcon url={content.iconUrl} name={content.title || content.site || ""} />
							) : (
								<div className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-muted rounded-sm">
									<Globe size={16} />
								</div>
							)
					)}

					<div className="flex-1 min-w-0">
						{content.title && (
							<h3 className="text-base font-medium break-words">
								{content.url ? (
									<a
										href={content.url}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:underline break-words"
									>
										{content.title}
									</a>
								) : (
									content.title
								)}
							</h3>
						)}

						{content.site && !content.iconUrl && (
							<div className="text-xs text-muted-foreground mt-0.5">
								{content.site}
							</div>
						)}
					</div>
				</div>

				{content.description && (
					<div className="mt-1 text-sm text-muted-foreground break-words whitespace-pre-wrap">
						{content.description}
					</div>
				)}

				{hasMedia && (
					<div className="mt-2 w-full overflow-hidden rounded-md">
						{content.embedUrl ? (
							<iframe
								src={content.embedUrl}
								allowFullScreen
								className="w-full aspect-video rounded-md"
								style={{ border: 0 }}
								title={`${content.site || "Embedded"} content`}
							/>
						) : (
							<EmbedMedia
								url={
									content.media?.url ||
									content.video?.proxiedURL ||
									content.url ||
									""
								}
								width={
									"width" in (content.media ?? {})
										? (content.media as ImageEmbed).width
										: content.video?.width
								}
								height={
									"height" in (content.media ?? {})
										? (content.media as ImageEmbed).height
										: content.video?.height
								}
								size={(content.media as ImageEmbed)?.size}
								previewUrl={content.video?.proxiedURL}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

MessageEmbedComponent.displayName = "MessageEmbedComponent";

export default MessageEmbedComponent;
