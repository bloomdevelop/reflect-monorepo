"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Users,
  Image,
  Palette,
  Shield,
  Zap,
  Heart,
  Code2,
  Smile,
  FileText,
  Settings,
  Globe,
  Sparkles,
  Bot,
  Video,
  Mic,
  Share2,
  Search,
  Bell,
  Lock,
} from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  status: "available" | "beta" | "coming-soon";
}

const features: Feature[] = [
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Real-time Messaging",
    description:
      "Instant messaging with live connection status and typing indicators",
    category: "core",
    status: "beta",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Direct Messages",
    description: "Private conversations with friends and colleagues",
    category: "core",
    status: "available",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Server Communities",
    description:
      "Join servers and participate in organized channel discussions",
    category: "core",
    status: "available",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Rich Markdown Support",
    description:
      "Format messages with markdown, code blocks, and mathematical expressions",
    category: "messaging",
    status: "beta",
  },
  {
    icon: <Smile className="h-6 w-6" />,
    title: "Custom Emojis",
    description: "Express yourself with custom emojis and reactions",
    category: "messaging",
    status: "beta",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Syntax Highlighting",
    description:
      "Code blocks with beautiful syntax highlighting for multiple languages",
    category: "messaging",
    status: "beta",
  },
  {
    icon: <Image className="h-6 w-6" />,
    title: "Media Sharing",
    description:
      "Share images and files with advanced image viewer and zoom controls",
    category: "media",
    status: "available",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Rich Embeds",
    description: "Interactive embeds for websites, images, and rich content",
    category: "media",
    status: "available",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Theme Customization",
    description: "Dark and light themes with full customization options",
    category: "ui",
    status: "coming-soon",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "User Profiles",
    description:
      "Customizable profiles with hover cards and detailed information",
    category: "ui",
    status: "beta",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Resizable Panels",
    description: "Customize your layout with resizable sidebars and panels",
    category: "ui",
    status: "coming-soon",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Advanced Search",
    description: "Powerful search functionality across messages and channels",
    category: "productivity",
    status: "coming-soon",
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Smart Notifications",
    description: "Intelligent notification system with customizable alerts",
    category: "productivity",
    status: "coming-soon",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Security & Privacy",
    description: "End-to-end encryption and advanced privacy controls",
    category: "security",
    status: "coming-soon",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Moderation Tools",
    description: "Comprehensive moderation features for server management",
    category: "security",
    status: "coming-soon",
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: "Voice & Video Calls",
    description: "High-quality voice and video calling with screen sharing",
    category: "communication",
    status: "coming-soon",
  },
  {
    icon: <Mic className="h-6 w-6" />,
    title: "Voice Channels",
    description: "Persistent voice channels for community hangouts",
    category: "communication",
    status: "coming-soon",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI Assistant",
    description: "Built-in AI assistant for enhanced productivity",
    category: "ai",
    status: "coming-soon",
  },
];

const categories = {
  core: {
    name: "Core Features",
    color: "bg-primary",
    textColor: "text-primary-foreground",
  },
  messaging: {
    name: "Messaging",
    color: "bg-green-600",
    textColor: "text-white",
  },
  media: {
    name: "Media & Files",
    color: "bg-purple-600",
    textColor: "text-white",
  },
  ui: {
    name: "User Interface",
    color: "bg-orange-600",
    textColor: "text-white",
  },
  productivity: {
    name: "Productivity",
    color: "bg-cyan-600",
    textColor: "text-white",
  },
  security: { name: "Security", color: "bg-red-600", textColor: "text-white" },
  communication: {
    name: "Communication",
    color: "bg-pink-600",
    textColor: "text-white",
  },
  ai: { name: "AI Features", color: "bg-indigo-600", textColor: "text-white" },
};

// Pre-compute status badges to avoid re-creating them on each render
const STATUS_BADGES = {
  available: (
    <Badge className="bg-green-600 text-white hover:bg-green-700 border-0">
      Available
    </Badge>
  ),
  beta: (
    <Badge className="bg-yellow-600 text-white hover:bg-yellow-700 border-0">
      Beta
    </Badge>
  ),
  "coming-soon": (
    <Badge variant="outline" className="border-muted-foreground/30">
      Coming Soon
    </Badge>
  ),
} as const;

// Pre-compute feature counts to avoid filtering on each render
const FEATURE_COUNTS = {
  total: features.length,
  available: features.filter((f) => f.status === "available").length,
  beta: features.filter((f) => f.status === "beta").length,
  comingSoon: features.filter((f) => f.status === "coming-soon").length,
};

// Calculate progress based on implemented features (available + beta)
const PROGRESS_PERCENTAGE = Math.round(
  ((FEATURE_COUNTS.available + FEATURE_COUNTS.beta) / FEATURE_COUNTS.total) *
    100,
);

