const mongoose  = require('mongoose');

const cardSchema = mongoose.Schema({
    name: String,
    url: String,
    hp: Number,
    type: [{
        water: Boolean,
        
    }], // drop down option, 8 types
    attack: String,
    damage: Number,
    weakness: String, // limited to types
    resistance: String,
})

const Card = mongoose.model('Card', cardSchema);

module.exports = Card