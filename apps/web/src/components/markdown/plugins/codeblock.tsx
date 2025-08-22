import { useCallback, useRef } from "react";

import { Button } from "../../ui/button";
import { Tooltip, TooltipTrigger } from "../../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
/**
 * Render a codeblock with copy text button
 */
export const RenderCodeblock: React.FC<{
	class: string;
	children: React.ReactNode;
}> = ({ children, ...props }) => {
	const ref = useRef<HTMLPreElement>(null);

	let text = "text";
	if (props.class) {
		text = props.class.split("-")[1];
	}

	const onCopy = useCallback(() => {
		const text = ref.current?.querySelector("code")?.innerText;
		text && window.navigator.clipboard.writeText(text);
	}, []);

	return (
		<pre className="p-4 overflow-x-scroll bg-muted rounded-md" ref={ref}>
			<Tooltip>
				<TooltipTrigger>
					<Button onClick={onCopy}>{text}</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Copy code</p>
				</TooltipContent>
			</Tooltip>
			{children}
		</pre>
	);
};