// Pre-compute features by category for faster filtering
const FEATURES_BY_CATEGORY = features.reduce(
  (acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  },
  {} as Record<string, Feature[]>,
);

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [progress, setProgress] = useState(PROGRESS_PERCENTAGE); // Auto-calculated based on implemented features

  // Memoize filtered features to avoid expensive filtering on each render
  const filteredFeatures = useMemo(() => {
    if (selectedCategory === "all") {
      return features;
    }
    return FEATURES_BY_CATEGORY[selectedCategory] || [];
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section
          className="text-center space-y-8 mb-16"
          aria-labelledby="hero-heading"
        >
          <div className="space-y-4 animate-fade-in">
            <h1
              id="hero-heading"
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              Reflect
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A modern Revolt client built with Next.js and shadcn/ui, featuring
              real-time messaging, rich media support, and an intuitive
              interface
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up animation-delay-300">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[140px] hover:scale-105 transition-transform"
                aria-label="Get started with Reflect"
              >
                Get Started
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/app">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[140px] hover:scale-105 transition-transform"
                aria-label="Open Reflect app"
              >
                Open App
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in-up animation-delay-500"
          aria-labelledby="stats-heading"
        >
          <h2 id="stats-heading" className="sr-only">
            Feature Statistics
          </h2>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Total Features
              </CardTitle>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{FEATURE_COUNTS.total}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Available Now
              </CardTitle>
              <Heart className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {FEATURE_COUNTS.available}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Ready to use</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">In Beta</CardTitle>
              <Settings className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {FEATURE_COUNTS.beta}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Testing phase
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Coming Soon</CardTitle>
              <Zap className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {FEATURE_COUNTS.comingSoon}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                In development
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Progress Bar */}
        <section
          className="mb-16 animate-fade-in-up animation-delay-700"
          aria-labelledby="progress-heading"
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle
                id="progress-heading"
                className="flex items-center gap-3 text-lg"
              >
                <Sparkles className="h-6 w-6" />
                Development Progress
              </CardTitle>
              <CardDescription className="text-base">
                Progress based on available and beta features (
                {FEATURE_COUNTS.available + FEATURE_COUNTS.beta} of{" "}
                {FEATURE_COUNTS.total} features implemented)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="w-full h-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">
                  Available & Beta Features
                </span>
                <span className="font-semibold">
                  {progress}% Complete (
                  {FEATURE_COUNTS.available + FEATURE_COUNTS.beta}/
                  {FEATURE_COUNTS.total})
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section
          className="animate-fade-in-up animation-delay-1000"
          aria-labelledby="features-heading"
        >
          <Card>
            <CardHeader className="pb-6">
              <CardTitle
                id="features-heading"
                className="flex items-center gap-3 text-xl"
              >
                <Settings className="h-6 w-6" />
                Feature Overview
              </CardTitle>
              <CardDescription className="text-base">
                Explore all the powerful features available in Reflect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="space-y-8"
              >
                <div className="overflow-x-auto">
                  <TabsList
                    className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 min-w-fit"
                    role="tablist"
                    aria-label="Feature categories"
                  >
                    <TabsTrigger
                      value="all"
                      className="text-sm font-medium"
                      role="tab"
                      aria-controls="all-features"
                    >
                      All
                    </TabsTrigger>
                    {Object.entries(categories).map(([key, category]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="text-sm font-medium"
                        role="tab"
                        aria-controls={`${key}-features`}
                      >
                        {category.name.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  role="tabpanel"
                >
                  {filteredFeatures.map((feature, index) => {
                    const categoryInfo =
                      categories[feature.category as keyof typeof categories];
                    return (
                      <Card
                        key={`${feature.category}-${index}`}
                        className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-border/50"
                      >
                        <CardHeader className="space-y-4 pb-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`p-3 rounded-xl ${categoryInfo.color} ${categoryInfo.textColor} shrink-0`}
                              >
                                {feature.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <CardTitle className="text-lg font-semibold leading-tight">
                                  {feature.title}
                                </CardTitle>
                              </div>
                            </div>
                            <div className="shrink-0">
                              {STATUS_BADGES[feature.status]}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                          </CardDescription>
                          <div className="flex justify-start">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium border-muted-foreground/30"
                            >
                              {categoryInfo.name}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 pt-12 border-t border-border animate-fade-in-up animation-delay-1200">
          <p className="text-muted-foreground text-base mb-6">
            Built with ❤️ using Next.js, shadcn/ui, and modern web technologies
          </p>
          <nav
            className="flex justify-center gap-4"
            aria-label="Footer navigation"
          >
            <Link href="/app">
              <Button
                variant="ghost"
                size="lg"
                className="hover:scale-105 transition-transform"
              >
                Launch App
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                size="lg"
                className="hover:scale-105 transition-transform"
              >
                Sign In
              </Button>
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
