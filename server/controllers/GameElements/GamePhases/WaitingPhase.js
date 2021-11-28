module.exports = class WaitingPhase {

    constructor(ref) {
        this.context = ref;
        this.id = "waiting";
    }

    next() {
        if(!this.context) return;
        console.log("Waiting phase ended!");
        this.context.setState("playersPick");
    }

    startUp() {
        if(!this.context) return;
        this.context.stopPhaseTimer();
        this.do();
    }

    do() {
        if(!this.context) return;
        this.context.io.emit("waiting", { for: 4 - this.context.countPlayers() });
    }
}