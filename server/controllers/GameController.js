const GameManager = require("./GameManager");
const GSM = require("./GameSlotManager");
const GameSlotManager = new GSM();

module.exports = {

    create(req, res) {
        const gameRules = {};
        
        for(let i of GameManager.customizableRules)
            gameRules[i] = req.body[i];

        if(GameSlotManager.getByName(gameRules.name)) return res.status(400).send("Name already taken, try something more creative...")
            
        const ng = new GameManager(gameRules, () => GameSlotManager.removeByName(gameRules.name));
        const added = GameSlotManager.addGame(ng);

        if(added.error) return res.status(400).send(added.msg);

        console.log("created game", added.gameMeta);
        return res.send(added.gameMeta);
    },

    index(req, res) {

        const name = req.params.name ?? "Game";
        const gameMeta = GameSlotManager.getByName(name);

        if(!gameMeta) return res.status(400).send("Found no game with given name.");
        return res.send(gameMeta);
    },

    list(_, res) {
        // TODO: Search
        const gameList = GameSlotManager.listGames();
        return res.send(gameList);
    }

}