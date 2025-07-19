import { Schema, model, models } from "mongoose";

const lobbyDataSchema = new Schema(
    {
        guildId: { type: String, required: true, unique: true },
        lobbyId: { type: String, default: null },
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: "lastUpdated" },
    }
);

const LobbyData =
    models.LobbyData || model("LobbyData", lobbyDataSchema);

export default LobbyData;
