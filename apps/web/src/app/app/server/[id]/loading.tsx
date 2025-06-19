import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className={cn("flex h-screen w-screen items-center justify-center bg-background-foreground")}>
      <Loader2Icon className={cn("h-6 w-6 animate-spin text-foreground")} />
    </div>
  );
}
