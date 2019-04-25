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
          card: foundUser.cards[0],
          currentUser: req.session.userDbId,
          verifyUser: foundUser._id.toString()
          
        })
  
    } catch(err){
      res.send(err);
    }
  
  });


// EDIT
router.get("/:id/edit", async (req,res)=>{
    try {
        const foundUser = await User.findOne({'cards': req.params.id})
        .populate({path: 'cards', match: {_id: req.params.id}});
        
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
            res.redirect("/cards");  
        }
    } catch(err){
        res.send(err);
    }
})

router.put("/:id", logUser, async (req,res)=>{
    try {
        await Card.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.redirect("/cards/" + req.params.id);
        
    } catch(err) {
        res.send(err)
    }
})

// DELETE
router.delete("/:id", logUser, async (req,res)=>{
    try {
        const deleteCard = Card.findByIdAndDelete(req.params.id);
        const findUser = User.findOne({"cards": req.params.id});

        const [deletedCard, foundUser] = await Promise.all([deleteCard,findUser]);
        foundUser.cards.remove(req.params.id);
        await foundUser.save();

        console.log(deletedCard);
        res.redirect("/cards")


    } catch(err) {
        res.send(err)
    }
})


module.exports = router;