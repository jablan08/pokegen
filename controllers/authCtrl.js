const express = require('express');
const router  = express.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs")


router.get("/login", (req,res)=>{ 
    res.render("main/auth.ejs")
})

module.exports = router;