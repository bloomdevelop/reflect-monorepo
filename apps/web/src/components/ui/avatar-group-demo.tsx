"use client"

import { AvatarGroup } from "@/components/ui/avatar-group"

const AvatarGroupDemo = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Avatar Group Demo</h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Default</h3>
          <AvatarGroup
            avatars={[
              {
                src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
                label: "Emma Wilson",
              },
              {
                src: "https://images.unsplash.com/photo-1519244703995-f4e0f30606f3?w=200",
                label: "James Rodriguez",
              },
              {
                src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
                label: "Michael Chen",
              },
              {
                src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
                label: "Sarah Johnson",
              },
              {
                src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
                label: "David Kim",
              },
              {
                src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                label: "Alex Turner",
              },
            ]}
            maxVisible={5}
            size={45}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Custom Size</h3>
          <AvatarGroup
            avatars={[
              { src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200", label: "Admin" },
              { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200", label: "Moderator" },
              { src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200", label: "Member" },
            ]}
            size={60}
            overlap={20}
          />
        </div>
      </div>
    </div>
  )
}

export { AvatarGroupDemo }
