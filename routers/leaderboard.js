const express = require('express');
const router = new express.Router();
const Leaderboard = require("../models/Leaderboard");
const auth = require('../middleware/auth');

// GET all leaderboard entries
router.get('/', async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find({}).sort({ points: -1 });
        res.send(leaderboard);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
