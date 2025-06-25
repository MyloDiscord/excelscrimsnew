"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 640);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-white px-4 min-h-screen">
        <div className="mb-10">
          <Image
            src="/epiclogo.png"
            alt="Epic Logo"
            width={160}
            height={55}
            priority
          />
        </div>

        <a
          href={""}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="
            bg-[#2c262a] 
            hover:bg-[#3a3137] 
            text-gray-200
            shadow-lg shadow-black/50
            px-14 py-4
            rounded-xl
            font-semibold text-xl
            transition-all duration-300 ease-in-out
            transform
            hover:scale-105
            active:scale-95
            select-none
            focus:outline-none focus:ring-4 focus:ring-[#4e3b45]/50
            cursor-pointer
          "
        >
          Login With Epic
        </a>

        <p
          className={`mt-8 max-w-md text-center text-sm text-gray-400 transition-all duration-300 ease-in-out
    ${
      isMobile
        ? "opacity-100 translate-y-0"
        : hovered
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }
  `}
          style={{ willChange: "opacity, transform" }}
        >
          By signing in, you&apos;ll unlock access to our scrims and events.
        </p>
      </div>
    </div>
  );
}
