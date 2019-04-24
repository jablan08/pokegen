const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const Card = require("../models/cards");


router.get('/', async (req, res) => {
    try {
        const foundUsers = await User.find();
        res.render('users/index.ejs', {
            users: foundUsers
        })
    } catch (err) {
        res.send(err)
    }
})


module.exports = router;