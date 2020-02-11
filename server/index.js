const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

let socketNum = 0;


app.get("/new-game", (req, res) => res.send({socket: `${socketNum++}`}));

app.listen(8000);