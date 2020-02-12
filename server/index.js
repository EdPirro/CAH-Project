const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const router = require("./routes");
const crypto = require("crypto");
app.use(router);
app.use(express.json())

const cors = require("cors"); // dev only
app.use(cors());

const GameManager = require('./util/GameManager');

function generateRandomNamespace() {
    return crypto.randomBytes(20).toString("hex");
}

let slotsNum = 100;
const freeSlots = [];
const games = [];
const removeGame = (slot) => {
    freeSlots.push(slot);
    games[slot] = null;
}

app.post('/game', (req, res) => {
    let slot = null;
    if(freeSlots.length) slot = freeSlots.shift();
    else if(games.length < slotsNum ) slot = games.length;
    else return res.status(400).send(`No room avaliable for creation`);
    const namespace = generateRandomNamespace();

    /* dev */
    const cards = require("./util/tempCards");
    games[slot] = new GameManager(
                                    req.body.name, 
                                    slot, 
                                    namespace, 
                                    io.of(`${namespace}`), 
                                    removeGame, 
                                    cards
                                );
    console.log("created game", games[slot].name);
    res.send({slot});
});

app.get('/game', (req, res) => {
    if(games[req.query.pos])
        res.send({namespace: games[req.query.pos].namespace})
    else res.status(400).send("Invalid pos");
    console.log(games[req.query.pos].namespace);
})

server.listen(8000);