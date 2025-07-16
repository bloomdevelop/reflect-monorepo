import { Card } from "~/components/ui/Card";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import Avatar from "~/components/ui/Avatar";

export default function HomePage() {
  return (
    <div class="flex flex-col h-full">
      {/* Chat Header */}
      <div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="font-semibold text-lg"># general</h2>
          <p class="text-sm text-gray-500">Welcome to the general channel</p>
        </div>
      </div>

      {/* Messages Area */}
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sample Messages */}
        <div class="flex gap-3">
          <Avatar fallback="User" src="" alt="User" class="w-10 h-10" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold">Alice</span>
              <span class="text-xs text-gray-500">Today at 2:30 PM</span>
            </div>
            <p class="text-gray-800 dark:text-gray-200">
              Welcome to Reflect! This is a modern Revolt chat client.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <Avatar fallback="User" src="" alt="User" class="w-10 h-10" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold">Bob</span>
              <span class="text-xs text-gray-500">Today at 2:32 PM</span>
            </div>
            <p class="text-gray-800 dark:text-gray-200">
              Thanks! The interface looks great. Love the clean design.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <Avatar fallback="User" src="" alt="User" class="w-10 h-10" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold">Charlie</span>
              <span class="text-xs text-gray-500">Today at 2:35 PM</span>
            </div>
            <p class="text-gray-800 dark:text-gray-200">
              The Solid.js implementation is really smooth. Great work on the
              performance!
            </p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <Input placeholder="Type a message..." class="flex-1" />
          <Button variant="primary">Send</Button>
        </div>
      </div>
    </div>
  );
}
