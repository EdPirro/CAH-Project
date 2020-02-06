import React from "react";
import Question from "./Question";
import Hand from "./Hand";

function Game() {

    const [selAns, setSelAns] = React.useState([]);

    const card = {
        nAns: 1, 
        content: [" is the most arousing thing in the world."], 
        begin: true
    };

    const tryAnswer = content => {
        if(selAns.length >= card.nAns) return;
        const newAns = [];
        for(let elem of selAns) newAns.push(elem);
        newAns.push(content);
        setSelAns(newAns);
    };

    const unTryAnswer = () => {
        const newAns = [];
        for(let i = 0; i < selAns.length - 1; i++) newAns.push(selAns[i]);
        setSelAns(newAns);
    }
    
    //React.useEffect(() => setSelAns(['Richard Gere holding a banana']), []);

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
                <Question card={card} selAns={selAns} />
                <Hand cards={hand} tryAnswer={[tryAnswer, unTryAnswer]} />
            </div>
        </>
    );
}

export default Game;