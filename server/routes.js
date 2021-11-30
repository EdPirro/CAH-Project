const router = require("express").Router();
const GameController = require("./controllers/GameController");

router.get("/game", GameController.index);
router.post("/game", GameController.create);
router.get("/game-list", GameController.list);

module.exports = router;