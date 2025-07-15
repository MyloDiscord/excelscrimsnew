"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HostPage() {
  const { id: guildId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const res = await fetch(`/api/discord/guild/${guildId}/fetch-user-roles`, {
  credentials: "include",
});

      if (!res.ok) {
        router.push("/unauthorized");
        return;
      }

      const data = await res.json();
      console.log(data);

      setLoading(false); // Access granted
    };

    checkAccess();
  }, [guildId, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>✅ Host Page for Guild ID: {guildId}</h1>
    </div>
  );
}
