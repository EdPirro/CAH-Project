module.exports = class CzarPicksPhase {
    
    constructor(ref) {
        this.context = ref;
        this.id = "czarPicks";
    }

    next() {
        if(!this.context) return;
        this.context.setState("awardPoints");
    }

    startUp() {
        if(!this.context) return;
        console.log("czar picks phase");
        this.context.io.emit("czar-picks-phase");
        const czarPlayer = this.context.playerList[this.context.czar];
        czarPlayer.socket.emit("players-answers", this.context.getPlayersAnswers());
    }

    do() { return; }
}