const express = require('express');
const router = express.Router();
const User = ('../models/users');
const Card = ('../models/cards');

router.get('/', (req, res) => {
    res.render('/main/home.ejs')
})


module.exports = router;