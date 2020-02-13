import React from "react";
import PlayerView from "./PlayerView";
import CzarView from "./CzarView";
import io from "socket.io-client";



function Game(props) {
    const [loading, setLoading] = React.useState(true);
    const [hand, setHand] = React.useState(null);
    const [question, setQuestion] = React.useState(null);
    const [spectating, setSpectating] = React.useState(null);
    const [setAns, setSetAns] = React.useState([]); // set(ted) answers
    const [tryAns, setTryAns] = React.useState(null); // answers being tried but not set
    const [time, setTime] = React.useState(200); // time (s) to play
    const [czar, setCzar] = React.useState(false); // wether the player is or not the czar
    const [socket, setSocket] = React.useState(null); // socket used to comunnicate with server
    const [neededPlayers, setNeededPlayers] = React.useState(4); // if the game is waiting for more players
    const inter = React.useRef(null);
    const full = React.useRef(false);

    const setUpSocket = React.useMemo(() => () => {
        
        socket.on("new-player", msg => {
            setNeededPlayers(msg.waitingFor);
        });

        socket.on("new-round", msg => {
            setQuestion(msg.question)
            setHand(msg.hand);
        });

        socket.on("spectating", msg => {
            setSpectating(true);
        });

        socket.on("set-czar", () => {
            setCzar(true);
        }) 


    }, [socket]);

    // setup a interval to deduct a second of the timer every 1000ms
    React.useEffect(() => {inter.current = setInterval(() => setTime(t => t - 1), 1000)}, []);
    React.useEffect(() => {setSocket(io(props.url))}, [props.url]);
    React.useEffect(() => {
        if(socket) {
            setUpSocket();
        }
    }, [socket, setUpSocket]);
    React.useEffect(() => {
        if(question && hand) setLoading(false);
    }, [question, hand]);
    React.useEffect(() => {
        if(full.current) socket.emit("send-answer", {setAns});
    }, [setAns, socket])

    if(!time) {
        clearInterval(inter.current);
    };

    const disconnect = () => {
        socket.disconnect();
        props.gameOver();
    }

    const revealAnswer = answer => {
        const newAns = [];
        for(const elem of answer) newAns.push(elem);
        setSetAns(newAns);
    }

    // Functions to add or remove a card to/from tryAns
    const setAnswer = cardElem => {
        if(full.current) return;
        const newAns = [];
        let set = false;
        for(let i = 0; i < question.nAns; i++) {
            newAns[i] = setAns[i];
            if(!set && !setAns[i]) {
                newAns[i] = cardElem;
                set = true;
                if(i === question.nAns - 1) full.current = true;
            }
        }
        if(set) {
            setSetAns(newAns);
            return true;
        };
    }

    const unSetAnswer = cardElem => {
        if(full.current) socket.emit("remove-answer");
        const newAns = [];
        let taken = false;
        for(let i = 0; i < question.nAns; i++) {
            newAns[i] = setAns[i];
            if(!taken && setAns[i].card.content === cardElem.card.content) {
                newAns[i] = undefined;
                taken = true;
            }
        }
        if(taken) setSetAns(newAns);
        full.current = false;
    }

    // Functions to add or remove a question to/from setAns
    const tryAnswer = cardElem => {
        if((() => {
            for(let i = 0; i < question.nAns; i++) if(!setAns[i]) return false;
            return true;
        })()) return;

        setTryAns(cardElem);
    };

    const unTryAnswer = () => {
        setTryAns(null);
    }
    
    return (
        <>
            <link rel="stylesheet" type="text/css" href="styles/game.css" />
            <div className="main">
                {spectating ? 
                    <> spectating... </>
                    :
                    neededPlayers ? 
                        <> Waiting for {neededPlayers} players </>
                        :
                        loading ? 
                            <> Loading... </>
                            : 
                            czar ? 
                                <CzarView 
                                    socket={socket}
                                    question={question}
                                    setAns={setAns}
                                    time={time}
                                    revealAnswer={revealAnswer}
                                />
                                :
                                <PlayerView 
                                    socket={socket}
                                    question={question}
                                    setAns={setAns}
                                    tryAns={tryAns}
                                    time={time}
                                    hand={hand}
                                    tryAnswer={[tryAnswer, unTryAnswer]}
                                    setAnswer={[setAnswer, unSetAnswer]}
                                />
                }
            </div>
        </>

    );
}

export default Game;