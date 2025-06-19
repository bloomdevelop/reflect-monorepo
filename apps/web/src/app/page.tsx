"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { client } from "@/lib/revolt";
import { ShieldIcon, UsersIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { useLog } from "@/app/hooks/useLogContext";

type FeatureCardProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
};

const features: FeatureCardProps[] = [
	{
		icon: <ZapIcon />,
		title: "Lightning Fast",
		description:
			"Experience blazing fast performance with our optimized platform.",
	},
	{
		icon: <ShieldIcon />,
		title: "Secure & Private",
		description: "Your data is encrypted and stays private. Always.",
	},
	{
		icon: <UsersIcon />,
		title: "Connect Freely",
		description: "Join communities and connect with like-minded people.",
	},
];

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<Card className="h-full transition-all hover:shadow-md">
			<CardHeader className="pb-2">
				<div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
					{icon}
				</div>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}


export default function HomePage() {
  const isLoggedIn = !!client.sessionToken;
  const { addLog } = useLog();

  function handleLogWelcome() {
	addLog("Visited Home Page");
  }

  return (
	<div className="flex-1 w-full h-full overflow-auto">
			{/* Hero Section */}
			<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
								Welcome to Reflect
							</h1>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								An <code>revolt.js</code> client built with <code>Next.js</code>
							</p>
						</div>
						<div className="space-x-4">
						  <button type="button" className="px-3 py-1 rounded bg-neutral-800 text-neutral-100 text-xs" onClick={handleLogWelcome}>
							Log Visit
						  </button>
							{isLoggedIn ? (
								<Link href="/app/home">
									<Button size="lg">Go to Home</Button>
								</Link>
							) : (
								<>
									<Link href="/login">
										<Button size="lg">Login</Button>
									</Link>
									<Link href="/register">
										<Button size="lg" variant="outline">
											Create a new Account
										</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Features
							</h2>
							<p className="max-w-[700px] text-muted-foreground md:text-xl">
								Discover what makes our platform special
							</p>
						</div>
					</div>
					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
						{features.map((feature) => (
							<FeatureCard key={feature.title} {...feature} />
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container px-4 md:px-6">
					<div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
						<h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
							Ready to get started?
						</h2>
						<p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
							Join thousands of users already using Revolt to connect and share.
						</p>
						{isLoggedIn ? (
							<Link href="/app/home">
								<Button className="mt-4" size="lg">
									Go to Home
								</Button>
							</Link>
						) : (
							<Link href="/login">
								<Button className="mt-4" size="lg">
									Login
								</Button>
							</Link>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
