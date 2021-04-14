const express = require('express');

const router = express();

router.get('/', (req, res) => {
    res.render('home', { currentUser: req.session.currentUser });
});

module.exports = router;