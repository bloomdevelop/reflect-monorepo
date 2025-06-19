"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function DebugPage() {
	return (
		<div className="p-4">
			<h1 className="text-4xl font-bold">Debug</h1>
			<Separator />
			<Link href="/login">
				<Button>Login</Button>
			</Link>
			<Button>Open Settings</Button>
		</div>
	);
}
