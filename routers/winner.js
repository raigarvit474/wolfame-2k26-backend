const express = require('express');
const router = new express.Router();
const Winner = require("../models/Winner");
require('dotenv').config();

const Leaderboard = require("../models/Leaderboard");
const Team = require("../models/Team");

// POST (create) a new winner
router.post('/', async (req, res) => {
    try {
        const winner = new Winner(req.body); // Create a new winner with the provided data
        await winner.save(); // Save the winner to the database

        // Update Leaderboard points - REMOVED for manual team points system
        /*
        const team = await Team.findById(winner.team);
        if (team && winner.points) {
            await Leaderboard.findOneAndUpdate(
                { residence: team.residence },
                { $inc: { points: winner.points } },
                { upsert: true }
            );
        }
        */

        res.send(winner); // Send the created winner as the response
    } catch (e) {
        console.error(e)
        res.status(500).send(); // Handle errors
    }
});

// GET all winners (derived from Team points)
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.event) {
            query.event = req.query.event;
        }

        // Fetch teams filtered by event and sorted by points descending
        const teams = await Team.find(query).sort({ points: -1 });

        // Map to expected format
        const winners = teams.map((team, index) => ({
            team: team,
            rank: index + 1,
            points: team.points,
            event: team.event,
            // category will be derived on frontend based on residence
        }));

        res.send(winners);
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
});

// DELETE a specific winner by ID
router.delete('/:id', async (req, res) => {
    try {
        const winner = await Winner.findById(req.params.id).populate('team');
        if (!winner) {
            return res.status(404).send();
        }

        // Revert Leaderboard points - REMOVED for manual team points system
        /*
        if (winner.team && winner.points) {
            await Leaderboard.findOneAndUpdate(
                { residence: winner.team.residence },
                { $inc: { points: -winner.points } }
            );
        }
        */

        await Winner.deleteOne({ _id: req.params.id }); // Delete the winner with the specified ID
        res.send(); // Send a success response
    } catch (e) {
        console.error(e);
        res.status(500).send(); // Handle errors
    }
});

module.exports = router;