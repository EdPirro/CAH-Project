const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const routes = require("./routes");
const crypto = require("crypto");
app.use(routes);
app.use(express.json())

const cors = require("cors"); // dev only
app.use(cors());

/*  These will be moved to controllers/GameController.js and required by the router
    the post and get methods will be defined in GameController.js and used by routes.js
    index.js will simply app.use(routes) and everithing shall work fine
    (theseStuff -> GameController)
    (GameManager -> Game ?)
*/
const GameManager = require('./util/GameManager'); 

const manageNamespace = {} // will keep the count os namespaces with the same base name;

/**
 * simply return a random string to be used as a namespace
 */
function generateRandomNamespace() {
    const ns = crypto.randomBytes(10).toString("hex"); // repetition is improbable

    // the following lines make namespaces with the same name not only improbable but actually impossible,
    // unless the count for a namespace base name surpass the number that can be held in a let,
    // but the server would've, most probably, already died before this happens.
    if(manageNamespace[ns] !== undefined) ns += manageNamespace[ns]++;
    else manageNamespace[ns] = 0;
    return ns;
}

// let slotsNum = 10000; A maximum number of games can be set if wanted (would limit server load)

const freeSlots = []; // slots that were used and freed
const games = []; // holds the on-goin games (may have null elements but those will be referenced by freeSlots)

/**
 * removes a game from a slot setting it to null and pushing it into freeSlots
 * O(1), and that's why freeSlots exists.
 * @param {number} slot 
 */
const removeGame = (slot) => {
    freeSlots.push(slot);
    games[slot] = null;
}

/**
 * Creates a GameManager instance in a random namespace setting it to the least recently freed slot
 * or into a new gameslot if no slots were freed by the time.
 */
app.post('/game', (req, res) => {
    let slot = null;
    if(freeSlots.length) slot = freeSlots.shift();

    // if no maximum game number was set
    else slot = games.length;

    // uncomment if a maximum game numbers was set
    // else if(games.length < slotsNum ) slot = games.length;
    // else return res.status(400).send(`No room avaliable for creation`);

    const namespace = generateRandomNamespace();

    /* dev */
    const cards = require("./util/tempCards");
    /* dev end */

    games[slot] = new GameManager(
                                    req.body.name, 
                                    slot, 
                                    namespace, 
                                    io.of(`${namespace}`), 
                                    removeGame, 
                                    cards
                                );

    console.log("created game", games[slot].name);

    res.send({slot}); // returns the created game slot i. e. tha position in games vector.
});

/**
 * Joins the game especified in req.query.pos,
 * that is returns the games[req.query.pos]'s namespace allowing the client to access it
 */
app.get('/game', (req, res) => {
    if(games[req.query.pos])
        res.send({namespace: games[req.query.pos].namespace})
    else res.status(400).send("Invalid pos");
    console.log(games[req.query.pos].namespace);
})

/* Things to be moved are above this line*/

server.listen(8000);