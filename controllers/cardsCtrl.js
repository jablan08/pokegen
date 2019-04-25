const express = require('express');
const router  = express.Router();
const Card = require("../models/cards");
const User = require("../models/users");

const logUser = (req, res, next) => {
    console.log("using middleware")
    if(req.session.logged) {
        
        next()
    } else {
        res.redirect("/auth/login");
    }
}

// INDEX
router.get("/", async (req,res)=> {
    try {
        const allCards = await Card.find({});
        res.render("cards/index.ejs", {
            cards: allCards,
            message: req.session.message
        });
    } catch(err) {
        res.send(err) 
    }
})

// NEW
router.get("/new", logUser, async (req,res)=>{
    try {
        res.render("cards/new.ejs")
    } catch(err){
        res.send(err)
    }
})

router.post("/", logUser, async (req,res)=>{
    try {
        Card.create(req.body, (err,createdCard)=>{
            console.log(createdCard)
            User.findById(req.session.userDbId, (err,foundUser)=>{
                if (err) {
                    console.log(err)
                } else {
                    console.log(foundUser)
                }
                foundUser.cards.push(createdCard);
                foundUser.save((err,savedUser)=>{
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(savedUser)
                        res.redirect("/cards")
                    }
                })
                
            })
        })
    } catch(err) {
        res.send(err)
    }
})

// SHOW
router.get('/:id', async (req, res)=>{
    // req.params.id is the articles id
    try {
        console.log("hit")
        const foundUser = await User.findOne({'cards': req.params.id}).populate({path: 'cards', match: {_id: req.params.id}})
  
        console.log(foundUser, "<---- foundUser in card's show route");
        res.render('cards/show.ejs', {
          user: foundUser,
          card: foundUser.cards[0]
          
        })
  
    } catch(err){
      res.send(err);
    }
  
  });


// EDIT
router.get("/:id/edit", async (req,res)=>{
    try {
        const foundUser = await User.findOne({'cards': req.params.id}).populate({path: 'cards', match: {_id: req.params.id}});
        
        // console.log(foundUser._id, "<---- foundUser in card's show route");
        // console.log(req.session.userDbId, "<---userDbId")
        if (req.session.userDbId === foundUser._id.toString()) {
            console.log("success!")
            res.render("cards/edit.ejs", {
                card: foundUser.cards[0],
                user: foundUser
            });
        } else {
            console.log(req.session)
            req.session.message = "You cannot edit this Pokemon";
            res.redirect("/cards");  
        }
    } catch(err){
        res.send(err);
    }
})


// DELETE



module.exports = router;