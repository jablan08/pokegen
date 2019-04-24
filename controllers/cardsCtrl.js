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
router.get("/new", async (req,res)=>{
    try {
       
        if (req.session.logged) {
            console.log(req.session)
            if (req.session.logged) {
                res.render("cards/new.ejs")
            } else {
                console.log(foundUser, "failed1")
                res.redirect("/auth/login");
            }
        } else {
            console.log(foundUser, "failed2")
            res.redirect("/auth/login");
        }
    } catch(err){
        res.send(err)
    }
})


// SHOW



// EDIT



// DELETE



module.exports = router;