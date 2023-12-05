const {model, Schema} = require('mongoose');

let AutoModSchema = new Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    warnings: { type: Number, default: 0 },
    AntiCaps: { type: Boolean, required: false },
    AntiSpam: { type: Boolean, required: false },
});

module.exports = model('AutoMod', AutoModSchema);