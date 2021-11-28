import React from "react";
import Question from "./Question";
import AnswersContainer from "./AnswersContainer";


function CzarView({ socket, question, gameOver, czarPicksPhase, setAns, setAnswer }) {
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

    const handleClick = React.useMemo(() => () => {
        if((chosenPlayer ?? null) === null || gameOver) return;
        socket.emit("czar-pick", chosenPlayer);
        setChosenPlayer(null);
    }, [socket, chosenPlayer, gameOver]);

    const content = React.useMemo(() => 
        gameOver ?
            "Awarding points..."
            : czarPicksPhase ? 
                Object.keys(playersAnswers).map((player, id) => 
                    <AnswersContainer 
                        key={id}
                        nAns={question.nAns} 
                        playerAnswers={playersAnswers[player]} 
                        isChosenPlayer={chosenPlayer === player}
                        choosePlayer={() => {
                            setChosenPlayer(player);
                            setAnswer(playersAnswers[player]);
                        }}
                    />)
                : [...Array(cntPlayersAns).keys()].map(id => <AnswersContainer key={id} playerId={id} nAns={question.nAns} />) 
    , [question, cntPlayersAns, playersAnswers, chosenPlayer, czarPicksPhase, setAnswer, gameOver]);


    return (
        <>
            <div className="czarQCont">
                <Question card={question} setAns={setAns} divClass="czarQ" />
                <div 
                    hidden={gameOver}
                    className={`czarBut ${(chosenPlayer ?? null) === null ? "disabled" : ""}`}
                    role="button" 
                    aria-disabled={(chosenPlayer ?? null) === null} 
                    onClick={handleClick} 
                >
                    Select
                </div>
            </div>
            <div className="czarSubAns" >
                {content}
            </div>
        </> 
    );
}

export default CzarView;