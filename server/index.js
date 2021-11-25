const express = require("express");
const cors = require("cors"); // dev only
const app = express();
const server = require("http").createServer(app);
const { initializeIO } = require("./util/utils");
initializeIO(server);

// const routes = require("./routes");
// app.use(routes);

const GameController = require("./controllers/GameController");

app.use(express.json())
app.use(cors());


app.post('/game', GameController.create);
app.get('/game', GameController.index);


server.listen(8000);