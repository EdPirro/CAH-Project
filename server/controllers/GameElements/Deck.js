const byPack = require("./Cards/byPack.json");

module.exports = class Deck {

    constructor(decks, handSize, requestAllPlayersDraw) {
        this.selectedDecks = decks;
        this.handSize = handSize;
        this.questions = [];
        this.answers = []
        for(let pack of decks) {
            this.questions = this.questions.concat(byPack[pack].blackCards);
            this.answers = this.answers.concat(byPack[pack].whiteCards);
        }
        this.shuffle();
        this.requestAllPlayersDraw = requestAllPlayersDraw;
    }

    /**
     * shuffles the especified cards.
     * O(n), being n the number of cards.
     * @param {string} which use "answers" to shuffle only the answers,
     *                       use "question" to shuffle only the questions,
     *                       use anything else (or nothing) to shuffle both.
     */
    shuffle(which) {
        if(which !== "answers") { // if not shuffling only answers, then shuffle questions
            const cardNum = this.questions.length;
            for(let i = 0; i < cardNum; i++) { // In every position place a card that is ahead of it (or the same)
                const pos = Math.floor(Math.random() * (cardNum - i)) + i;
                const temp = this.questions[pos];
                this.questions[pos] = this.questions[i];
                this.questions[i] = temp;
                this.curQuestionPos = 0;
            }
        }
        if(which !== "questions") { // if not shuffling only questions, then shuffle answers
            const cardNum = this.answers.length;
            for(let i = 0; i < cardNum; i++) {
                const pos = Math.floor(Math.random() * (cardNum - i)) + i;
                const temp = this.answers[pos];
                this.answers[pos] = this.answers[i];
                this.answers[i] = temp;
                this.curAnswerPos = 0;
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
        // TODO: check if enough, if not shuffle answers and re-draw every player
        const cnt = player.replace === "all" ? this.handSize : player.replace.length;

        if(this.curAnswerPos + cnt > this.answers.length) {
            this.shuffle("answers");
            this.requestAllPlayersDraw();
            return;
        }

        if(player.replace === "all") {
            for(let a = 0; a < this.handSize; a++ ) {
                player.hand[a] = { pos: a, card: this.answers[this.curAnswerPos++] };
            }
        }
        else {
            for(let elem of player.replace) {
                player.hand[elem] = { pos: elem, card: this.answers[this.curAnswerPos++] };
            }
        }
        player.replace=[];
    }

    drawQuestion() {
        const nxtPos = this.curQuestionPos + 1;
        if(nxtPos >= this.questions.length) this.shuffle("questions");
        else this.curQuestionPos = nxtPos;
        this.currentQuestion = this.questions[this.curQuestionPos];
    }
}