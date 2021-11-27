import React from "react";


/**
 * React Component to render an answer
 * A answer card will always have a fixed size (174 x 214) and will overlap each other to fit on screen.
 * Upon hovering it will increase its size and set its content to the Question card's next blank.
 */
function Answer({ pos, overlap, tryAnswer, unTryAnswer, setAnswer, unSetAnswer, noResize, card, cardElem, size, hidden }) {
    const [clicked, setClicked] = React.useState(false);
    const ref = React.useRef(); // ref to get div's attributes

    const [style, normalLeft] = React.useMemo(() => {
        if(!overlap) return [{}, 0];

        const nl = pos ? size + ((pos - 1) * (size - overlap)) - overlap : 0;
        const left = pos ? nl : 0;
    
        return [{
            left: `${left}px`,
            position: "absolute",
            zIndex: -pos
        }, nl]
    }, [pos, size, overlap]);

    /**
     * function to handle onMouseOver event, will reposition and grow the card's display
     * and send it's content to the props.tryAnswer[0](), a functions that will print the
     * content to the Question card's next blank (defined at Game.js)
     */
    const handleOver = React.useMemo(() => () => {
        ref.current.style.left = `${normalLeft - 10}px`;
        ref.current.style.top  = "-10px";
        ref.current.style.height = "220px";
        ref.current.style.width = "190px";
        ref.current.style.zIndex = 1;
        if(tryAnswer) tryAnswer(cardElem)
    }, [tryAnswer, cardElem, normalLeft]);

    /**
     * function to handle onMouseOut event, will reposition and normalize the card's display
     * and run props.tryAnswer[1](), a functions that will remove the crad's content of the 
     * Question card's blank (defined at Game.js)
     */
    const handleOut = React.useMemo(() => () => {
        ref.current.style.left = `${normalLeft}px`;
        ref.current.style.top  = "";
        ref.current.style.zIndex = -pos;
        ref.current.style.height = "200px";
        ref.current.style.width = "170px";
        if(unTryAnswer) unTryAnswer(cardElem)
    }, [unTryAnswer, cardElem, normalLeft, pos]);

    const handleClick = React.useMemo(() => e => {
        if(e.defaultPrevented || !setAnswer) return;
        setAnswer(cardElem);
        handleOut();
        setClicked(true);
        e.preventDefault();
    }, [setAnswer, cardElem, handleOut]);

    const handleUnClick = React.useMemo(() => e => {
        if(e.defaultPrevented || !unSetAnswer) return;
        unSetAnswer(cardElem);
        setClicked(false);
        handleOver();
        e.preventDefault();
    }, [unSetAnswer, cardElem, handleOver]);

    // render
    return (
        hidden ? 
            <div className="answer hiddenAnswer" style={style} ref={ref}> 
                CAH
            </div>
            :
            Boolean(clicked || !card?.content) ? 
                <div className="answer cover" onClick={handleUnClick} style={style} ref={ref}>
                    {card?.content ?? "CAH"}
                </div>
                :
                <div className="answer" onMouseOver={handleOver} onMouseOut={handleOut} onClick={handleClick} style={style} ref={ref}>
                    {card.content}
                </div>
            
        
    );
}

export default Answer;
