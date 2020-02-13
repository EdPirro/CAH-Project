module.exports = class GameManager {

    /* 
    Game Phases:
        "setup"
        "playersAnswer"
        "czarPick"
        "awardPoints"
    */

    handSize = 10;

    constructor(name, slot, namespace, io, removeGame, cards) {
        this.name = name;
        this.slot = slot;
        this.namespace = namespace
        this.io = io;
        this.removeGame = removeGame;
        this.cards = cards
        this.cardCount = [0, 0];
        this.shuffle();
        this.playerList = [];
        this.czar = 0;
        this.freePos = [];
        this.inGame = false;
        this.spectating = [];
        this.gamePhase = "setup";
        this.submittedAnswers = [];
        this.setupIO();
    }

    shuffle(which) {
        if(which !== "answers") {
            const cardNum = this.cards[0].length;
            for(let i = 0; i < cardNum; i++) {
                const pos = Math.floor(Math.random() * (cardNum - i)) + i;
                const temp = this.cards[0][pos];
                this.cards[0][pos] = this.cards[0][i];
                this.cards[0][i] = temp;
                this.cardCount[0] = 0;
            }
        }
        if(which !== "questions") {
            const cardNum = this.cards[1].length;
            for(let i = 0; i < cardNum; i++) {
                const pos = Math.floor(Math.random() * (cardNum - i)) + i;
                const temp = this.cards[1][pos];
                this.cards[1][pos] = this.cards[1][i];
                this.cards[1][i] = temp;
                this.cardCount[1] = 0;
            }
        }
    }

    draw(hand, amount) {
        if(!amount) amount = 1;
        while(amount--){
            hand.push(this.cards[1][this.cardCount[1]++]);
        }
    }

    getPos() {
        if(this.freePos.length) return this.freePos.shift();
        return this.playerList.length;
    }

    countPlayers() {
        return this.playerList.length - this.freePos.length;
    }

    setupListeners(socket, pos) {
        // handling disconnection -> remove from playerList
        socket.on("disconnect", () => {
            this.freePos.push(pos);
            this.playerList[pos] = null;
            console.log(`${pos} disconnected`);
            if(this.countPlayers() < 4) {
                this.inGame = false;
                // emit waiting again (no progres lost tho)
                // spectating -> playerList and beginRound ()
            }
        });

        socket.on("send-answer", msg => {
            const sAPos = this.submittedAnswers.push({answer: msg.setAns, who: pos});
            this.playerList[pos].status = "ready";
            this.playerList[pos].sAPos = sAPos - 1;
            this.io.to(`${this.playerList[this.czar].socket.id}`).emit("set-sub-ans", {subAns: this.submittedAnswers});
        });

        socket.on("remove-answer", () => {
            if(this.playerList[pos].sAPos !== null) {
                this.submittedAnswers.splice(this.playerList[pos].sAPos, 1);
                this.playerList[pos].sAPos = null;
                this.io.to(`${this.playerList[this.czar].socket.id}`).emit("set-sub-ans", {subAns: this.submittedAnswers});
            }
        })
    }

    async beginRound() {
        this.gamePhase = "playersAnswer";
        const question = this.cards[0][this.cardCount[0]++];
        for(const player of this.playerList) {
            const dif = this.handSize - player.hand;
            if(dif) {
                this.draw(player.hand, dif);
            }
            player.socket.emit("new-round", {question, hand: player.hand});
        }
        while(this.countPlayers() >= 4 && !this.playerList[this.czar]) this.cazar = (this.czar + 1) % this.playerList.length;
        this.io.to(`${this.playerList[this.czar].socket.id}`).emit("set-czar", {content: "You are the czar"});
    }

    setupIO() {

        this.io.on("connect", socket => {
            if(!this.inGame) {
                const pos = this.getPos();
                this.playerList[pos] = {socket, hand: [], points: 0, status: "waiting"};

                this.setupListeners(socket, pos);

                if(this.countPlayers() >= 4) {
                    this.io.emit("new-player", {waitingFor: 0});
                    this.inGame = true;
                    this.beginRound();
                }
                else this.io.emit("new-player", {waitingFor: 4 - this.countPlayers()});
            } else {
                this.spectating.push({socket});
                socket.emit("spectating", { question: (this.cards[0][this.cardCount[0] - 1]) });
            }
        });

    }
}