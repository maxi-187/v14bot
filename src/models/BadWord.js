const { model, Schema } = require("mongoose");

let BadWordSchema = new Schema({
  word: { type: String, required: true },
});

module.exports = model("BadWord", BadWordSchema);
