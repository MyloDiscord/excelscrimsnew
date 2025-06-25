type DiscordGuild = {
    id: string;
    name: string;
    icon: string | null;
    owner?: boolean;
    permissions: string;
    features?: string[];
    approximate_presence_count?: number;
    approximate_offline_count?: number;
};

type AdminGuildsResponse = {
    known: DiscordGuild[];
    unknown?: DiscordGuild[];
};

export async function checkUserIsGuildAdmin(guildId: string): Promise<boolean> {
    try {
        const res = await fetch("/api/discord/user/adminGuilds", {
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) return false;

        const data: AdminGuildsResponse = await res.json();

        if (data.known.some((guild) => guild.id === guildId)) {
            return true;
        }

        if (data.unknown && data.unknown.some((guild) => guild.id === guildId)) {
            return false;
        }

        return false;
    } catch (e) {
        console.error("Error checking admin guilds:", e);
        return false;
    }
}
