module.exports = class PlayersPickPhase {

    constructor(ref) {
        this.context = ref;
        this.id = "playersPick";
    }

    next() {
        if(!this.context) return;
        console.log("Players pick phase ended!");
        this.context.setState("czarPicks");
    }

    startUp() {
        if(!this.context) return;

        this.context.joinSpectators();
        this.context.deck.drawQuestion();

        for(let player of (this.context.playerList ?? [])) {
            if(!player) continue;
            this.context.deck.draw(player);
            player.setUpForNewRound(); // is Czar = false
            console.log(`Drew cards for player ${player.name}, new hand: ${player.hand.map(el => el.card.content).join(" | ")}`);
            player.socket.emit("players-pick-phase", { question: this.context.deck.currentQuestion, hand: player.hand });
        }

        const czar = this.context.nextCzar();
        czar.isCzar = true;
        console.log(`Czar set to ${czar.name}`);
        czar.socket.emit("set-czar", { content: "You are the czar" });

        this.context.startOrRestartPhaseTimer();
    }

    do() { return; }
}