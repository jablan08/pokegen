const express = require('express');
const router  = express.Router();
const Card = require('../models/cards');
const User = require('../models/users');

const logUser = (req, res, next) => {
    if(req.session.logged) {
        
        next()
    } else {
        req.session.verifyMessage = 'Please login or register to continue.'
        req.session.invalidMessage = '';
        res.redirect('/auth/login');
    }
}

  
// INDEX
router.get('/', async (req,res)=> {
    try {
        const allCards = await Card.find({});
        const findUser = await User.findById(req.session.userDbId);
        res.render('cards/index.ejs', {
            cards: allCards,
            logged: req.session.logged,
            user: findUser,
        });
    } catch(err) {
        res.send(err) 
    }
})

// NEW
router.get('/new', logUser, async (req,res)=>{
    try {
        const findUser = await User.findById(req.session.userDbId);
        req.session.startMessage = 'Create your first card!'
        res.render('cards/new.ejs', {
        user: findUser,
        newMessage: req.session.startMessage,
        logged: req.session.logged
        })
    } catch(err){
        res.send(err)
    }
})

router.post('/', logUser, async (req,res)=>{
    
    try {
        await Card.create(req.body, (err,createdCard)=>{
            User.findById(req.session.userDbId, (err,foundUser)=>{
                foundUser.cards.push(createdCard);
                foundUser.save()
                res.redirect(`/cards/${createdCard.id}`)
            })
        })
    } catch(err) {
        res.send(err)
    }
})       

// SHOW
router.get('/:id', async (req, res)=>{

    try {
        const foundUser = await User.findOne({'cards': req.params.id}).populate({path: 'cards', match: {_id: req.params.id}})
        const findAdmin = await User.findById(req.session.userDbId);
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
router.get('/:id/edit', logUser, async (req,res)=>{
    try {
        const foundUser = await User.findOne({'cards': req.params.id})
        .populate({path: 'cards', match: {_id: req.params.id}});
        
        if (req.session.userDbId === foundUser._id.toString()) {
            res.render('cards/edit.ejs', {
                card: foundUser.cards[0],
                user: foundUser,
                logged: req.session.logged
            });
        } else {
            res.redirect('/auth/login');  
        }
    } catch(err){
        res.send(err);
    }
})

router.put('/:id', logUser, async (req,res)=>{
    try {
        if (req.body.favorite === 'on') {
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
router.delete('/:id', logUser, async (req,res)=>{
    try {
        const deleteCard = Card.findByIdAndDelete(req.params.id);
        const findUser = User.findOne({'cards': req.params.id});
        const [deletedCard, foundUser] = await Promise.all([deleteCard,findUser]);
        if (foundUser.cards.favorite === true) {
            foundUser.favorites.remove(req.params.id);
        }
        foundUser.cards.remove(req.params.id);
        await foundUser.save();
        res.redirect(`/users/${req.session.userDbId}`)
    } catch(err) {
        res.send(err)
    }
})

module.exports = router;