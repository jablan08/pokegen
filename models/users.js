const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }]

})

userSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) 
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

userSchema.pre("save", function(next){
    if(this.isModified("password")){
        this.password = this.hashPassword(this.password)
    }
    next()
})


const User =  mongoose.model('User', userSchema)


module.exports = User