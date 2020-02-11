import React from "react";
import Question from "./Question";
import Hand from "./Hand";
import Menu from "./Menu";
import AnswersContainer from "./AnswersContainer";

function Game() {

    const [setAns, setSetAns] = React.useState([]); // set(ted) answers
    const [tryAns, setTryAns] = React.useState(null); // answers being tried but not set
    const [time, setTime] = React.useState(200); // time (s) to play
    const [czar, setCzar] = React.useState(true);
    const [chosenPlayer, setChosenPlayer] = React.useState(null);
    const inter = React.useRef(null);
    let full = false;

    // setup a interval to deduct a second of the timer every 1000ms
    React.useEffect(() => {inter.current = setInterval(() => setTime(t => t - 1), 1000)}, []) // empty dependency array -> only once
    // setTime(t => t - 1) will allow us not to put time in the dependency array and will always update as a funtion of the last time value
    
    if(!time) {
        clearInterval(inter.current)
    };

    const card = { // question card
        nAns: 3, 
        content: [" is the most arousing thing in the world ", "aaaa ", "."], 
        begin: true
    };

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
        for(let i = 0; i < card.nAns; i++) {
            newAns[i] = setAns[i];
            if(!set && !setAns[i]) {
                newAns[i] = content;
                set = true;
                if(i === card.nAns - 1) full = true;
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
        for(let i = 0; i < card.nAns; i++) {
            newAns[i] = setAns[i];
            if(!taken && setAns[i] === content) {
                newAns[i] = undefined;
                taken = true;
            }
        }
        if(taken) setSetAns(newAns);
        full = false;
    }

    // Functions to add or remove a card to/from setAns
    const tryAnswer = content => {
        if((() => {
            for(let i = 0; i < card.nAns; i++) if(!setAns[i]) return false;
            return true;
        })()) return;

        setTryAns(content);
    };

    const unTryAnswer = () => {
        setTryAns(null);
    }

    const hand = []; // list of cards (the player's hand)
    hand.push({content: "Yo mamma "});
    hand.push({content: "Richard Gere holding a banana "});
    hand.push({content: "A very clever monkey "});
    hand.push({content: "Some ugly sweater "});
    hand.push({content: "My father's penis "});
    hand.push({content: "Venereal Desease "});
    hand.push({content: "A bunch of sweaty men "});
    hand.push({content: "A fully charged phone "});
    hand.push({content: "A very hairy pizza delivery guy "});
    hand.push({content: "My dungeon "});

    const players = [
        {id: 0, cards: ["a", "b", "c"]},
        {id: 1, cards: ["d", "e", "f"]},
        {id: 2, cards: ["g", "h", "i"]},
        {id: 3, cards: ["g", "h", "i"]},
        {id: 4, cards: ["g", "h", "i"]},
        {id: 5, cards: ["g", "h", "i"]},
        {id: 6, cards: ["g", "h", "i"]},
        {id: 7, cards: ["g", "h", "i"]},
        {id: 8, cards: ["g", "h", "i"]},
        {id: 9, cards: ["g", "h", "i"]},
        {id: 10, cards: ["g", "h", "i"]},
        {id: 11, cards: ["g", "h", "i"]},
        {id: 12, cards: ["g", "h", "i"]},
        {id: 13, cards: ["g", "h", "i"]},
    ];

    const subAns = players.map(player => <AnswersContainer 
                                            key={player.id}
                                            player={player} 
                                            revealAnswer={revealAnswer}
                                            show={player.id === chosenPlayer}
                                        /> 
                            );
 
    return (
        <>
            <link rel="stylesheet" type="text/css" href="styles/game.css" />
            <div className="playerMain">
                <button style={{position: "absolute", top: "0px", left: "0px", zIndex: 1}} onClick={() => setCzar(!czar)}>Toggle</button>
                {czar ? 
                    <>
                        <div className="czarQCont">
                            <Question card={card} setAns={setAns} tryAns={tryAns} divClass="czarQ" />
                            <div className="czarBut">Select</div>
                        </div>
                        <Menu time={time} pos="left" ></Menu>
                        <div className="czarSubAns" >
                            {subAns}
                        </div>
                    </> : 
                    <>
                        
                        <Question card={card} setAns={setAns} tryAns={tryAns} divClass="playerQ"/>
                        <Menu time={time} pos="right"/>
                        <Hand cards={hand} tryAnswer={[tryAnswer, unTryAnswer]} setAnswer={[setAnswer, unSetAnswer]} />
                    </>
                }
            </div>
        </>
    );
}

export default Game;