const express = require('express');
const router  = express.Router();
const User    = require('../models/users');
const Card    = require('../models/cards');

router.get('/', async (req, res) => {  
    try {
        const allUsers = await User.find();
        const allCards = await Card.find();

        res.render('main/home.ejs', {
            cards: allCards,
            users: allUsers,
            logged: req.session.logged
            // randomCard: allCards[Math.floor(Math.random()*allCards.length)]
        })
    } catch(err){
        res.send(err)
    }
})

module.exports = router;