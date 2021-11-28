import React from "react";
import Question from "./Question";
import Menu from "./Menu";
import AnswersContainer from "./AnswersContainer";


function CzarView({ socket, question, time, czarPicksPhase, setAns, setAnswer }) {
    const [chosenPlayer, setChosenPlayer] = React.useState(null); // select the player chosen by the czar
    const [cntPlayersAns, setCntPlayersAns] = React.useState(0); // count the number of players that have answered
    const [playersAnswers, setPlayersAnswers] = React.useState({}); // the answers of each player
    // const [subAns, setSubAns] = React.useState([]);

    React.useEffect(() => {

        // socket.on("set-sub-ans", msg => {
        //     setSubAns(msg.subAns);
        // });

        socket.on("set-player-ans-cnt", cnt => {
            console.log("set-player-ans-cnt", cnt);
            setCntPlayersAns(cnt);
        });

        socket.on("players-answers", ans => {
            console.log("players-answers", ans);
            setPlayersAnswers(ans);
        });

    }, [socket]);

    // const revealAnswer = (answer, id) => {
    //     setChosenPlayer(id);
    // }

    const content = React.useMemo(() => 
        czarPicksPhase ? 
            Object.keys(playersAnswers).map((player, id) => 
                <AnswersContainer 
                    key={id} 
                    playerId={player} 
                    nAns={question.nAns} 
                    playerAnswers={playersAnswers[player]} 
                    isChosenPlayer={chosenPlayer === player}
                    choosePlayer={() => {
                        setChosenPlayer(player)
                        setAnswer(playersAnswers[player]);
                    }}
                />)
            : [...Array(cntPlayersAns).keys()].map(id => <AnswersContainer key={id} playerId={id} nAns={question.nAns} />) 
    , [question, cntPlayersAns, playersAnswers, chosenPlayer, czarPicksPhase]);


    return (
        <>
            <div className="czarQCont">
                <Question card={question} setAns={setAns} tryAns={tryAns} divClass="czarQ" />
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