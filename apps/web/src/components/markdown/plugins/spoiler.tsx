import { useState } from "react";

import { createComponent, type CustomComponentProps } from "./remarkRegexComponent";

function Spoiler({ shown, children }: { shown: boolean; children: React.ReactNode }) {
    return (
        <div
            className={[
                'px-0.5 rounded-[var(--border-radius)]',
                shown
                    ? 'cursor-auto select-all text-[var(--foreground)] bg-[var(--secondary-background)] [&>*]:opacity-100 [&>*]:pointer-events-auto'
                    : 'cursor-pointer select-none text-transparent bg-[#151515] [&>*]:opacity-0 [&>*]:pointer-events-none',
            ].join(' ')}
        >
            {children}
        </div>
    );
}

function SpoilerContent({ children, shown }: { shown: boolean, children: React.ReactNode }) {
    return <div>{children}</div>;
}

export function RenderSpoiler({ match }: CustomComponentProps) {
    const [shown, setShown] = useState(false);

    return (
        <div
            onClick={() => setShown(true)}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setShown(true);
            }}
        >
            <Spoiler shown={shown}>{match}</Spoiler>
        </div>
    );
}

export const remarkSpoiler = createComponent("spoiler", /(?:!!([^!]+)!!|\$\$([^\$]+)\$\$)/g);