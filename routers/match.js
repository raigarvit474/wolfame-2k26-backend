const express = require('express');
const router = new express.Router();
const Match = require("../models/Match");
require('dotenv').config();

// GET all matches with optional filtering by residence and player
router.get('/', async (req, res) => {
    try {
        const query = { ...req.query, residence: null, player: null };
        let matches = await Match.find(query).sort({ time: 'ascending' }).populate({ path: 'teams', populate: { path: 'players' } });

        // Filter matches by residence if provided in the query
        if (req.query.residence) {
            matches = matches.filter(({ teams }) => teams.some(({ residence }) => residence === req.query.residence));
        }

        // Filter matches by player if provided in the query
        if (req.query.player) {
            matches = matches.filter(({ teams }) => teams.some(({ players }) => players.some(({ _id }) => _id == req.query.player)));
        }

        res.send(matches);
    } catch (e) {
        res.status(500).send();
    }
});

// GET a specific match by ID
router.get('/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate({ path: 'teams', populate: { path: 'players' } });
        res.send(match);
    } catch (e) {
        res.status(500).send();
    }
});

const auth = require('../middleware/auth');
const Leaderboard = require('../models/Leaderboard');
const Team = require('../models/Team');

// ... existing GET routes (lines 6-36) ...

// PATCH (update) a specific match by ID
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Only admins can update matches.' });
        }

        const oldMatch = await Match.findById(req.params.id);
        const match = await Match.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        // Logic to update leaderboard if winner changes - REMOVED for manual team points system
        // if (req.body.winner && req.body.winner !== oldMatch.winner?.toString()) { ... }

        res.send(match);
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});

// POST (create) a new match
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Only admins can create matches.' });
        }
        const match = new Match({ ...req.body, createdBy: req.user._id });
        await match.save();
        res.status(201).send(match);
    } catch (e) {
        res.status(500).send();
    }
});

// DELETE a specific match by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ error: 'Only admins can delete matches.' });
        }

        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).send();
        }

        // Revert leaderboard points if match had a winner - REMOVED for manual team points system
        // if (match.winner) { ... }

        await Match.deleteOne({ _id: req.params.id });
        res.send();
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});

module.exports = router;