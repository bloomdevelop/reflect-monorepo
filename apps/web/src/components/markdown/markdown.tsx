import { Suspense, lazy } from "react";

const Renderer = lazy(() => import("./remark-renderer"));

export interface MarkdownProps {
    content: string;
    disallowBigEmoji?: boolean;
}

export default function Markdown(props: MarkdownProps) {
    if (!props.content) return null;

    return (
        <Suspense fallback={props.content}>
            <Renderer {...props} />
        </Suspense>
    );
}