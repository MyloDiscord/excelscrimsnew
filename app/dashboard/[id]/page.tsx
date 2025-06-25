"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUserIsGuildAdmin } from "@/lib/checkUserIsGuildAdmin";
import ClipLoader from "react-spinners/ClipLoader";

export default function GuildDashboardPage() {
  const { guildId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (typeof guildId !== "string") return;

      const isAdmin = await checkUserIsGuildAdmin(guildId);

      if (!isAdmin) {
        setUnauthorized(true);
      }

      setLoading(false);
    }

    checkAccess();
  }, [guildId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        You are not an admin in this server.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black p-6">
      {/* Your guild dashboard content here */}
      Dashboard for guild: {guildId}
    </div>
  );
}
