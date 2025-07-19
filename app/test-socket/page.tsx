"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";
const socket = io(SOCKET_URL);

type ChatMessage = {
  content: string;
  userId: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    console.log(`🔌 Connecting to ${SOCKET_URL}...`);

    socket.on("connect", () => {
      console.log(`✅ Connected to ${SOCKET_URL}`);
      socket.emit("new-connection", { timestamp: new Date().toISOString() });
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
  }, []);

  const sendMessage = () => {
    const data: ChatMessage = {
      content: message,
      userId: "253680525619757057",
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
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            {msg.content}{" "}
            <button onClick={() => giveRole(msg.userId)}>Give Role</button>
          </li>
        ))}
      </ul>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>

      {feedback && <p>{feedback}</p>}
    </div>
  );
}
