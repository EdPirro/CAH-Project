const express = require("express");
const cors = require("cors"); // dev only
const app = express();
const server = require("http").createServer(app);
const { initializeIO } = require("./util/utils");
const path = require("path");
initializeIO(server);

app.use(express.json())
app.use(cors());

const routes = require("./routes");
app.use("/api", routes);

console.log(path.join(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "./views")));

app.use("*", (_, res) => {
    res.sendFile(path.join(__dirname, "./views/index.html"))
})


server.listen(process.env.PORT || 8000);