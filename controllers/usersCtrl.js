const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const Card = require("../models/cards");
const bcrypt = require("bcryptjs");
 

const logUser = (req, res, next) => {
    if(req.session.logged) {
        next()
    } else {
        res.redirect("/auth/login");
    }
}

// INDEX
router.get('/', async (req, res) => {
    console.log(req.session, "this user is")
    try {
        const foundUsers = await User.find();
        res.render('users/index.ejs', {
            users: foundUsers
        })
    } catch (err) {
        res.send(err)
    }
})


// SHOW
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id)
        .populate('cards');
        const findAdmin = await User.findById(req.session.userDbId);

        console.log(findAdmin, "found admin")
        console.log(foundUser)
        res.render('users/show.ejs',{
            user: foundUser,
            currentUser: req.session.userDbId,
            verifyUser: foundUser._id.toString(),
            admin: findAdmin
        })    
    } catch (err) {
        res.send(err)
    }
})


// EDIT
router.get('/:id/edit', logUser, async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id)
        res.render('users/edit.ejs',{
            user: foundUser
        })
    } catch (error) {   
    }
})

router.put('/:id', logUser,(req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    try {
        User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedUser)=>{
            if(err){
                console.log(err)
            }else{console.log(updatedUser)
                res.redirect('/users/' + req.params.id)}
            
        })
    } catch (err) {    
    }
})

// DELETE

router.delete('/:id',logUser, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, deletedUser) =>{
        if(err){
            res.send(err)
        } else {
            console.log(deletedUser, "<------ deleted user");
            Card.deleteMany({
                _id: {
                    $in: deletedUser.cards
                }
            },(err, data) =>{
                console.log(data)
                res.redirect('/users')
            }
            )
        }
    })


})

module.exports = router;