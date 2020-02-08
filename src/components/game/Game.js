import React from "react";
import Question from "./Question";
import Hand from "./Hand";
import Menu from "./Menu"

function Game() {

    const [setAns, setSetAns] = React.useState([]);
    const [tryAns, setTryAns] = React.useState(null);
    const [time, setTime] = React.useState(60);
    const inter = React.useRef(null);
    let full = false;

    // setup a interval to deduct a second of the timer every 1000ms
    React.useEffect(() => {inter.current = setInterval(() => setTime(t => t - 1), 1000)}, []) // empty dependency array -> only once
    // setTime(t => t - 1) will allow us not to put time in the dependency array and will always update as a funtion of the last time value
    
    if(!time) clearInterval(inter.current);

    const card = {
        nAns: 3, 
        content: [" is the most arousing thing in the world ", "aaaa ", "."], 
        begin: true
    };

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

    const hand = [];
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
 
    return (
        <>
            <link rel="stylesheet" type="text/css" href="styles/game.css" />
            <div className="main">
                <Question card={card} setAns={setAns} tryAns={tryAns} />
                <Menu time={time}/>
                <Hand cards={hand} tryAnswer={[tryAnswer, unTryAnswer]} setAnswer={[setAnswer, unSetAnswer]} />
            </div>
        </>
    );
}

export default Game;