const { model, Schema } = require('mongoose');

let authSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    RoleID: String,
});

module.exports = model('authSchema', authSchema)