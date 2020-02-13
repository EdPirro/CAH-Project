import React from "react";
import Question from "./Question";
import Menu from "./Menu";
import Hand from "./Hand";

function PlayerView(props) {
    return (
        <>
            <Question card={props.question} setAns={props.setAns} tryAns={props.tryAns} divClass="playerQ"/>
            <Menu time={props.time} pos="right"/>
            <Hand cards={props.hand} tryAnswer={props.tryAnswer} setAnswer={props.setAnswer} />
        </>
    );
}

export default PlayerView;