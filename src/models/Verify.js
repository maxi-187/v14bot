const { model, Schema } = require("mongoose");

let VerifySchema = new Schema({
  GuildID: String,
  ChannelID: String,
});

module.exports = model("Verify", VerifySchema);
