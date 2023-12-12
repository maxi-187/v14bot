const {model, Schema} = require('mongoose');

let WarnHistorySchema = new Schema({
    guildId: { type: String, required: true },
    memberId: { type: String, required: true },
    history: { type: String },
    Warnsins: { type: String },
});

module.exports = model('WarnHistory', WarnHistorySchema);