module.exports = class AwardPointsPhase {

    constructor(ref) {
        this.context = ref;
        this.id = "awardPoints";
    }

    next() {
        if(!this.context) return;
        console.log("Award points phase ended!")
        this.context.setState("playersPick");
    }

    startUp() {
        if(!this.context) return;

        if((this.context.winner ?? null) === null) 
            this.context.io.emit("game-over", { error: true, message: `Yeah, this czar sucks and couldn't click fast enough... Everybody loses thanks to ${this.context.czarPlayer.name}.` });
        else if(this.context.winner === "disconnected")
            this.context.io.emit("game-over", { error: true, message: "Well, that sucks... The winner disconnected mid game. C'mon guys let's try again." });
        else if(this.context.winner === -1)
                this.context.io.emit("game-over", { error: true, message: `Well that's embarassing, it seems like I messed up for once... Could you please keep playing? And maybe report this issue.` });
        else {
            const winner = this.context.playerList[this.context.winner];
            const winnerMessage = `You won!!! good job.`;
            const loserMessage = `${winner.name} won. But you didn't, better luck next time.`;
            for(let i = 0; i < this.context.playerList.length; i++) {
                const curPlayer = this.context.playerList[i];
                if(!curPlayer) continue;
                const won = i === this.context.winner;
                if(won) curPlayer.points += this.context.pointsPerWin;
                curPlayer.socket.emit("game-over", { error: false, won, message: won ? winnerMessage : loserMessage, winner: winner.name, points: curPlayer.points });
            }
        }
        this.context.startPhaseTimer(10);
    }

    do() { return; }
}