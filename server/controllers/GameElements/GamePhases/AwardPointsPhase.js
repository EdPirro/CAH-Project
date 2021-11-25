module.exports = class AwardPointsPhase {

    constructor(ref) {
        this.context = ref;
        this.id = "awardPoints";
    }

    next() {
        if(!this.context) return;
        this.context.setState("playersPick");
    }

    startUp() {
        if(!this.context) return;
        console.log("award points phase");
    }

    do() { return; }
}