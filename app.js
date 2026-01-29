require('dotenv').config()
require("./db/mongoose")
const express = require("express")
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');

const userRouter = require("./routers/user")
const teamRouter = require("./routers/team")
const matchRouter = require("./routers/match")
const winnerRouter = require("./routers/winner")
const leaderboardRouter = require("./routers/leaderboard")

const port = process.env.PORT || 8001
const app = express()

// Security and Performance middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for now to avoid issues with inline scripts/images if any, can be tightened later
}));
app.use(compression());

app.use(cors())
app.use(express.json())
app.use('/user', userRouter)
app.use('/team', teamRouter)
app.use('/match', matchRouter)
app.use('/winner', winnerRouter)
app.use('/leaderboard', leaderboardRouter)

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Anything that doesn't match the above routes, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})