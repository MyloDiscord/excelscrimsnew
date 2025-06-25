"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [hovered, setHovered] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
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
        {/* Login Button */}
        <a
          href={""}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="
            bg-[#2c262a] 
            hover:bg-[#3a3137] 
            text-gray-200
            shadow-lg shadow-black/50
            px-8 py-4
            rounded-xl
            font-semibold text-xl
            transition-all duration-300 ease-in-out
            transform
            hover:scale-105
            active:scale-95
            select-none
            focus:outline-none focus:ring-4 focus:ring-[#4e3b45]/50
            cursor-pointer
            flex items-center gap-3
          "
        >
          <Image
            src="/epiclogo.png"
            alt="Epic Logo"
            width={28}
            height={28}
            priority
          />
          Login With Epic
        </a>

        {/* Subtext */}
        <p
          className={`mt-6 max-w-md text-center text-sm text-gray-400 transition-all duration-300 ease-in-out
          ${
            isMobile
              ? "opacity-100 translate-y-0"
              : hovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{ willChange: "opacity, transform" }}
        >
          By signing in, you&apos;ll unlock access to our scrims and events.
        </p>

        {/* Socials Button */}
        <button
          onClick={() => setShowSocials(!showSocials)}
          className="mt-10 bg-[#1e1e1e] hover:bg-[#292929] text-gray-300 font-medium px-10 py-3 rounded-xl transition-all duration-300 ease-in-out shadow-md shadow-black/40"
        >
          Socials
        </button>

        {/* Social Links */}
        <div
          className={`flex flex-col items-center gap-3 mt-4 transition-all duration-300 ease-in-out
          ${
            showSocials
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{ willChange: "opacity, transform" }}
        >
          <a
            href="https://twitter.com"
            target="_blank"
            className="bg-[#1d1f23] hover:bg-[#2a2d34] text-white px-8 py-2 rounded-lg shadow shadow-black/40 transition-all duration-200"
          >
            Twitter
          </a>
          <a
            href="https://discord.gg"
            target="_blank"
            className="bg-[#1d1f23] hover:bg-[#2a2d34] text-white px-8 py-2 rounded-lg shadow shadow-black/40 transition-all duration-200"
          >
            Discord
          </a>
        </div>
      </div>
    </div>
  );
}
