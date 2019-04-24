const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const Card = require("../models/cards");

// INDEX
router.get('/', async (req, res) => {
    console.log(req.session, "this user is")
    try {
        const foundUsers = await User.find();
        res.render('users/index.ejs', {
            users: foundUsers
        })
    } catch (err) {
        res.send(err)
    }
})


// SHOW
router.get('/:id', async (req, res) => {
    try {
        const foundUser = User.findById(req.params.id)
        // .populate('cards')
        // .exec((err, foundUser))
        res.render('users/show.ejs',{
            user: foundUser
        })    
    } catch (err) {
        res.send(err)
    }
})




// EDIT



// DELETE


module.exports = router;