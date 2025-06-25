import React from "react";
import "katex/dist/katex.min.css";
import rehypePrism from "rehype-prism";
import rehypeReact from "rehype-react";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { Fragment, memo, useEffect, useMemo, useState } from "react";
// @ts-expect-error: the react types are missing.
import * as prod from "react/jsx-runtime";

// @ts-expect-error no typings
import rehypeKatex from "@revoltchat/rehype-katex";

import type { MarkdownProps } from "./markdown";
import { handlers } from "./hast";
import { RenderCodeblock } from "./plugins/codeblock";
import { RenderAnchor } from "./plugins/anchors";
import { remarkChannels, RenderChannel } from "./plugins/channels";
import { isOnlyEmoji, remarkEmoji, RenderEmoji } from "./plugins/emoji";
import { remarkHtmlToText } from "./plugins/htmlToText";
import { remarkMention, RenderMention } from "./plugins/mentions";
import { remarkSpoiler, RenderSpoiler } from "./plugins/spoiler";
import { remarkTimestamps } from "./plugins/timestamps";
import "./prism";

/**
 * Null element
 */
const Null: React.FC = () => null;

/**
 * Custom Markdown components
 */
const components = {
	emoji: RenderEmoji,
	mention: RenderMention,
	spoiler: RenderSpoiler,
	channel: RenderChannel,
	a: RenderAnchor,
	p: (props: any) => (
		<p
			className="m-0 [&>code]:px-1 [&>code]:py-0.5 [&>code]:shrink-0"
			{...props}
		/>
	),
	h1: (props: any) => <h1 className="my-[0.2em]" {...props} />,
	h2: (props: any) => <h2 className="my-[0.2em]" {...props} />,
	h3: (props: any) => <h3 className="my-[0.2em]" {...props} />,
	h4: (props: any) => <h4 className="my-[0.2em]" {...props} />,
	h5: (props: any) => <h5 className="my-[0.2em]" {...props} />,
	h6: (props: any) => <h6 className="my-[0.2em]" {...props} />,
	pre: RenderCodeblock,
	code: (props: any) => (
		<code
			className="text-white bg-[var(--block)] text-[90%] font-mono rounded-[3px] [box-decoration-break:clone]"
			{...props}
		/>
	),
	table: (props: any) => (
		<table
			className="border-collapse [&>tbody>tr>th]:p-1.5 [&>tbody>tr>td]:p-1.5 [&>tbody>tr>th]:border [&>tbody>tr>td]:border border-[var(--tertiary-foreground)]"
			{...props}
		/>
	),
	ul: (props: any) => (
		<ul className="list-inside pl-2.5 my-[0.2em]" {...props} />
	),
	ol: (props: any) => (
		<ol className="list-inside pl-2.5 my-[0.2em]" {...props} />
	),
	li: (props: any) => {
		// If the className includes 'task-list-item', remove list style
		const { className, ...otherProps } = props;
		const isTaskItem = className?.includes("task-list-item");
		return (
			<li
				className={`${className || ""}${isTaskItem ? " list-none" : ""}`.trim()}
				{...otherProps}
			/>
		);
	},
	blockquote: (props: any) => (
		<blockquote
			className="my-0.5 py-0.5 bg-[var(--hover)] rounded-[var(--border-radius)] border-l-4 border-[var(--tertiary-background)] [&>*]:mx-2"
			{...props}
		/>
	),
	// Block image elements
	img: Null,
	// Catch literally everything else just in case
	video: Null,
	figure: Null,
	picture: Null,
	source: Null,
	audio: Null,
	script: Null,
	style: Null,
	// Render plain text nodes
	text: (props: { children: React.ReactNode }) => <span>{props.children}</span>,
};

/**
 * Unified Markdown renderer
 */
const render = unified()
	.use(remarkParse)
	.use(remarkBreaks)
	.use(remarkGfm)
	.use(remarkMath)
	.use(remarkSpoiler)
	.use(remarkChannels)
	.use(remarkTimestamps)
	.use(remarkEmoji)
	.use(remarkMention)
	.use(remarkHtmlToText)
	.use(remarkRehype, {
		handlers,
	})
	.use(rehypeKatex, {
		maxSize: 10,
		maxExpand: 0,
		maxLength: 512,
		trust: false,
		strict: false,
		output: "html",
		throwOnError: false,
		errorColor: "var(--error)",
	})
	.use(rehypePrism)
	.use(rehypeReact, {
		Fragment,
		// @ts-expect-error: the react types are missing.
		jsx: prod.jsx,
		// @ts-expect-error: the react types are missing.
		jsxs: prod.jsxs,
		components,
	});

