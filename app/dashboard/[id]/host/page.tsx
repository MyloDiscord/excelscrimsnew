import { redirect } from "next/navigation";

export default async function HostPage({ params }: { params: { id: string } }) {
  const guildId = params.id;

  const res = await fetch(`/api/discord/guild/${guildId}/fetch-user-roles`, {
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/unauthorized");
  }

  const data = await res.json();

  if (!data.logChannel) {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1>✅ Host Page for Guild ID: {guildId}</h1>
    </div>
  );
}
