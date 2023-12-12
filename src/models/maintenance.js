const { Schema, model } = require('mongoose');

const maintenanceSchema = new Schema({
    maintenanceMode: { type: Boolean, default: false },
});

module.exports = model('maintenance', maintenanceSchema);