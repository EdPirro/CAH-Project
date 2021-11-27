import React from "react";
import Question from "./Question";
import Menu from "./Menu";
import Hand from "./Hand";

 
function PlayerView({ question, setAns, tryAns, time, hand, tryAnswer, unTryAnswer, setAnswer, unSetAnswer }) {
    return (
        <>
            <Question card={question} setAns={setAns} tryAns={tryAns} divClass="playerQ"/>
            <Menu time={time} pos="right"/>
            <Hand cards={hand} setAnswer={setAnswer} unSetAnswer={unSetAnswer} tryAnswer={tryAnswer} unTryAnswer={unTryAnswer} />
        </>
    );
}

export default PlayerView;