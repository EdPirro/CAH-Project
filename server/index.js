const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const router = require("./routes");
app.use(router);
app.use(express.json())

const cors = require("cors"); // dev only
app.use(cors());

const GameManager = require('./util/GameManager');
let namespaceNum = 100;
const freeNamespaces = [];
const games = [];
const removeGame = (namespace) => {
    freeNamespaces.push(namespace);
    games[namespace] = null;
}

app.get('/new-game', (req, res) => {
    let namespace = null;
    if(freeNamespaces.length) namespace = freeNamespaces.shift();
    else if(games.length < namespaceNum ) namespace = games.length;
    else return res.status(400).send(`No room avaliable for creation`);
    games[namespace] = new GameManager(namespace, io.of(`${namespace}`), removeGame);
    res.send({namespace});
});

server.listen(8000);