module.exports = class PlayersPickPhase {

    constructor(ref) {
        this.context = ref;
        this.id = "playersPick";
    }

    next() {
        if(!this.context) return;
        this.context.setState("czarPicks");
    }

    startUp() {
        if(!this.context) return;
        this.context.joinSpectators();
        this.context.deck.drawQuestion();
        for(let player of (this.context.playerList ?? [])) {
            this.context.deck.draw(player);
            player.setUpForNewRound(); // is Czar = false
            player.socket.emit("players-pick-phase", { question: this.context.deck.currentQuestion, hand: player.hand });
        }

        const czar = this.context.nextCzar();
        czar.isCzar = true;
        czar.socket.emit("set-czar", { content: "You are the czar" });

        this.context.startOrRestartPhaseTimer();
    }

    do() { return; }
}