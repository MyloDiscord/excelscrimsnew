
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function HostPage({ params }: Props) {
  const guildId = params.id;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/discord/guild/${guildId}/fetch-user-roles`, {
    headers: {
      Cookie: "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/unauthorized"); // user not allowed
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
