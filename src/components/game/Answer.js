import React from "react";


/**
 * React Component to render an answer
 * A answer card will always have a fixed size (174 x 214) and will overlap each other to fit on screen.
 * Upon hovering it will increase its size and set its content to the Question card's next blank.
 * @param {*} props 
 */
function Answer(props) {
    const [clicked, setClicked] = React.useState(false);
    const ref = React.useRef(); // ref to get div's attributes


    const handleClick = () => {
        if(props.setAnswer[0](props.card.content)){
            handleOut();
            setClicked(true);
        }
    }

    const handleUnClick = () => {
        props.setAnswer[1](props.card.content);
        setClicked(false);
        handleOver();
    }

    /**
     * function to handle onMouseOver event, will reposition and grow the card's display
     * and send it's content to the props.tryAnswer[0](), a functions that will print the 
     * content to the Question card's next blank (defined at Game.js)
     */
    const handleOver = () => {
        ref.current.style.left = `${normalLeft - 10}px`;
        ref.current.style.top  = "-10px";
        ref.current.style.zIndex = 1;
        ref.current.style.height = "200px";
        ref.current.style.width = "170px";
        // ref.current.classList.add("grown");
        props.tryAnswer[0](props.card.content)
    };

    /**
     * function to handle onMouseOut event, will reposition and normalize the card's display
     * and run props.tryAnswer[1](), a functions that will remove the crad's content of the 
     * Question card's blank (defined at Game.js)
     */
    const handleOut = () => {
        ref.current.style.left = `${normalLeft}px`;
        ref.current.style.top  = "";
        ref.current.style.zIndex = -props.pos;
        ref.current.style.height = "180px";
        ref.current.style.width = "150px";
        props.tryAnswer[1]()
    };

    let normalLeft = 0; // will be used to correctly reposition the card upon hover

    // set card's overlap if necessary
    let style = {}; 
    if(props.overlap) {
        let left = "";
        if(!props.pos) left = "0px"; 
        else {
            normalLeft = (props.size + ((props.pos - 1) * (props.size - props.overlap))) - props.overlap;
            left = `${normalLeft}px`;
        };
        style = {
            position:   "absolute",
            left:       left,
            zIndex:     -props.pos
        }
    }

    // render
    return (
            clicked ? 
                <div className="answer cover" onClick={handleUnClick} style={style} ref={ref}>
                    {props.card.content}
                </div>
                :
                <div className="answer " onMouseOver={handleOver} onMouseOut={handleOut} onClick={handleClick} style={style} ref={ref}>
                    {props.card.content}
                </div>
            
        
    );
}

export default Answer;
