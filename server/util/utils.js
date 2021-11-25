const crypto = require("crypto");
const manageNamespace = {} // will keep the count os namespaces with the same base name;
const io = require("socket.io");

let socketio;

module.exports = {

    /**
     * simply return a random string to be used as a namespace
     */
    generateRandomNamespace() {
        const ns = crypto.randomBytes(10).toString("hex"); // repetition is improbable

        // the following lines make namespaces with the same name not only improbable but actually impossible,
        // unless the count for a namespace base name surpass the number that can be held in a var,
        // but the server would've, most probably, already died before this happens.
        if(manageNamespace[ns] !== undefined) ns += manageNamespace[ns]++;
        else manageNamespace[ns] = 0;
        return ns;
    },

    // ran only once upon initialization
    initializeIO(server) {
        socketio = io(server);
    },

    // whenever io is needed
    getIO() {
        return socketio;
    }

}