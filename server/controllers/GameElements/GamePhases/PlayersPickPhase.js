module.exports = class PlayersPickPhase {

    constructor(ref) {
        this.context = ref;
        this.id = "playersPick";
    }

    next(reason) {
        if(!this.context) return;
        console.log(`${ reason ?? "" } - Players pick phase ended!`);
        this.context.setState("czarPicks");
    }

    startUp() {
        if(!this.context) return;

        this.context.joinSpectators();
        this.context.deck.drawQuestion();
        this.context.cntAnswers = 0;
        this.context.winner = null;

        for(let player of (this.context.playerList ?? [])) {
            if(!player) continue;
            this.context.deck.draw(player);
            player.setUpForNewRound(); // is Czar = false, status = "choosing"
            console.log(`Drew cards for player ${player.name}`);
            player.socket.emit("players-pick-phase", { question: this.context.deck.currentQuestion, hand: player.hand });
        }

        const czar = this.context.nextCzar();
        console.log(`Czar set to ${czar.name}, ${this.context.czar}`);
        czar.socket.emit("set-czar", { content: "You are the czar" });

        this.context.startPhaseTimer();
    }

    do() { return; }
}