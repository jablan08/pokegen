const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const Card = require("../models/cards");

// INDEX
router.get('/', async (req, res) => {
    try {
        const foundUsers = await User.find();
        res.render('users/index.ejs', {
            Users: foundUsers
        })
    } catch (err) {
        res.send(err)
    }
})


// SHOW



// EDIT



// DELETE


module.exports = router;