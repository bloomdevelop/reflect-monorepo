import type { Handler } from "mdast-util-to-hast";

import dayJS from "dayjs";
import calendar from "dayjs/plugin/calendar";
import format from "dayjs/plugin/localizedFormat";
import update from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";

import { createComponent } from "./remarkRegexComponent";

export const dayjs = dayJS;
dayjs.extend(calendar);
dayjs.extend(format);
dayjs.extend(update);
dayjs.extend(relativeTime);
dayjs.extend(update);

export const timestampHandler: Handler = (_state, node) => {
	const { match, arg1 } = node as any;
	if (Number.isNaN(match)) return { type: "text", value: match };
	const date = dayjs.unix(match);

	let value = "";
	switch (arg1) {
		case "t":
			value = date.format("hh:mm");
			break;
		case "T":
			value = date.format("hh:mm:ss");
			break;
		case "R":
			value = date.fromNow();
			break;
		case "D":
			value = date.format("DD MMMM YYYY");
			break;
		case "F":
			value = date.format("dddd, DD MMMM YYYY hh:mm");
			break;
		default:
			value = date.format("DD MMMM YYYY hh:mm");
			break;
	}

	return {
		type: "element",
		tagName: "code",
		properties: {},
		children: [{ type: "text", value }],
	};
};

export const remarkTimestamps = createComponent(
	"timestamp",
	/<t:([0-9]+)(?::(\w))?>/g,
);
