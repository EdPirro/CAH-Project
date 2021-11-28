module.exports = class CzarPicksPhase {
    
    constructor(ref) {
        this.context = ref;
        this.id = "czarPicks";
    }

    next() {
        if(!this.context) return;
        console.log("Czar picks phase ended!");
        this.context.setState("awardPoints");
    }

    startUp() {
        if(!this.context) return;
        this.context.io.emit("czar-picks-phase");
        const czarPlayer = this.context.playerList[this.context.czar];
        const playersAnswers = this.context.getPlayersAnswers();
        console.log("Czar picks phase started, players answers are: ", playersAnswers);
        czarPlayer.socket.emit("players-answers", playersAnswers);
        this.context.startPhaseTimer();
    }

    do() { return; }
}