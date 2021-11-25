import React from "react";
import Question from "./Question";
import Menu from "./Menu";
import AnswersContainer from "./AnswersContainer";


function CzarView(props) {
    const [chosenPlayer, setChosenPlayer] = React.useState(null); // select the player chosen by the czar
    const [subAns, setSubAns] = React.useState([]);

    React.useEffect(() => {
        props.socket.on("set-sub-ans", msg => {
            setSubAns(msg.subAns);
        });

    }, [props.socket]);

    const revealAnswer = (answer, id) => {
        props.revealAnswer(answer);
        setChosenPlayer(id);
    }


    const content = subAns.map((ans, id) => {
        if(ans) return (<AnswersContainer 
                            key={id}
                            id={id}
                            answer={ans.answer} 
                            revealAnswer={revealAnswer}
                            show={id === chosenPlayer}
                        />);
        return null;
        }
    ).filter(el => el !== null);


    return (
        <>
            <div className="czarQCont">
                <Question card={props.question} setAns={props.setAns} divClass="czarQ" />
                <div className="czarBut">Select</div>
            </div>
            <Menu time={props.time} pos="left" ></Menu>
            <div className="czarSubAns" >
                {content}
            </div>
        </> 
    );
}

export default CzarView;