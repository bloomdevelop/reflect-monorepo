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
  core: { name: "Core Features", color: "bg-blue-500" },
  messaging: { name: "Messaging", color: "bg-green-500" },
  media: { name: "Media & Files", color: "bg-purple-500" },
  ui: { name: "User Interface", color: "bg-orange-500" },
  productivity: { name: "Productivity", color: "bg-cyan-500" },
  security: { name: "Security", color: "bg-red-500" },
  communication: { name: "Communication", color: "bg-pink-500" },
  ai: { name: "AI Features", color: "bg-indigo-500" },
};

// Pre-compute status badges to avoid re-creating them on each render
const STATUS_BADGES = {
  available: (
    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
      Available
    </Badge>
  ),
  beta: (
    <Badge
      variant="secondary"
      className="bg-yellow-500 hover:bg-yellow-600 text-black"
    >
      Beta
    </Badge>
  ),
  "coming-soon": <Badge variant="outline">Coming Soon</Badge>,
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
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Reflect
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A modern Revolt client built with Next.js and shadcn/ui
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Open App
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Features
              </CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{FEATURE_COUNTS.total}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Now
              </CardTitle>
              <Heart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {FEATURE_COUNTS.available}
              </div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Beta</CardTitle>
              <Settings className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {FEATURE_COUNTS.beta}
              </div>
              <p className="text-xs text-muted-foreground">Testing phase</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Soon</CardTitle>
              <Zap className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {FEATURE_COUNTS.comingSoon}
              </div>
              <p className="text-xs text-muted-foreground">In development</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Development Progress
            </CardTitle>
            <CardDescription>
              Progress based on available and beta features (
              {FEATURE_COUNTS.available + FEATURE_COUNTS.beta} of{" "}
              {FEATURE_COUNTS.total} features implemented)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Available & Beta Features</span>
              <span>
                {progress}% Complete (
                {FEATURE_COUNTS.available + FEATURE_COUNTS.beta}/
                {FEATURE_COUNTS.total})
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Overview
            </CardTitle>
            <CardDescription>
              Explore all the powerful features available in Reflect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-9">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                {Object.entries(categories).map(([key, category]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {category.name.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeatures.map((feature, index) => (
                  <Card
                    key={`${feature.category}-${index}`}
                    className="group hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${categories[feature.category as keyof typeof categories].color} text-white`}
                          >
                            {feature.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {feature.title}
                            </CardTitle>
                          </div>
                        </div>
                        {STATUS_BADGES[feature.status]}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      <div className="mt-4">
                        <Badge variant="outline" className="text-xs">
                          {
                            categories[
                              feature.category as keyof typeof categories
                            ].name
                          }
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground">
            Built with ❤️ using Next.js, shadcn/ui, and modern web technologies
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/app">
              <Button variant="ghost" size="sm">
                Launch App
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
