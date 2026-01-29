const mongoose = require("mongoose")
require('dotenv').config();

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    residence: {
        type: String,
        trim: true,
        required: true,
    },
    event: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    points: {
        type: Number,
        default: 0
    }
})

const Team = mongoose.model('Team', teamSchema)

module.exports = Team