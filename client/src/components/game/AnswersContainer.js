import React from "react";
import Answer from "./Answer";

const cardSize = 194;

function AnswersContainer({ nAns, isChosenPlayer, playerAnswers, choosePlayer }) {

    const [width, setWidth] = React.useState(0.0);

    const handleResize = React.useMemo(() => () => {
        setWidth(window.innerWidth * 0.15);
    }, []);

    React.useEffect(() => {
        setWidth(window.innerWidth * 0.15);
        window.addEventListener("resize", handleResize);

        return () => { window.removeEventListener("resize", handleResize); }
    }, [handleResize]);

    const clickHandle = React.useMemo(() => () => {
        if(choosePlayer) choosePlayer();
    }, [choosePlayer]);

    const overlap = React.useMemo(() => 
        (width < (nAns * cardSize)) ? 
            (((nAns * cardSize) - width) / (nAns - 1)) 
            : null
    , [nAns, width]);


    const content = React.useMemo(() => {
        const ret = [];
        for(let i = 0; i < nAns; i++)  
            ret.push(
                <Answer 
                    key={i} 
                    pos={i} 
                    overlap={overlap} 
                    card={playerAnswers?.[i]?.card} 
                    cardElem={playerAnswers?.[i]} 
                    size={cardSize}  
                    cover={!isChosenPlayer}
            />); // TODO: FIX PROPS
        return ret;
    }, [nAns, overlap, playerAnswers, isChosenPlayer]);

    return (
        <div className="czarAnsCont scrollbar" onClick={clickHandle}>
            {content}
        </div> 
    );
}

export default AnswersContainer;