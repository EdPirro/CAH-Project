import React from "react";
import Answer from "./Answer";

// define fixed card Size (194 = 170px(width) + 20(padding) + 4(border))
const cardSize = 194;//px

/**
 * React Component responsable for rendering the player's hand, that it every Answer Card he/she has.
 * It's also Hand's responsability to calculate a answer card's overlap to fit the windows's width.
 * @param {*} props 
 */
function Hand({ cards, tryAnswer, unTryAnswer, setAnswer, unSetAnswer }) {
    const [width, setWidth] = React.useState(0.0); // use width as state to re-render after resize.

    /**
     * Function to handle window's resize event, simply update width to be 97% of window's inner width.
     */
    const handleResize = () => {
        setWidth(window.innerWidth * 0.97);
    }

    // Upon mounting will add a listener to window's resize event.
    React.useEffect(() => {
        setWidth(window.innerWidth * 0.97);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); // Before unmount will remove window's event
        }
    }, []); // a empty dependency array will grant this to run only once

    // calculates card's overlap 
    const handSize = cards.length;
    let overlap = undefined;
    if(width < (cardSize * handSize)) overlap = ((cardSize * handSize) - width) / (handSize - 1);

    // creates a Answer component for each card in hand
    const content = cards.map(elem => 
        <Answer 
            cardElem={elem}
            card={elem.card} 
            key={elem.pos} 
            pos={elem.pos} 
            handSize={handSize} 
            overlap={overlap} 
            setAnswer={setAnswer}
            tryAnswer={tryAnswer}
            unSetAnswer={unSetAnswer}
            unTryAnswer={unTryAnswer}
            size={cardSize}
        /> 
    ); 

    // render
    return (
        <>
            <div className="hand" >{content}</div>
        </>
    )
}

export default Hand;