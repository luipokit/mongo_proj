const mongoose = require('mongoose');

const Buddha = new mongoose.Schema({
    id: {type: String, trim:true, default: ''}, // 'Bob', ' Bob', 'Bob '
    title: {type: String, trim:true, default: ''},
    byline: {type: Number, default: 0},
    juans: {type: Array, default: []},
    chars: {type: Number, default: 0}
})

module.exports = mongoose.model('Buddha', Buddha);