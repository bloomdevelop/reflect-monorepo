import { memo } from "react";

export const MemoizedMotionDiv = memo(
    (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
);

MemoizedMotionDiv.displayName = "MemoizedMotionDiv";
