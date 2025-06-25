export type GetTokenResponse = {
  me: { accessToken: string }[];
};

export async function fetchUserDiscordToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/discord/getToken");
    const data: GetTokenResponse = await res.json();

    if (res.ok && data.me?.[0]?.accessToken) {
      return data.me[0].accessToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch Discord token:", error);
    return null;
  }
}
