import React from "react";
import PlayerView from "./PlayerView";
import CzarView from "./CzarView";
import io from "socket.io-client";

function Game({ url, gameOver }) {
    const [loading, setLoading] = React.useState(true);
    const [hand, setHand] = React.useState(null);
    const [question, setQuestion] = React.useState(null);
    const [spectating, setSpectating] = React.useState(null);
    const [setAns, setSetAns] = React.useState([]); // set(ted) answers
    const [tryAns, setTryAns] = React.useState(null); // answers being tried but not set
    const [time, setTime] = React.useState(120); // time (s) to play
    const [czar, setCzar] = React.useState(false); // wether the player is or not the czar
    const [socket, setSocket] = React.useState(null); // socket used to comunnicate with server
    const [neededPlayers, setNeededPlayers] = React.useState(4); // if the game is waiting for more players
    const [czarPicksPhase, setCzarPicksPhase] = React.useState(false); // if the czar is picking an answer
    const inter = React.useRef(null);
    const setAnsAmount = React.useRef(0);

    const setUpSocket = React.useMemo(() => () => {
        
        socket.on("waiting", msg => {
            setNeededPlayers(msg.for);
        });

        socket.on("players-pick-phase", msg => {
            setNeededPlayers(0);
            setQuestion(msg.question);
            setHand(msg.hand);
            setSetAns([]);
            setAnsAmount.current = 0;
            setTryAns(null);
            setCzarPicksPhase(false);
        });

        socket.on("spectating", () => {
            setSpectating(true);
        });

        socket.on("set-czar", () => {
            setCzar(true);
        });

        socket.on('czar-picks-phase', () => {
            setCzarPicksPhase(true);
        }); 


    }, [socket]);

    // setup a interval to deduct a second of the timer every 1000ms
    React.useEffect(() => { inter.current = setInterval(() => setTime(t => t - 1), 1000) }, []);

    React.useEffect(() => { setSocket(io(url, { query: `name=${"SAMPLE NAME"}` })) }, [url]);

    React.useEffect(() => {
        if(socket) {
            setUpSocket();
        }
    }, [socket, setUpSocket]);

    React.useEffect(() => {
        if(question && hand) setLoading(false);
    }, [question, hand]);
    
    React.useEffect(() => {
        if(question && setAnsAmount.current === question.nAns) socket.emit("send-answer", setAns);
    }, [setAns, socket, question]);

    React.useEffect(() => {
        if(!time && inter.current) clearInterval(inter.current);
    }, [time]);

    const disconnect = React.useMemo(() => () => {
        socket.disconnect();
        gameOver();
    }, [gameOver, socket]);

    const revealAnswer = React.useMemo(() => answers => {
        setSetAns([...answers]);
    }, []);

    // Functions to add or remove a card to/from tryAns
    const setAnswer = React.useMemo(() =>  cardElem => {
        if(setAnsAmount.current === question.nAns) return;
        const newAns = [];
        let set = false;
        for(let i = 0; i < question.nAns; i++) {
            newAns[i] = setAns[i];
            if(!set && !setAns[i]) {
                newAns[i] = cardElem;
                set = true;
            }
        }
        if(set) {
            setAnsAmount.current++;
            setSetAns(newAns);
            return true;
        };
    }, [setAns, question]);

    const unSetAnswer = React.useMemo(() => cardElem => {
        if(setAnsAmount.current === question.nAns) socket.emit("remove-answer");
        const newAns = [];
        let taken = false;
        for(let i = 0; i < question.nAns; i++) {
            newAns[i] = setAns[i];
            if(!taken && setAns[i] && setAns[i].card.content === cardElem.card.content) {
                newAns[i] = undefined;
                taken = true;
            }
        }
        if(taken) {
            setSetAns(newAns);
            setAnsAmount.current--;
        }
    }, [setAns, socket, question]);

    // Functions to add or remove a question to/from setAns
    const tryAnswer = React.useMemo(() => cardElem => {
        if(setAnsAmount.current === question.nAns) return;
        setTryAns(cardElem);
    }, [question]);

    const unTryAnswer = React.useMemo(() => () => {
        setTryAns(null);
    }, []);
    
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
                                    czarPicksPhase={czarPicksPhase}
                                    setAnswer={setSetAns}
                                />
                                :
                                <PlayerView 
                                    czarPicksPhase={czarPicksPhase}
                                    socket={socket}
                                    question={question}
                                    setAns={setAns}
                                    tryAns={tryAns}
                                    time={time}
                                    hand={hand}
                                    tryAnswer={tryAnswer}
                                    unTryAnswer={unTryAnswer}
                                    setAnswer={setAnswer}
                                    unSetAnswer={unSetAnswer}
                                />
                }
            </div>
        </>

    );
}

export default Game;