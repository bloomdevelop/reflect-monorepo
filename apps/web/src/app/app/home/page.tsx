"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/revolt";
import {
  Mail,
  MessageCircle,
  Settings,
  UserCircle2,
  Users,
  Zap,
  Activity,
  Clock,
  MessageSquare,
  Heart,
  Star,
} from "lucide-react";
import UserProfileDialog from "@/components/user-profile";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Channel, User } from "revolt.js";

// Loading skeleton component for DM/Friend items
const SkeletonItem = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
  </div>
);

// Animated gradient background component
const GradientCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-background/95 via-background/80 to-background/95 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
    <div className="relative">{children}</div>
  </div>
);

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [friends, setFriends] = useState<User[]>([]);
  const [dms, setDms] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientReady, setClientReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(
    null,
  );

  useEffect(() => {
    // Check if client is ready and authenticated
    if (!client.sessions) {
      window.location.href = escape("/login");
      return;
    }

    const checkClient = () => {
      if (client.ready()) {
        setClientReady(true);
      } else {
        setTimeout(checkClient, 100);
      }
    };
    checkClient();
  }, []);

  useEffect(() => {
    if (!clientReady) return;

    function fetchData() {
      try {
        // Get current user
        const user = client.user;
        if (user) setCurrentUser(user);

        // Get DMs
        const channels = Array.from(client.channels.values());
        const directMessages = channels.filter(
          (channel) => channel.type === "DirectMessage" && channel.active,
        );
        setDms(directMessages);

        // Get friends
        const friendsList = Array.from(client.users.values()).filter(
          (user) => user.relationship === "Friend",
        );
        setFriends(friendsList);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Unable to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [clientReady]);

  // Show loading state if client isn't ready or we're loading data
  if (!clientReady || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Hero Profile Card Skeleton */}
          <GradientCard className="p-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-56" />
                    <Skeleton className="h-5 w-40" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-36" />
                </div>
                <Skeleton className="h-5 w-96" />
              </div>
            </div>
          </GradientCard>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <GradientCard key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* DMs Skeleton */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-10 w-36" />
              </div>
              <GradientCard className="divide-y divide-border/50">
                {[...Array(4)].map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </GradientCard>
            </div>

            {/* Friends Skeleton */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
              <GradientCard className="divide-y divide-border/50">
                {[...Array(4)].map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </GradientCard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex items-center justify-center p-8">
        <GradientCard className="p-8 text-center space-y-6 max-w-md">
          <div className="h-16 w-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <Activity className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </GradientCard>
      </div>
    );
  }

  // If client is ready but we have no user, show error or redirect
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex items-center justify-center p-8">
        <GradientCard className="p-8 text-center space-y-6 max-w-md">
          <div className="h-16 w-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
            <UserCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Not Logged In</h2>
            <p className="text-muted-foreground">
              Please log in to view your dashboard
            </p>
          </div>
        </GradientCard>
      </div>
    );
  }

  const getStatusColor = (presence?: string) => {
    switch (presence) {
      case "Online":
        return "bg-green-500";
      case "Idle":
        return "bg-yellow-500";
      case "Focus":
        return "bg-blue-500";
      case "Busy":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (presence?: string) => {
    switch (presence) {
      case "Online":
        return <Zap className="h-3 w-3" />;
      case "Idle":
        return <Clock className="h-3 w-3" />;
      case "Focus":
        return <Star className="h-3 w-3" />;
      case "Busy":
        return <Activity className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Hero User Profile Card */}
        <GradientCard className="p-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={currentUser?.avatarURL || currentUser?.defaultAvatarURL}
                  alt={currentUser?.username}
                />
                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                  {currentUser?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {currentUser?.status?.presence && (
                <div
                  className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background flex items-center justify-center ${getStatusColor(currentUser.status.presence)}`}
                >
                  {getStatusIcon(currentUser.status.presence)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      {currentUser?.displayName || currentUser?.username}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      @{currentUser?.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {currentUser?.status?.presence && (
                      <Badge variant="secondary" className="gap-1">
                        {getStatusIcon(currentUser.status.presence)}
                        {currentUser.status.presence}
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      {friends.length} friends
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 hover:bg-primary/10"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              {currentUser?.status?.text && (
                <p className="mt-4 text-sm italic text-muted-foreground">
                  "{currentUser.status.text}"
                </p>
              )}
            </div>
          </div>
        </GradientCard>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GradientCard className="p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dms.length}</div>
                <div className="text-sm text-muted-foreground">
                  Direct Messages
                </div>
              </div>
            </div>
          </GradientCard>

          <GradientCard className="p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{friends.length}</div>
                <div className="text-sm text-muted-foreground">Friends</div>
              </div>
            </div>
          </GradientCard>

          <GradientCard className="p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {
                    friends.filter((f) => f.status?.presence === "Online")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Online Now</div>
              </div>
            </div>
          </GradientCard>

          <GradientCard className="p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">Active</div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>
          </GradientCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Direct Messages */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                </div>
                Direct Messages
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-blue-500/10"
              >
                <Mail className="h-4 w-4" />
                New Message
              </Button>
            </div>
            <GradientCard className="divide-y divide-border/50 max-h-96 overflow-y-auto">
              {dms.length === 0 ? (
                <div className="p-8 text-center space-y-4">
                  <div className="h-16 w-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      No conversations yet
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Start a conversation with your friends!
                    </p>
                  </div>
                </div>
              ) : (
                dms.map((dm) => {
                  const recipient = Array.from(dm.recipients || []).find(
                    (user) => user.id !== currentUser?.id,
                  );
                  return (
                    <Link
                      href={`/app/dm/${dm.id}`}
                      key={dm.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-all duration-200 group"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                          <AvatarImage src={recipient?.avatarURL} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                            {recipient?.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {recipient?.status?.presence && (
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background ${getStatusColor(recipient.status.presence)}`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {recipient?.displayName || recipient?.username}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {dm.lastMessage
                            ? `Last message: ${new Date(dm.lastMessage.createdAt).toLocaleDateString()}`
                            : "No messages yet"}
                        </p>
                      </div>
                      <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })
              )}
            </GradientCard>
          </div>

          {/* Friends List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                Friends
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-green-500/10"
              >
                <UserCircle2 className="h-4 w-4" />
                Add Friend
              </Button>
            </div>
            <GradientCard className="divide-y divide-border/50 max-h-96 overflow-y-auto">
              {friends.length === 0 ? (
                <div className="p-8 text-center space-y-4">
                  <div className="h-16 w-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      No friends yet
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Add some friends to get started!
                    </p>
                  </div>
                </div>
              ) : (
                friends.map((friend) => (
                  <button
                    key={friend.id}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-all duration-200 group"
                    type="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedUserProfile(friend);
                      setProfileOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSelectedUserProfile(friend);
                        setProfileOpen(true);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                          <AvatarImage
                            src={friend.avatarURL || friend.defaultAvatarURL}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                            {friend.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {friend.status?.presence && (
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center ${getStatusColor(friend.status.presence)}`}
                          >
                            {getStatusIcon(friend.status.presence)}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {friend.displayName || friend.username}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {friend.status?.text ||
                            friend.status?.presence ||
                            "No status"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </button>
                ))
              )}
            </GradientCard>
          </div>
        </div>
      </div>

      {selectedUserProfile && (
        <UserProfileDialog
          user={selectedUserProfile}
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}
