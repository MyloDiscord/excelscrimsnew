export type DiscordGuild = {
    id: string;
    name: string;
    icon: string | null;
    permissions: string;
    approximate_presence_count?: number;
    approximate_offline_count?: number;
};

export type AdminGuildsResponse = {
    known: DiscordGuild[];
    unknown?: DiscordGuild[];
};

export type ErrorResponse = {
    message?: string;
};

export async function fetchUserAdminGuilds(): Promise<AdminGuildsResponse | ErrorResponse> {
    try {
        const response = await fetch("/api/discord/user/adminGuilds", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok && "known" in data) {
            return data as AdminGuildsResponse;
        } else {
            return {
                message: (data as ErrorResponse).message ?? "Unknown error",
            };
        }
    } catch (error) {
        console.error("Failed to fetch admin guilds:", error);
        return { message: "Network error or server issue" };
    }
}