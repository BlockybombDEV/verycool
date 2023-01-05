const {model, Schema} = require('mongoose')

let warnSchema = new Schema({
    Guild: String,
    userId: String,
    Staff: String,
    reason: String,
},
{ timestamps: true});

module.exports = model('warningLog', warnSchema)