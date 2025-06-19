import { memo } from "react";

export const MemoizedDiv = memo(
	(props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
);

MemoizedDiv.displayName = "MemoizedMotionDiv";
