import React from "react";
import Question from "./Question";
import Hand from "./Hand";

 
function PlayerView({ question, setAns, tryAns, gameOver, gameOverMessage, hand, tryAnswer, unTryAnswer, setAnswer, unSetAnswer, czarPicksPhase }) {

    return (
        <>
            <Question card={question} setAns={setAns} tryAns={tryAns} divClass="playerQ"/>
            { gameOver ? 
                <div className="hand" >
                    {gameOverMessage}
                </div>
                : czarPicksPhase ? 
                    <div className="hand" >
                        Czar is deciding the most amusing answer...
                        {setAns?.length !== question.nAns && [<br />, "Apparently you didn't answer in time, so... I guess it won't be yours."]}
                    </div> 
                    : <Hand cards={hand} setAnswer={setAnswer} unSetAnswer={unSetAnswer} tryAnswer={tryAnswer} unTryAnswer={unTryAnswer} />
            }
        </>
    );
}

export default PlayerView;