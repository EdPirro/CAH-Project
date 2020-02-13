import React from "react";

/**
 * Component that will render a Question card, showing it's blanks and selected answers 
 * @param {*} props 
 */
function Question(props) {

    let tryAns = props.tryAns; // 
    let key = 0; // to use as key property;

    /**
     * Auxiliar function that creates a span with the argument string inside
     * @param {string} que 
     */
    const makeAnsDiv = (ans) => {
        return <span key={key++} className="qAnswer">{ans}</span>
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
    let count = 0; // to correctly iterate in setAns

    //if the card is set to begin with a blank it does so
    if(props.card.begin) {
        if(props.setAns[0]) content.push(makeAnsDiv(props.setAns[0].card.content)); //if there's a answer already set it is used
        else if(tryAns) {
            content.push(makeAnsDiv(tryAns.card.content));  // if there isn't a set answer and tryAnswer is set it's used
            tryAns = null;
        }
        else content.push(makeQueDiv("_____")); // if neither a try or a set Answer exists a blank is inserted
        count++;
    }

    for(let elem of props.card.content) {
        content.push(makeQueDiv(elem)); // creates a span with the Question content
        if(count < props.card.nAns) {
            if(props.setAns[count]) content.push(makeAnsDiv(props.setAns[count].card.content)); //if there's a answer already set it is used
            else if(tryAns) {
                content.push(makeAnsDiv(tryAns.card.content));  // if there isn't a set answer and tryAnswer is set it's used
                tryAns = null;
            }
            else content.push(makeQueDiv("_____")); // if neither a try or a set Answer exists a blank is inserted
            count++;
        }
    }

    // render
    return (
        <>
            <div className={`question ${props.divClass}`}>
                <p>{content}</p>
                {props.card.nAns > 1 && 
                    <div className="pickTwo">{props.card.nAns}</div>
                }
            </div>
            
        </>
    )
}

export default Question;