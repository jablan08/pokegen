const express = require('express');
const router  = express.Router();
const Card = require("../models/cards");
const User = require("../models/users");

const logUser = (req, res, next) => {
    if(req.session.logged) {
        
        next()
    } else {
        req.session.verifyMessage = "Please login or register to make a card."
        req.session.invalidMessage = "";
        res.redirect("/auth/login");
    }
}

  
// INDEX
router.get("/", async (req,res)=> {
    try {
        const allCards = await Card.find({});
        res.render("cards/index.ejs", {
            cards: allCards,
            logged: req.session.logged
        });
    } catch(err) {
        res.send(err) 
    }
})

// NEW
router.get("/new", logUser, async (req,res)=>{
    try {
        const findUser = await User.findById(req.session.userDbId);
        console.log(findUser.cards.length, "=========")
        console.log(req.session)
        req.session.startMessage = "Create your first card!"
        res.render("cards/new.ejs", {
        user: findUser,
        newMessage: req.session.startMessage,
        logged: req.session.logged
            
        })
        
    } catch(err){
        res.send(err)
    }
})

router.post("/", logUser, async (req,res)=>{
    
    try {
        await Card.create(req.body, (err,createdCard)=>{
            console.log(createdCard)
            User.findById(req.session.userDbId, (err,foundUser)=>{
                // push to user.favorites
                foundUser.cards.push(createdCard);
                foundUser.save((err,savedUser)=>{
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(savedUser)
                        res.redirect("/users/" + req.session.userDbId)


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
        const findAdmin = await User.findById(req.session.userDbId);
        
        console.log(findAdmin, "found admin")
        console.log(foundUser, "<---- foundUser in card's show route");
        console.log(req.session.logged, "============logged")
        res.render('cards/show.ejs', {
          user: foundUser,
          card: foundUser.cards[0],
          currentUser: req.session.userDbId,
          verifyUser: foundUser._id.toString(),
          admin: findAdmin,
          logged: req.session.logged 
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
                user: foundUser,
                logged: req.session.logged
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
        if (req.body.favorite === "on") {
            req.body.favorite = true;
        } else {
            req.body.favorite = false;
        }
        const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.redirect(`/cards/${req.params.id}/edit`);
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
        if (foundUser.cards.favorite === true) {
            foundUser.favorites.remove(req.params.id);
        }
        foundUser.cards.remove(req.params.id);
        
        await foundUser.save();

        console.log(deletedCard);
        res.redirect("/cards")


    } catch(err) {
        res.send(err)
    }
})


module.exports = router;