const express = require("express");
const cors = require("cors"); // dev only
const app = express();
const server = require("http").createServer(app);
const { initializeIO } = require("./util/utils");
initializeIO(server);

app.use(express.json())
app.use(cors());

const routes = require("./routes");
app.use("/api", routes);


server.listen(8000);