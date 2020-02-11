module.exports = class GameManager {

    constructor(namespace, io, removeGame) {
        this.namespace = namespace;
        this.io = io;
        this.playerList = [];
        this.freePos = [];
        this.setupIO();
        this.removeGame = removeGame;
    }

    getPos() {
        if(this.freePos.length) return this.freePos.shift();
        return this.playerList.length;
    }

    setupIO() {

        this.io.on('connect', socket => {
            console.log("aaa");
            const id = socket.handshake.id;
            const pos = this.getPos();
            this.playerList[pos] = {id, socket};
            socket.on('reconnect-attempt', () => {
                socket.io.opts.id = id;
            });
            socket.emit('connected', {pos});
        });
    }
}