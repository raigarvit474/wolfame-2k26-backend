const mongoose = require("mongoose")
require('dotenv').config();

const matchSchema = new mongoose.Schema({
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
    ],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    summary: {
        type: String,
        default: '',
    },
    event: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    matchType: {
        type: String,
        enum: ['League Stage', 'Knockout', 'Semi Final', 'Final'],
        default: 'League Stage',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Match = mongoose.model('Match', matchSchema)

module.exports = Match