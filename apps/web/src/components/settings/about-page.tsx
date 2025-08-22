"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code, Zap, Shield } from "lucide-react";

export function AboutPage() {
	const appInfo = {
		name: "Reflect",
		version: "1.0.0",
		buildDate: new Date().toLocaleDateString(),
		description:
			"A third-party Revolt.chat client built with Next.js and Shadcn/ui",
		features: ["Not yet"],
		technologies: [
			{ name: "React", version: "19.x" },
			{ name: "Next.js", version: "15.x" },
			{ name: "TypeScript", version: "5.x" },
			{ name: "Tailwind CSS", version: "4.x" },
			{ name: "shadcn/ui", version: "Latest" },
			{ name: "Lucide Icons", version: "Latest" },
		],
	};

	return (
		<div className="space-y-6">
			{/* App Overview */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<Code className="h-6 w-6 text-primary" />
						</div>
						<div>
							<CardTitle className="text-2xl">{appInfo.name}</CardTitle>
							<CardDescription>Version {appInfo.version}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground leading-relaxed">
						{appInfo.description}
					</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span>Built on {appInfo.buildDate}</span>
						<Separator orientation="vertical" className="h-4" />
						<span>Created with love from Dominican Republic</span>
					</div>
				</CardContent>
			</Card>

			{/* Features */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-primary" />
						<CardTitle>Key Features</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{appInfo.features.map((feature) => (
							<div
								key={feature}
								className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
							>
								<div className="h-2 w-2 bg-primary rounded-full" />
								<span className="text-sm">{feature}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Technology Stack */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-primary" />
						<CardTitle>Technology Stack</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						{appInfo.technologies.map((tech) => (
							<div
								key={tech.name}
								className="flex flex-col gap-1 p-3 rounded-lg border bg-card"
							>
								<span className="font-medium text-sm">{tech.name}</span>
								<Badge variant="secondary" className="text-xs w-fit">
									{tech.version}
								</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Links & Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Resources</CardTitle>
					<CardDescription>
						These are the resources used to build this application, some
						components are build with v0 and some AI editors like Windsurf.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex flex-col sm:flex-row gap-2">
						<Button variant="outline" className="flex-1 bg-transparent" asChild>
							<a
								href="https://v0.dev"
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="h-4 w-4 mr-2" />
								Visit v0.dev
							</a>
						</Button>
						<Button variant="outline" className="flex-1 bg-transparent" asChild>
							<a
								href="https://ui.shadcn.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="h-4 w-4 mr-2" />
								shadcn/ui Docs
							</a>
						</Button>
						<Button variant="outline" className="flex-1 bg-transparent" asChild>
							<a
								href="https://github.com/bloomdevelop/reflect-monorepo"
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="h-4 w-4 mr-2" />
								Source Code
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
