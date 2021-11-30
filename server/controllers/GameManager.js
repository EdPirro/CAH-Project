const Deck = require("./GameElements/Deck");
const Player = require("./GameElements/Player");
const WaitingPhase = require("./GameElements/GamePhases/WaitingPhase");
const PlayersPickPhase = require("./GameElements/GamePhases/PlayersPickPhase");
const CzarPicksPhase = require("./GameElements/GamePhases/CzarPicksPhase");
const AwardPointsPhase = require("./GameElements/GamePhases/AwardPointsPhase");

const MIN_PLAYERS = 3; // debug only, will be 4 in the final version

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

    constructor(gameRules, destroyGame) {
        /* rules */
        this.handSize = 10; // cards
        this.timePerPhase = 90; // seconds
        this.pointsPerWin = 10; // points
        this.maxPlayers = null // not yet implemented

        this.timer = null;
        this.timeOut = null;
        this.interval = null;
        this.states = {
            waiting: new WaitingPhase(this),
            playersPick: new PlayersPickPhase(this),
            czarPicks: new CzarPicksPhase(this),
            awardPoints: new AwardPointsPhase(this)
        };
        
        this.name = gameRules.name;
        this.deck = new Deck(gameRules.deck, this.handSize);
        this.io = getIO().of(this.name.toString());
        this.playerList = [];
        this.freePos = [];
        this.czar = -1;
        this.czarPlayer = null;
        this.spectating = [];
        this.gamePhase = this.states.waiting;
        this.cntAnswers = 0;
        this.setupIO();

        this.handleCzarPick = this.handleCzarPick.bind(this);
        this.destroyGame = destroyGame;
    }

    get meta() {
        return {
            name: this.name,
            deck: this.deck.selectedDeck,
            pointsPerWin: this.pointsPerWin,
            timePerPhase: this.timePerPhase,
            handSize: this.handSize
        }
    }

    handleCzarPick(pickedPlayer) { 
        let pickedId = pickedPlayer ? Number(pickedPlayer) : null;
        if(pickedId && isNaN(pickedId)) pickedId = -1;
        console.log("Czar picked: ", pickedPlayer);
        const pickedPlayerObj = this.playerList[pickedId]; // pickedPlayer Player instance
    
        // pickedPlayerObj = null -> czar picked a player that diconnected
        // pickedId = null -> czar didn't pick a player
        // pickedId = -1 -> czar picked a player that doesn't exist (error)
        // else -> fine
        this.winner = !pickedPlayerObj ? "disconnected" : pickedId; 
        this.gamePhase.next();
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

        // remove listener from previous czar
        if(this.czarPlayer) this.czarPlayer.socket.off("czar-pick", this.handleCzarPick);
        if(this.czarPlayer?.isCzar) this.czarPlayer.isCzar = false;

        const curCzar = this.czar;
        let nxtCzar = (curCzar + 1) % len;
        while(nxtCzar !== curCzar && !this.playerList[nxtCzar]) nxtCzar = (nxtCzar + 1) % len;

        
        this.czar = nxtCzar;
        this.czarPlayer = this.playerList[nxtCzar];

        if(this.czarPlayer) {
            this.czarPlayer.isCzar = true;
            this.czarPlayer.socket.on("czar-pick", this.handleCzarPick);
        }

        return this.czarPlayer;
    }

    tickTimer(remaining) {
        this.io.emit("timer", remaining);
    }

    startPhaseTimer(time=this.timePerPhase) {
        this.stopPhaseTimer();
        this.timer = time;
        this.io.emit("timer", time);
        this.timeOut = setTimeout(() => this.gamePhase.next(), time * 1000);
        this.interval = setInterval(() => this.tickTimer(--this.timer), 1000);
    }

    stopPhaseTimer() {
        if(this.interval) clearInterval(this.interval);
        if(this.timeOut) clearTimeout(this.timeOut);
        this.timeOut = null;
        this.interval = null;
        this.timer = null;
    }

    getPlayersAnswers() {
        const playersAnswers = {};
        for(let i = 0; i < this.playerList.length; i++) {
            if(i == this.czar) continue;
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
        return this.playerList.length + this.spectating.length;
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

            const cnt = this.countPlayers();
            if(!cnt) 
                this.destroyGame();
            else if(cnt < 4)
                this.setState("waiting");
            else if(pos === this.czar) 
                this.setState("playersPick");
        });


        socket.on("send-answer", answer => {
            if(this.gamePhase.id !== "playersPick") return;
            const player = this.playerList[pos];
            player.setAnswer(answer);
            this.cntAnswers++;
            this.czarPlayer.socket.emit("set-player-ans-cnt", this.cntAnswers);
            console.log(`Received player ${player.name} answer, ${this.cntAnswers}/${this.countPlayers()} answered`);
            if(this.cntAnswers === this.countPlayers() - 1) {
                this.gamePhase.next("All players locked-in");
            }
        });

        socket.on("clear-answer", () => {
            if(this.gamePhase.id !== "playersPick") return;
            const player = this.playerList[pos];
            player.clearAnswer();
            this.cntAnswers--;
            console.log(`Cleared player ${player.name} answer, ${this.cntAnswers}/${this.countPlayers()} answered`);
            this.czarPlayer.socket.emit("set-player-ans-cnt", this.cntAnswers);
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