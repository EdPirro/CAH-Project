import React from "react";
import Question from "./Question";
import Menu from "./Menu";
import AnswersContainer from "./AnswersContainer";


function CzarView({ socket, question, setAns, time, revealAnswer }) {
    const [chosenPlayer, setChosenPlayer] = React.useState(null); // select the player chosen by the czar
    const [playerAnswered, setPlayerAnswered] = React.useState({}); // wether each player has answered or not
    const [playerAnswers, setPlayerAnswers] = React.useState({}); // the answers of each player
    const [subAns, setSubAns] = React.useState([]);

    React.useEffect(() => {
        socket.on("set-sub-ans", msg => {
            setSubAns(msg.subAns);
        });

        socket.on("set-player-status", msg => {
            console.log("set-player-status", msg);
            setPlayerAnswered(prev => {
                const nObj = {...prev};
                nObj[msg.pos] = msg.status;
                return nObj;
            });
        });

    }, [socket]);

    // const revealAnswer = (answer, id) => {
    //     props.revealAnswer(answer);
    //     setChosenPlayer(id);
    // }


    const content = React.useMemo(() => Object.keys(playerAnswered ?? {}).map((key, id) => {
        return <AnswersContainer key={id} id={id} nAns={question.nAns} playerAnswer={playerAnswers[key]} selectedAnswer={false} />
    }).filter(el => el !== null), [question, playerAnswered, playerAnswers]);


    return (
        <>
            <div className="czarQCont">
                <Question card={question} setAns={setAns} divClass="czarQ" />
                <div className="czarBut">Select</div>
            </div>
            <Menu time={time} pos="left" ></Menu>
            <div className="czarSubAns" >
                {content}
            </div>
        </> 
    );
}

export default CzarView;