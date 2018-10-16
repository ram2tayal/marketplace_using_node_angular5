const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
   email: String,
   token: String
});

module.exports = mongoose.model('Token', tokenSchema);