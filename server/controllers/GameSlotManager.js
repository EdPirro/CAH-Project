module.exports = class GameSlotManager {

    constructor (_mg) {
        this.maxGames = _mg ?? 100;
        this.cntGames = 0;
        this.games = {};
    }

    listGames() {
        return Object.keys(this.games).map(el => this.games[el].meta);
    }

    getByName(name) {
        return name ? this.games[name]?.meta : false;
    }

    addGame(game) {

        if(this.cntGames >= this.maxGames) return { error: true, msg: "Maximum capacity reached" };
        if(this.getByName(game.name)) return { error: true, msg: "Name already taken, try something more creative..." };

        this.games[game.name] = game;
        ++this.cntGames;
        return { error: false, gameMeta: game.meta };
    }

    removeByName(name) {
        if(this.getByName(name)) {
            delete this.games[name];
            --this.cntGames;
        }
    }

}