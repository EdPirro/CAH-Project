import React from "react";
import PlayerView from "./PlayerView";
import CzarView from "./CzarView";
import Menu from "./Menu";
import io from "socket.io-client";


// Could maybe use some refactoring
function Game({ url, playerName }) {
    const [loading, setLoading] = React.useState(true);
    const [hand, setHand] = React.useState(null);
    const [question, setQuestion] = React.useState(null);
    const [spectating, setSpectating] = React.useState(null);
    const [setAns, setSetAns] = React.useState([]); // set(ted) answers
    const [tryAns, setTryAns] = React.useState(null); // answers being tried but not set
    const [czar, setCzar] = React.useState(false); // wether the player is or not the czar
    const [socket, setSocket] = React.useState(null); // socket used to comunnicate with server
    const [neededPlayers, setNeededPlayers] = React.useState(4); // if the game is waiting for more players
    const [czarPicksPhase, setCzarPicksPhase] = React.useState(false); // if the czar is picking an answer
    const [gameOver, setGameOver] = React.useState(false); // if the game is over
    const [gameOverMessage, setGameOverMessage] = React.useState("");
    const [playerPoints, setPlayerPoints] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(null); // current time (s)
    const setAnsAmount = React.useRef(0);

    const setUpSocket = React.useMemo(() => () => {
        
        socket.on("waiting", msg => {
            setNeededPlayers(msg.for);
        });

        socket.on("players-pick-phase", msg => {
            setAnsAmount.current = 0;
            setGameOver(false);
            setCzarPicksPhase(false);
            setQuestion(msg.question);
            setHand(msg.hand);
            setSetAns([]);
            setTryAns(null);
            setCzar(false);
            setNeededPlayers(0);
            setSpectating(false);
        });
        
        socket.on('czar-picks-phase', () => {
            setCzarPicksPhase(true);
        }); 

        socket.on("spectating", () => {
            setSpectating(true);
        });

        socket.on("set-czar", () => {
            setCzar(true);
        });

        socket.on("timer", time => {
            setCurrentTime(time);
        });

        socket.on("game-over", msg => {
            setGameOver(true);
            setGameOverMessage(msg.message);
            setPlayerPoints(msg.points);
        });

    }, [socket]);

    React.useEffect(() => { setSocket(io(url, { query: `name=${playerName}` })) }, [url, playerName]);

    React.useEffect(() => {
        if(socket) {
            setUpSocket();
        }
    }, [socket, setUpSocket]);

    React.useEffect(() => {
        if(question && hand) setLoading(false);
    }, [question, hand]);

    // Functions to add or remove a card to/from setAns
    const setAnswer = React.useMemo(() =>  cardElem => {
        if(setAnsAmount.current >= question.nAns) return false;
        setSetAns(prev => {
            let firstUnset = setAns.findIndex(ans => !ans);
            if(firstUnset === -1) firstUnset = setAns.length;
            prev[firstUnset] = cardElem;
            setAnsAmount.current++;
            if(setAnsAmount.current === question?.nAns) socket.emit("send-answer", setAns);
            return [...prev];
        });
        return true;
    }, [setAns, question, socket]);

    const unSetAnswer = React.useMemo(() => cardElem => {
        if(!setAnsAmount.current) return false;
        if(setAnsAmount.current >= question.nAns) socket.emit("clear-answer");
        setSetAns(prev => {
            const cardIndex = setAns.findIndex(ans => ans.card.content === cardElem.card.content);
            prev[cardIndex] = undefined;
            setAnsAmount.current--;
            return [...prev];
        });
        return true;
    }, [setAns, socket, question]);

    // Functions to add or remove a question to/from tryAns
    const tryAnswer = React.useMemo(() => cardElem => {
        if(setAnsAmount.current === question.nAns) return;
        setTryAns(cardElem);
    }, [question]);

    const unTryAnswer = React.useMemo(() => () => {
        setTryAns(null);
    }, []);
    
    return (
        <>
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
                            <>
                                { 
                                    czar ? 
                                        <CzarView 
                                            socket={socket}
                                            question={question}
                                            setAns={setAns}
                                            czarPicksPhase={czarPicksPhase}
                                            setAnswer={setSetAns}
                                            gameOver={gameOver}
                                        />
                                        :
                                        <PlayerView 
                                            czarPicksPhase={czarPicksPhase}
                                            socket={socket}
                                            question={question}
                                            setAns={setAns}
                                            tryAns={tryAns}
                                            hand={hand}
                                            tryAnswer={tryAnswer}
                                            unTryAnswer={unTryAnswer}
                                            setAnswer={setAnswer}
                                            unSetAnswer={unSetAnswer}
                                            gameOver={gameOver}
                                            gameOverMessage={gameOverMessage}
                                        />
                                }
                                <Menu title="Time" value={currentTime} pos={czar ? "left": "right"} ></Menu>
                                <Menu title="Points" value={playerPoints} pos={czar ? "left": "right"} offset="calc(15vmin + 10px)" ></Menu>
                            </>
                }
            </div>
        </>

    );
}

export default Game;