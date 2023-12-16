const { model, Schema } = require("mongoose");

let LinkSchema = new Schema({
  link: { type: String, required: true },
});

module.exports = model("Link", LinkSchema);
