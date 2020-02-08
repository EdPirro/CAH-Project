import React from "react";
import Answer from "./Answer";

function SubmittedAnswers(props) {
    const [revealed, setRevealed] = React.useState(false);

    const clickHandle = e => {
        if(e.defaultPrevented) return;
        revealed ? props.hideAnswer() : props.revealAnswer(["a", "b", "c"]); 
        setRevealed(!revealed);
        e.preventDefault();
    }

    return <div className="czarTemp" onClick={clickHandle}>
        <Answer card={{ content: "a" }}/>
        <Answer card={{ content: "a" }}/>
        <Answer card={{ content: "a" }}/>
    </div>
}

export default SubmittedAnswers;