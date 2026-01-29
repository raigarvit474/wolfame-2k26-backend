const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    residence: {
        type: String,
        required: true,
        unique: true,
    },
    points: {
        type: Number,
        default: 0,
    },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