/**
 * Markdown parent container
 */
const Container: React.FC<{
	largeEmoji: boolean;
	children: React.ReactNode;
}> = ({ largeEmoji, children }) => (
	<div
		style={{
			// Allow scrolling block math
			// Set emoji size via CSS variable
			["--emoji-size" as any]: largeEmoji ? "3em" : "1.25em",
		}}
		className="
			[&_.math-display]:overflow-x-auto
			[&_a:hover]:underline
		"
	>
		{children}
	</div>
);

/**
 * Regex for matching execessive recursion of blockquotes and lists
 */
const RE_RECURSIVE =
	/(^(?:(?:[>*+-]|\d+\.)[^\S\r\n]*){5})(?:(?:[>*+-]|\d+\.)[^\S\r\n]*)+(.*$)/gm;

/**
 * Regex for matching multi-line blockquotes
 */
const RE_BLOCKQUOTE = /^([^\S\r\n]*>[^\n]+\n?)+/gm;

/**
 * Regex for matching HTML tags
 */
const RE_HTML_TAGS = /^(<\/?[a-zA-Z0-9]+>)(.*$)/gm;

/**
 * Regex for matching empty lines
 */
const RE_EMPTY_LINE = /^\s*?$/gm;

/**
 * Regex for matching line starting with plus
 */
const RE_PLUS = /^\s*\+(?:$|[^+])/gm;

/**
 * Sanitise Markdown input before rendering
 * @param content Input string
 * @returns Sanitised string
 */
function sanitise(content: string) {
	return (
		content
			// Strip excessive blockquote or list indentation
			.replace(RE_RECURSIVE, (_, m0, m1) => m0 + m1)

			// Append empty character if string starts with html tag
			// This is to avoid inconsistencies in rendering Markdown inside/after HTML tags
			// https://github.com/revoltchat/revite/issues/733
			.replace(RE_HTML_TAGS, (match) => `\u200E${match}`)

			// Append empty character if line starts with a plus
			// which would usually open a new list but we want
			// to avoid that behaviour in our case.
			.replace(RE_PLUS, (match) => `\u200E${match}`)

			// Replace empty lines with non-breaking space
			// because remark renderer is collapsing empty
			// or otherwise whitespace-only lines of text
			.replace(RE_EMPTY_LINE, "‎")

			// Ensure empty line after blockquotes for correct rendering
			.replace(RE_BLOCKQUOTE, (match) => `${match}\n`)
	);
}

/**
 * Remark renderer component
 */
// Error boundary component
class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <span>Error rendering content</span>;
		}
		return this.props.children;
	}
}

type RenderState =
	| { status: "pending" }
	| { status: "success"; value: React.ReactNode }
	| { status: "error"; error: Error };

export default memo(function RemarkRenderer({
	content,
	disallowBigEmoji,
}: MarkdownProps) {
	const sanitisedContent = useMemo(() => sanitise(content), [content]);
	const [renderState, setRenderState] = useState<RenderState>({
		status: "pending",
	});

	useEffect(() => {
		let cancelled = false;
		setRenderState({ status: "pending" });

		render
			.process(sanitisedContent)
			.then((result) => {
				if (!cancelled) {
					setRenderState({
						status: "success",
						value: result.result as React.ReactNode,
					});
				}
			})
			.catch((err) => {
				if (!cancelled) {
					console.error("Error rendering markdown:", err);
					const error =
						err instanceof Error ? err : new Error("Failed to render content");
					setRenderState({ status: "error", error });
				}
			});

		return () => {
			cancelled = true;
		};
	}, [sanitisedContent]);

	const largeEmoji = useMemo(
		() => !disallowBigEmoji && isOnlyEmoji(content ?? ""),
		[content, disallowBigEmoji],
	);

	return (
		<ErrorBoundary>
			<Container largeEmoji={largeEmoji}>
				{renderState.status === "pending" && (
					<span className="opacity-50">Loading content...</span>
				)}
				{renderState.status === "error" && (
					<div className="text-red-500">Error: {renderState.error.message}</div>
				)}
				{renderState.status === "success" && renderState.value}
			</Container>
		</ErrorBoundary>
	);
});
