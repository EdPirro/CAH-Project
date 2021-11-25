module.exports = class Player {

    constructor(socket, name) {
        this.socket = socket;
        this.name = name;
        this.hand =  [];
        this.replace = "all";
        this.points = 0;
        this.status = "waiting";
        this.isCzar = false;
        this.currentAnswer = [];
    }

    setAnswer(answer) {
        this.currentAnswer = answer;
        const nr = [];
        answer.map(e => nr.push(e.pos));
        this.replace = nr;
        this.status = "ready"
    }

    clearAnswer() {
        this.currentAnswer = [];
        this.replace = [];
        this.status = "choosing";
    }

    setUpForNewRound() {
        this.clearAnswer();
        this.isCzar = false;
    }

}