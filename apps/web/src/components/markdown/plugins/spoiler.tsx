import { useState } from "react";
import {
	type CustomComponentProps,
	createComponent,
} from "./remarkRegexComponent";

function Spoiler({
	shown,
	children,
}: {
	shown: boolean;
	children: React.ReactNode;
}) {
	return (
		<div
			className={[
				"px-0.5 rounded-[var(--border-radius)]",
				shown
					? "cursor-auto select-all text-[var(--foreground)] bg-[var(--secondary-background)] [&>*]:opacity-100 [&>*]:pointer-events-auto"
					: "cursor-pointer select-none text-transparent bg-[#151515] [&>*]:opacity-0 [&>*]:pointer-events-none",
			].join(" ")}
		>
			{children}
		</div>
	);
}

export function RenderSpoiler({ match }: CustomComponentProps) {
	const [shown, setShown] = useState(false);

	return (
		<button
			type="button"
			onClick={() => setShown(true)}
			aria-expanded={shown}
			className="p-0 m-0 border-0 bg-transparent"
		>
			<Spoiler shown={shown}>{match}</Spoiler>
		</button>
	);
}

export const remarkSpoiler = createComponent(
	"spoiler",
	/(?:!!([^!]+)!!|\$\$([^$]+)\$\$)/g,
);
