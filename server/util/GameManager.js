module.exports = class GameManager {

    /* 
    Game Phases:
        "setup"
        "playersAnswer"
        "czarPick"
        "awardPoints"
    */

    /* the folowing lines will be customizable rules in the future */
    handSize = 10; // cards
    timePerPhase = 120; // seconds
    maxPlayers = null // not yet implemented
    useCustomCards = null // not yet implemented
    password = null // not yet implemented

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

    /**
     * shuffles the especified cards.
     * O(n), being n the number of cards.
     * @param {string} which use "answers" to shuffle only the answers,
     *                       use "question" to shuffle only the questions,
     *                       use anything else to shuffle both.
     */
    shuffle(which) {
        if(which !== "answers") {
            const cardNum = this.cards[0].length;
            for(let i = 0; i < cardNum; i++) { //In every position place a card that is ahead of it (or the same)
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

    /**
     * Replaces the cards stated in player's replace
     * if player.replace is "all" all cards will be replaces
     * O(n), being n the player.replace.lenght (or handSize if "all").
     * @param {*} player object with player info.
     */
    draw(player) {
        if(player.replace === "all") {
            for(let a = 0; a < this.handSize; a++ ) {
                player.hand[a] = {pos: a, card: this.cards[1][this.cardCount[1]++]};
            }
        }
        else {
            for(elem of player.replace) {
                player.hand[elem] = {pos: elem, card: this.cards[1][this.cardCount[1]++]};
            }
        }
        player.replace=[];
    }

    /**
     * Simple auxiliar function to get the least recently freedPosition in playerList
     * or the next position in playerList if none was freed
     * O(1).
     */
    getPos() {
        if(this.freePos.length) return this.freePos.shift();
        return this.playerList.length;
    }

    /**
     * Returns the amount of players currently connected
     * O(1).
     */
    countPlayers() {
        return this.playerList.length - this.freePos.length;
    }

    /**
     * Sets event handlers to the socket
     * @param {Socket} socket socket to be setted up.
     * @param {number} pos position in playerList of the player this socket belongs to.
     */
    setupListeners(socket, pos) {

        /* 
            Handles disconnections, removes player from playerList adding its position to freePos
            remove any submitted answers that might belong to this player
        */
        socket.on("disconnect", () => {
            this.freePos.push(pos);
            this.submittedAnswers[pos] = null;
            this.playerList[pos] = null;
            console.log(`${pos} disconnected`);

            if(this.countPlayers() < 4) {
                this.inGame = false;
                // emit waiting again (no progres lost tho)
                // spectating -> playerList and beginRound ()
            }
        });

        /*
            Handle
        */
        socket.on("send-answer", msg => {
            const sAPos = this.submittedAnswers[pos] = {answer: msg.setAns};
            this.playerList[pos].status = "ready";
            msg.setAns.map(e => this.playerList[pos].replace.push(e.pos));
            this.io.to(`${this.playerList[this.czar].socket.id}`).emit("set-sub-ans", {subAns: this.submittedAnswers});
            console.log(this.submittedAnswers);
        });

        socket.on("remove-answer", () => {
            this.submittedAnswers[pos] = null;
            this.playerList[pos].replace = [];
            this.io.to(`${this.playerList[this.czar].socket.id}`).emit("set-sub-ans", {subAns: this.submittedAnswers});
            console.log(this.submittedAnswers);
        });
    }

    async beginRound() {
        this.gamePhase = "playersAnswer";
        const question = this.cards[0][this.cardCount[0]++];
        for(const player of this.playerList) {
            this.draw(player);
            player.socket.emit("new-round", {question, hand: player.hand});
        }
        while(this.countPlayers() >= 4 && !this.playerList[this.czar]) this.cazar = (this.czar + 1) % this.playerList.length;
        this.io.to(`${this.playerList[this.czar].socket.id}`).emit("set-czar", {content: "You are the czar"});
    }

    setupIO() {

        this.io.on("connect", socket => {
            if(!this.inGame) {
                const pos = this.getPos();
                this.playerList[pos] = {socket, hand: [], replace: "all", points: 0, status: "waiting"};

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