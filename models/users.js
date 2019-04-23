const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cards'
    }]

})

const User =  mongoose.model('User', userSchema)

module.exports = User