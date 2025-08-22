import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { client } from "./revolt";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("");
}

export class CdnClass {
	private readonly BASE_URL = "https://cdn.revoltusercontent.com";

	/**
	 * Uploads a file to the CDN.
	 *
	 * @param tag The tag to associate with the file.
	 * @param file The file to upload.
	 * @param filename The filename to associate with the file.
	 * @returns The ID of the uploaded file.
	 */
	async uploadFile(
		tag: string,
		file: Blob,
		filename = "file",
	): Promise<string> {
		try {
			const formData = new FormData();
			const blob = new Blob([new Uint8Array(await file.arrayBuffer())]);

			formData.append("file", blob, filename);

			if (!client.sessionToken) {
				throw new Error("No session token");
			}

			const res = await fetch(`${this.BASE_URL}/${tag}`, {
				method: "POST",
				headers: {
					"X-Session-Token": client.sessionToken,
				},
				body: formData,
			});

			if (!res.ok) {
				throw new Error("Failed to upload file");
			}

			const data = (await res.json()) as {
				id: string;
			};

			return data.id;
		} catch (error) {
			console.error("Failed to upload file:", error);
			throw error;
		}
	}
}
