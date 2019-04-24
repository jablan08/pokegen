const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const Card = require("../models/cards");


router.get('/', (req, res) => {
    res.render('users/index.ejs')
})


module.exports = router;