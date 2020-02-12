module.exports = class GameManager {

    handSize = 10;

    constructor(name, slot, namespace, io, removeGame, cards) {
        this.name = name;
        this.slot = slot;
        this.namespace = namespace
        this.io = io;
        this.removeGame = removeGame;
        this.cards = cards
        this.usedCards = [[], []];
        this.shuffle();
        this.playerList = [];
        this.czar = 0;
        this.freePos = [];
        this.setupIO();
    }

    shuffle(which) {
        if(which !== "answers") {
            const aux = [];
            const cardCount = this.cards[0].length;
            for(let i = 0; i < cardCount; i++) {
                const pos = Math.floor(Math.random() * this.cards[0].length);
                aux.push(this.cards[0][pos]);
                this.cards[0].splice(pos, 1);
            }
            this.cards[0] = aux;
        }
        if(which !== "questions") {
            const aux = [];
            const cardCount = this.cards[1].length;
            for(let i = 1; i < cardCount; i++) {
                const pos = Math.floor(Math.random() * this.cards[1].length);
                aux.push(this.cards[1][pos]);
                this.cards[1].splice(pos, 1);
            }
            this.cards[1] = aux;
        }
    }

    draw(hand, amount) {
        if(!amount) amount = 1;
        while(amount--){
            hand.push(this.cards[1].shift());
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
            this.usedCards[1] += this.playerList[pos].hand;
            this.playerList[pos] = null;
            console.log(`${pos} disconnected`);
        });
    }

    async beginRound() {
        const question = this.cards[0].shift();
        console.log(question);
        for(const player of this.playerList) {
            const dif = this.handSize - player.hand;
            if(dif) {
                this.draw(player.hand, dif);
            }
            console.log(player.hand[0]);
            player.socket.emit("new-round", {question, hand: player.hand});
        }
        this.io.to(`${this.playerList[this.czar].socket.id}`).emit('czar', {content: "You are the czar"});

        this.io.emit("round-ready", {content: "Get to it!"});
    }

    setupIO() {

        this.io.on("connect", socket => {
            const pos = this.getPos();
            this.playerList[pos] = {socket, hand: [], pickAns: [], points: 0};

            this.setupListeners(socket, pos);

            if(this.countPlayers() >= 4) {
                this.io.emit("new-player", {waitingFor: 0});
                this.beginRound();
            }
            else this.io.emit("new-player", {waitingFor: 4 - this.countPlayers()});
        });

    }
}