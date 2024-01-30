const { model, Schema } = require("mongoose");

let AutoModSchema = new Schema({
  guildId: { type: String, required: true },
  memberId: { type: String, required: true },
  warnings: [
    {
      reason: { type: String, required: true, maxlength: 255 },
      moderatorId: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  AntiSpam: { type: Boolean, required: false },
});

module.exports = model("AutoMod", AutoModSchema);
