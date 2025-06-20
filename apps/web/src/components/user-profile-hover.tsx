import { memo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { User } from "revolt.js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Memoized Avatar component to prevent unnecessary re-renders
const UserAvatar = memo(({ user, className = "" }: { user: User; className?: string }) => {
  const avatarUrl = user.avatarURL;
  const fallback = user.username?.charAt(0).toUpperCase() || '?';
  
  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = "UserAvatar";

// Main HoverCard component
const HoverCardComponent = memo(({ user }: { user: User }) => {
  // Memoize user data to prevent unnecessary re-renders
  const userDisplayName = user.displayName;
  const username = user.username;
  const discriminator = user.discriminator;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          <UserAvatar user={user} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[340px]">
        <div className="flex items-start gap-3">
          <UserAvatar user={user} className="h-12 w-12" />
          <div className="space-y-1">
            {userDisplayName && (
              <p className="text-lg font-semibold">{userDisplayName}</p>
            )}
            <p className="text-sm font-medium">
              @{username}#{discriminator}
            </p>
            <p className="text-muted-foreground text-sm">Bio Here</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the user ID changes
  return prevProps.user.id === nextProps.user.id;
});

HoverCardComponent.displayName = "HoverCardComponent";
export default HoverCardComponent;
