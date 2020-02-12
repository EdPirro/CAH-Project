import React from "react";
import Question from "./Question";
import Hand from "./Hand";
import Menu from "./Menu";
import AnswersContainer from "./AnswersContainer";
import io from "socket.io-client";

function Game(props) {


    const [loaded, setLoaded] = React.useState(false);
    const [hand, setHand] = React.useState(null);
    const [question, setQuestion] = React.useState(null);
    const [setAns, setSetAns] = React.useState([]); // set(ted) answers
    const [tryAns, setTryAns] = React.useState(null); // answers being tried but not set
    const [time, setTime] = React.useState(200); // time (s) to play
    const [czar, setCzar] = React.useState(false); // wether the player is or not the czar
    const [chosenPlayer, setChosenPlayer] = React.useState(null); // select the player chosen by the czar
    const [socket, setSocket] = React.useState(null); // socket used to comunnicate with server
    // const [pos, setPos] = React.useState(null); // player position in server's player array
    const [neededPlayers, setNeededPlayers] = React.useState(4); // if the game is waiting for more players
    const inter = React.useRef(null);
    let full = false;

    const setUpSocket = React.useMemo(() => () => {
        
        socket.on("new-player", msg => {
            setNeededPlayers(msg.waitingFor);
        });

        socket.on("new-round", msg => {
            setQuestion(msg.question)
            setHand(msg.hand);
        });

        socket.on("round-ready", msg => {
            setLoaded(true);
        });
    }, [socket]);

    // setup a interval to deduct a second of the timer every 1000ms
    React.useEffect(() => {inter.current = setInterval(() => setTime(t => t - 1), 1000)}, []);
    React.useEffect(() => {setSocket(io(props.url))}, [props.url]);
    React.useEffect(() => {
        if(socket) {
            setUpSocket();
        }
    }, [socket, setUpSocket]);

    if(!time) {
        clearInterval(inter.current);
    };

    const disconnect = () => {
        socket.disconnect();
        props.gameOver();
    }

    const revealAnswer = player => {
        const newAns =[]
        for(const elem of player.cards) newAns.push(elem);
        setSetAns(newAns);
        setChosenPlayer(player.id);
    }

    // Functions to add or remove a card to/from tryAns
    const setAnswer = content => {
        if(full) return;
        const newAns = [];
        let set = false;
        for(let i = 0; i < question.nAns; i++) {
            newAns[i] = setAns[i];
            if(!set && !setAns[i]) {
                newAns[i] = content;
                set = true;
                if(i === question.nAns - 1) full = true;
            }
        }
        if(set) {
            setSetAns(newAns)
            return true;
        };
    }

    const unSetAnswer = content => {
        const newAns = [];
        let taken = false;
        for(let i = 0; i < question.nAns; i++) {
            newAns[i] = setAns[i];
            if(!taken && setAns[i] === content) {
                newAns[i] = undefined;
                taken = true;
            }
        }
        if(taken) setSetAns(newAns);
        full = false;
    }

    // Functions to add or remove a question to/from setAns
    const tryAnswer = content => {
        if((() => {
            for(let i = 0; i < question.nAns; i++) if(!setAns[i]) return false;
            return true;
        })()) return;

        setTryAns(content);
    };

    const unTryAnswer = () => {
        setTryAns(null);
    }

    const players = [];

    const subAns = players.map(player => <AnswersContainer 
                                            key={player.id}
                                            player={player} 
                                            revealAnswer={revealAnswer}
                                            show={player.id === chosenPlayer}
                                        /> 
                            );
    
    return (
            neededPlayers ?
            <>Waiting on {neededPlayers} players...</> :
            <>
                {loaded ? 
                    <>
                        <link rel="stylesheet" type="text/css" href="styles/game.css" />
                        <div className="playerMain">
                            <button style={{position: "absolute", top: "0px", left: "0px", zIndex: 1}} onClick={disconnect}>Disconnect</button>
                            {czar ? 
                                <>
                                    <div className="czarQCont">
                                        <Question card={question} setAns={setAns} tryAns={tryAns} divClass="czarQ" />
                                        <div className="czarBut">Select</div>
                                    </div>
                                    <Menu time={time} pos="left" ></Menu>
                                    <div className="czarSubAns" >
                                        {subAns}
                                    </div>
                                </> : 
                                <>
                                    
                                    <Question card={question} setAns={setAns} tryAns={tryAns} divClass="playerQ"/>
                                    <Menu time={time} pos="right"/>
                                    <Hand cards={hand} tryAnswer={[tryAnswer, unTryAnswer]} setAnswer={[setAnswer, unSetAnswer]} />
                                </>
                            }
                        </div> 
                    </>:
                    <>loading...</>}
            </> 
    );
}

export default Game;