const express = require('express');
const router = new express.Router();
const Team = require("../models/Team");
const auth = require('../middleware/auth');
const Leaderboard = require("../models/Leaderboard");
require('dotenv').config();

// GET all teams with optional query parameters for filtering
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find(req.query || {}).sort({ residence: 'ascending' });
        res.send(teams);
    } catch (e) {
        res.status(500).send();
    }
});

// GET a specific team by ID
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        await team.populate('players'); // Populate the players field
        res.send(team);
    } catch (e) {
        res.status(500).send();
    }
});

// POST (create) a new team
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Only admins can create teams.' });
        }
        const team = new Team({ ...req.body, createdBy: req.user._id });
        await team.save();
        res.status(201).send(team);
    } catch (e) {
        res.status(500).send(e);
    }
});

// PATCH (update) a specific team by ID
// PATCH (update) a specific team by ID
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Only admins can update teams.' });
        }
        const team = await Team.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        // Sync Leaderboard Points for the residence
        if (team && team.residence) {
            const residenceTeams = await Team.find({ residence: team.residence });
            const totalPoints = residenceTeams.reduce((sum, t) => sum + (t.points || 0), 0);

            const Leaderboard = require("../models/Leaderboard");
            await Leaderboard.findOneAndUpdate(
                { residence: team.residence },
                { points: totalPoints },
                { upsert: true }
            );
        }

        res.send(team);
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});

// DELETE a specific team by ID
// DELETE a specific team by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Only admins can delete teams.' });
        }
        await Team.deleteOne({ _id: req.params.id });
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;