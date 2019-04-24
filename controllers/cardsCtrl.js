const express = require('express');
const router  = express.Router();
const Card = require("../models/cards");
const User = require("../models/users");

// INDEX
router.get("/", async (req,res)=> {
    try {
        const allCards = await Card.find({});
        res.render("cards/index.ejs", {
            cards: allCards
        });
    } catch(err) {
        res.send(err)
    }
})


// NEW




// SHOW



// EDIT



// DELETE


module.exports = router;