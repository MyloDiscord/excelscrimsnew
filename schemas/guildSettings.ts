import { Schema, model, models } from "mongoose";

const staffRoleSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: Number, required: true },
    position: { type: Number, required: true },
});

const guildSettingsSchema = new Schema(
    {
        guildId: { type: String, required: true, unique: true },
        staffRoles: [staffRoleSchema],
        lastUpdatedBy: { type: String },
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: "lastUpdated" },
    }
);

const GuildSettings =
    models.GuildSettings || model("GuildSettings", guildSettingsSchema);

export default GuildSettings;