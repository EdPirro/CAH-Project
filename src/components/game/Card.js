import React from "react";

let key = 0;
// amount of answers per question is limited to 2.
function Card(props) {
    const makeAnsDiv = (ans) => {
        if(ans) return <span key={key++} className="qAnswer">{ans}</span>
        else return <span key={key++} className="qText">_____</span>
    }

    const makeQueDiv = (que) => {
        return <span key={key++} className="qText" >{que}</span>
    }

    let divClass = "";
    const content = [];
    if(props.card.nAns === 0) {
        divClass = "answer";
        content.push(props.card.content[0]);
    } else {
        divClass = "question";
        let count = 0;
        if(props.card.begin) {
            content.push(makeAnsDiv(props.selAns[0]));
            count++;
        }
        for(let elem of props.card.content) {
            content.push(makeQueDiv(elem));
            if(count < props.card.nAns) content.push(makeAnsDiv(props.selAns[count++]));
        }
    }


    return (
        <>
            <link rel="stylesheet" type="text/css" href="styles/card.css" />
            <div className={divClass}><p>{content}</p></div>
        </>
    )
}

export default Card;