"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
const socket = io(SOCKET_URL);

type ChatMessage = {
  content: string;
  userId: string;
  username: string;
  avatar: string;
};

export default function ChatBox() {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;

    console.log(`🔌 Connecting to ${SOCKET_URL}...`);

    socket.on("connect", () => {
      const discordId =
        user?.externalAccounts?.find((acc) => acc.provider === "discord")
          ?.providerUserId || "Unavailable";

      console.log(`✅ Connected to ${SOCKET_URL}`);
      socket.emit("new-connection", {
        userId: discordId,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.on("message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("role-success", (msg: string) => {
      setFeedback(`✅ ${msg}`);
    });

    socket.on("role-failed", (msg: string) => {
      setFeedback(`❌ ${msg}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [isLoaded, user]);

  const createChannels = () => {
    socket.emit("create-channels", {
      guildId: "1368170957860241418", // your guild ID
      channels: ["scrim-chat", "mod-logs", "announcements"], // any names you want
    });
  };

  const sendMessage = () => {
    const discordId =
      user?.externalAccounts?.find((acc) => acc.provider === "discord")?.providerUserId || "Unavailable";

    const data: ChatMessage = {
      content: message,
      userId: discordId,
      username: user?.username || "Unknown",
      avatar: user?.imageUrl || "",
    };

    socket.emit("message", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  const giveRole = (userId: string) => {
    console.log("🔁 Attempting to give role to", userId);
    socket.emit("give-role", {
      guildId: "1368170957860241418",
      userId,
      roleId: "1390678315534123111",
    });
  };

  return (
    <div>
      <ul className="space-y-2">
        {messages.map((msg, i) => (
          <li
            key={i}
            className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl shadow text-white max-w-[400px]"
          >
            <img
              src={msg.avatar}
              alt={msg.username}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <div className="font-semibold">{msg.username}</div>
              <div className="text-sm text-gray-300">{msg.content}</div>
              <button
                onClick={() => giveRole(msg.userId)}
                className="text-xs text-blue-400 mt-1"
              >
                Give Role
              </button>
            </div>
          </li>
        ))}
      </ul>

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>

      {feedback && <p>{feedback}</p>}
      <button onClick={createChannels}>Create 3 Channels</button>
    </div>
  );
}
