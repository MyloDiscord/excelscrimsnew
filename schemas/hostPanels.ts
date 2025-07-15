import mongoose from "mongoose";

const hostPanelSchema = new mongoose.Schema({
  guildId: String,
  tournamentName: String,
  tournamentId: String,
  type: String,
  customKey: String,
  start: String,
  end: String,
  actualStartDate: Date,
  actualEndDate: Date,
  signUpChannelId: String,
  reminderMessageId: String,
  gameNumber: String,
  eventLink: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
});

export default mongoose.models.HostPanel || mongoose.model("HostPanel", hostPanelSchema);
