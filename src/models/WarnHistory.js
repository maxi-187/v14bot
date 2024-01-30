const { model, Schema } = require("mongoose");

let WarnHistorySchema = new Schema({
  guildId: { type: String, required: true },
  memberId: { type: String, required: true },
  warnings: [
    {
      reason: { type: String, required: true },
      moderatorId: { type: String, required: true },
      timestamp: { type: Date, required: true },
    },
  ],
});

module.exports = model("WarnHistory", WarnHistorySchema);
