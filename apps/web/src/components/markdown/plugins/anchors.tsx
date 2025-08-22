import Link from "next/link";
import type { HTMLAttributes } from "react";
import { determineLink } from "@/lib/links";

interface RenderAnchorProps extends HTMLAttributes<HTMLAnchorElement> {
	href?: string;
}

export function RenderAnchor({ href, ...props }: RenderAnchorProps) {
	// Pass-through no href or if anchor
	if (!href || href.startsWith("#")) return <a href={href} {...props} />;

	// Determine type of link
	const link = determineLink(href);
	if (link.type === "none") return <a {...props} />;

	// Render direct link if internal
	if (link.type === "navigate") {
		// Next.js Link requires a single child that is an <a> element for proper behavior
		return (
			<Link href={link.path} legacyBehavior>
				<a {...props}>{props.children}</a>
			</Link>
		);
	}

	return (
		<a
			{...props}
			href={href}
			target="_blank"
			rel="noreferrer"
			onClick={(_ev) => window.open(href, "_blank", "noopener noreferrer")}
		/>
	);
}
