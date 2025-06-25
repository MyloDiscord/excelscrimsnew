type DiscordGuild = {
    id: string;
    permissions: string;
};

type AdminGuildsResponse = {
    known: DiscordGuild[];
};

export async function checkUserIsGuildAdmin(guildId: string): Promise<boolean> {
    try {
        const res = await fetch("/api/discord/user/adminGuilds", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) return false;

        const data: AdminGuildsResponse = await res.json();

        const guild = data.known.find((g) => g.id === guildId);
        if (!guild) return false;

        const ADMIN_PERMISSION = 0x00000008n;
        const permissionBits = BigInt(guild.permissions);

        return (permissionBits & ADMIN_PERMISSION) === ADMIN_PERMISSION;
    } catch (err) {
        console.error("checkUserIsGuildAdmin error:", err);
        return false;
    }
}
