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
        this.context.startOrKeepPhaseTimer();
    }

    do() { return; }
}