const Deck = require("./GameElements/Deck");
const Player = require("./GameElements/Player");
const WaitingPhase = require("./GameElements/GamePhases/WaitingPhase");
const PlayersPickPhase = require("./GameElements/GamePhases/PlayersPickPhase");
const CzarPicksPhase = require("./GameElements/GamePhases/CzarPicksPhase");
const AwardPointsPhase = require("./GameElements/GamePhases/AwardPointsPhase");

const MIN_PLAYERS = 2;

const { getIO } = require("../util/utils");

module.exports = class GameManager {

    static customizableRules = ["name", "deck"];

    /* 
        Game Phases:
            "waiting"
            "playersPick"
            "czarPicks"
            "awardPoints"
    */

    constructor(gameRules) {

        /* rules */
        this.handSize = 10; // cards
        this.timePerPhase = 120; // seconds
        this.maxPlayers = null // not yet implemented

        this.states = {
            waiting: new WaitingPhase(this),
            playersPick: new PlayersPickPhase(this),
            czarPicks: new CzarPicksPhase(this),
            awardPoins: new AwardPointsPhase(this)
        };
        
        this.name = gameRules.name;
        this.deck = new Deck(gameRules.deck, this.handSize);
        this.io = getIO().of(this.name.toString());
        this.playerList = [];
        this.freePos = [];
        this.czar = -1;
        this.spectating = [];
        this.gamePhase = this.states.waiting;
        this.cntAnswers = 0;
        this.setupIO();
    }

    get meta() {
        return {
            name: this.name,
            deck: this.deck.selectedDeck,
            currentPahse: this.gamePhase.id
        }
    }

    setState(state) {
        this.gamePhase = this.states[state];
        this.gamePhase.startUp();
    }

    reallocatePlayers() { // playerList = [Player, null, Player, Player, null, null, Player] freePos = [5, 1, 4]
        this.playerList = this.playerList.map(el => el);
        this.freePos = [];
    }

    joinSpectators() {
        console.log("Spectators joined the game");
        const spectating_cp = [...this.spectating];
        this.spectating = [];
        for(let player of spectating_cp) {
            this.playerList[player.holdPos] = player;
        }

        this.reallocatePlayers();
    }

    nextCzar() {
        if(!this.countPlayers()) return null; // game should be at waiting state...

        const len = this.playerList.length; // len copy

        const curCzar = this.czar;
        let nxtCzar = (curCzar + 1) % len;
        while(nxtCzar !== curCzar && !this.playerList[nxtCzar]) nxtCzar = (nxtCzar + 1) % len;

        this.czar = nxtCzar;
        return this.playerList[this.czar];
    }

    startOrRestartPhaseTimer() {
        this.stopPhaseTimer();
        this.interval = setInterval(() => this.gamePhase.next(), this.timePerPhase * 1000);
    }

    startOrKeepPhaseTimer() {
        if(this.interval) return;
        this.startOrRestartPhaseTimer();
    }

    stopPhaseTimer() {
        if(!this.interval) return;
        clearInterval(this.interval);
        this.interval = null;
    }

    getPlayersAnswers() {
        const playersAnswers = {};
        for(let i = 0; i < this.playerList.length; i++) {
            const curAns = this.playerList[i]?.answer;
            if(!curAns) continue;
            playersAnswers[i] = curAns;
        }
        return playersAnswers;
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
            const playerName = this.playerList[pos]?.name ?? "spectating player";
            console.log(`${playerName} disconnected`);

            this.playerList[pos] = null;

            if(this.countPlayers() < 4)
                this.setState("waiting");
            else if(pos === this.czar) 
                this.setState("playersPick");
        });


        socket.on("send-answer", answer => {

            const player = this.playerList[pos];
            console.log(`Received player ${player.name} answer`);
            player.setAnswer(answer);
            this.cntAnswers++;
            this.playerList[this.czar].socket.emit("set-player-ans-cnt", this.cntAnswers);
            if(this.cntAnswers === this.countPlayers()) {
                this.gamePhase.next("All players locked-in");
            }
        });

        socket.on("clear-answer", () => {
            const player = this.playerList[pos];
            console.log(`Clearing player ${player.name} answer`);
            player.clearAnswer();
            this.cntAnswers--;
            console.log(`Sending player ${player.name} status to czar ${this.czar}`);
            this.playerList[this.czar].socket.emit("set-player-ans-cnt", this.cntAnswers);
        });

    }

    setupIO() {

        this.io.on("connect", (socket) => {

            const playerName = socket.handshake.query.name;
            console.log(`${playerName} connected...`);

            const player = new Player(socket, playerName);
            // {socket, hand: [], replace: "all", points: 0, status: "waiting"};
            const pos = this.getPos();
            this.setupListeners(socket, pos);

            if(this.gamePhase.id === "waiting") {
                console.log(`${playerName} joined the game`);

                this.playerList[pos] = player;

                if(this.countPlayers() >= MIN_PLAYERS) {
                    this.gamePhase.next();
                }
                else this.gamePhase.do();

            } else {
                console.log(`${playerName} joined the spectators`);

                player.holdPos = pos;
                player.status = "spectating";
                this.spectating.push(player);
                socket.emit("spectating", { question: this.deck.currentQuestion });
            }
        });

    }
}