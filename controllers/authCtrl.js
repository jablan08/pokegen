const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs")


router.get("/login", (req,res)=>{ 
    res.render("main/auth.ejs", {
        message: req.session.message
    })
})

router.post("/register", async (req,res)=>{

    try {
        const createdUser = await User.create(req.body);
        console.log(createdUser)
        req.session.logged = true;
        req.session.userDbId = createdUser._id;
        console.log(req.session)
        res.redirect('/cards/new');

    } catch(err) {
        res.send(err)
    }
})

router.post("/login", async (req,res)=>{
    try {
        const foundUser = await User.findOne({"username": req.body.username});
        if (foundUser) {
            if (foundUser.validPassword(req.body.password)) {
                req.session.logged = true;
                req.session.userDbId = foundUser._id;
                req.session.message = "success!"
                console.log(req.session, "login success!");
                res.redirect('/home');
            } else {
                req.session.message = "Username or password is incorrect";
                
                res.redirect("/auth/login");
            }
        } else {
            req.session.message = 'Username or password is incorrect';
            console.log("boop")

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
     
        console.log("loggedout")  
        res.redirect('/auth/login');
        

      }
    })
})
module.exports = router;