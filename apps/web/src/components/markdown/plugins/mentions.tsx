import { RE_MENTIONS } from "revolt.js";

// import UserShort from "../../common/user/UserShort";
import {
	createComponent,
	type CustomComponentProps,
} from "./remarkRegexComponent";
import { client } from "@/lib/revolt";

// const Mention = styled.a`
//     gap: 4px;
//     flex-shrink: 0;
//     padding-left: 2px;
//     padding-right: 6px;
//     align-items: center;
//     display: inline-flex;
//     vertical-align: middle;

//     cursor: pointer;

//     font-weight: 600;
//     text-decoration: none !important;
//     background: var(--secondary-background);
//     border-radius: calc(var(--border-radius) * 2);

//     transition: 0.1s ease filter;

//     &:hover {
//         filter: brightness(0.75);
//     }

//     &:active {
//         filter: brightness(0.65);
//     }

//     svg {
//         width: 1em;
//         height: 1em;
//     }
// `;

export function RenderMention({ match }: CustomComponentProps) {
	const user = client.users.get(match);
	if (!user) {
		return <span>@{match}</span>;
	}
	return (
		<div className="inline-flex items-center">
			{/* <UserShort
                showServerIdentity
                user={client.users.get(match)}
            /> */}
			<span className="text-primary font-semibold">@{user.username}</span>
		</div>
	);
}

export const remarkMention = createComponent("mention", RE_MENTIONS, (match) =>
	client.users.has(match),
);
