import React from "react";

/**
 * Component that will render a Question card, showing it's blanks and selected answers 
 * @param {*} props 
 */
function Question(props) {
    
    let key = 0; // to use as key property;

    /**
     * Auxiliar function that creates a span either with a anser in blue or a blank in white
     * @param {string} ans 
     */
    const makeAnsDiv = (ans) => {
        if(ans) return <span key={key++} className="qAnswer">{ans}</span>
        else return <span key={key++} className="qText">_____</span>
    }

    /**
     * Auxiliar function that creates a span with the argument string inside
     * @param {string} que 
     */
    const makeQueDiv = (que) => {
        return <span key={key++} className="qText" >{que}</span>
    }

    // sets up the content
    const content = [];
    let count = 0; // to correctly iterate in selAns

    //if the card is set to begin with a blank it does so
    if(props.card.begin) {
        content.push(makeAnsDiv(props.selAns[0]));
        count++;
    }

    for(let elem of props.card.content) {
        content.push(makeQueDiv(elem)); // creates a span with the Question content
        if(count < props.card.nAns) content.push(makeAnsDiv(props.selAns[count++])); // if it should have a answer slot a span is created
    }

    // render
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