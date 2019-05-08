const express = require('express');
const router  = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs')


router.get('/login', async (req,res)=>{
    const findUser = await User.findById(req.session.userDbId); 
    res.render('main/auth.ejs', {
        verifyMessage: req.session.verifyMessage,
        logged: req.session.logged,
        user: findUser,
        invalidMessage: req.session.invalidMessage,
        userTakenMessage: req.session.userTaken

    })
})

router.post('/register', async (req,res)=>{

    try {
        const createdUser = await User.create(req.body);
        req.session.logged = true;
        req.session.userDbId = createdUser._id;
        req.session.startMessage = 'Create your first card!';
        res.redirect('/cards/new');
    } catch(err) {
        req.session.userTaken = 'Username has been taken.';
        req.session.invalidMessage = '';
        res.redirect('/auth/login')
    }
})

router.post('/login', async (req,res)=>{
    try {
        const foundUser = await User.findOne({'username': req.body.username});
        if (foundUser) {
            if (foundUser.validPassword(req.body.password)) {
                req.session.logged = true;
                req.session.userDbId = foundUser._id;
                res.redirect('/');
            } else {
                req.session.invalidMessage = 'Username or password is incorrect';
                req.session.verifyMessage = '';
                res.redirect('/auth/login');
            }
        } else {
            req.session.invalidMessage = 'Username or password is incorrect';
            req.session.verifyMessage = '';
            res.redirect('/auth/login');
        }
    } catch(err){
        res.send(err);
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if(err){
        res.send(err);
      } else {
        res.redirect('/');
      }
    })
})
module.exports = router;