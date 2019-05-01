const mongoose  = require('mongoose');

const cardSchema = mongoose.Schema({
    name: String,
    url: String,
    hp: String,
    type: String, 
    stats: String,
    attack: String,
    attackType1a: String,
    attackType1b: String,
    attackType1c: String,
    attackType1d: String,
    description: String,
    damage: String,
    attack2: String,
    attackType2a: String,
    attackType2b: String,
    attackType2c: String,
    attackType2d: String,
    attackType2: String,
    description2: String,
    damage2: String, 
    weakness: String, 
    resistance: String,
    favorite: Boolean, 
    story: String,
    boxBottom: String,

})

const Card = mongoose.model('Card', cardSchema);

module.exports = Card