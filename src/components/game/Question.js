import React from "react";

// amount of answers per question is limited to 2.
function Question(props) {
    
    let key = 0;

    const makeAnsDiv = (ans) => {
        if(ans) return <span key={key++} className="qAnswer">{ans}</span>
        else return <span key={key++} className="qText">_____</span>
    }

    const makeQueDiv = (que) => {
        return <span key={key++} className="qText" >{que}</span>
    }

    const content = [];
    let count = 0;
    if(props.card.begin) {
        content.push(makeAnsDiv(props.selAns[0]));
        count++;
    }

    for(let elem of props.card.content) {
        content.push(makeQueDiv(elem));
        if(count < props.card.nAns) content.push(makeAnsDiv(props.selAns[count++]));
    }

    return (
        <>
            <div className="question">
                <p>{content}</p>
                {props.card.nAns === 2 && 
                    <div className="pickTwo">2</div>
                }
            </div>
            
        </>
    )
}

export default Question;