import { cn } from "~/lib/styling";

export default function MobileWarning() {
  return (
    <div
      class={cn(
        "xl:hidden lg:hidden",
        "fixed top-0 left-0 w-screen h-screen",
        "flex flex-col justify-center items-center gap-8",
        "bg-white text-black",
        "p-4",
        "text-center",
        "text-xl font-bold",
        "z-999"
      )}
    >
      <p>
        Looks like you're using on mobile device or a small window/screen. This
        application is not optimized for any devices yet.
      </p>
      <p>For iPad users, please rotate your screen into landspace orientation</p>
    </div>
  );
}
