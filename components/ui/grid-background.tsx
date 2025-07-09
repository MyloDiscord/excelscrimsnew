import { cn } from "@/lib/utils";
import React from "react";

export function GridBackgroundDemo() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 w-full h-full",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
        style={{
          maskImage:
            "radial-gradient(circle at 50% 50%, white 65%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, white 65%, transparent 100%)",
        }}
      />
      <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        Backgrounds
      </p>
    </div>
  );
}
