import React from "react";
import Answer from "./Answer";

const cardSize = 174;//px


function Hand(props) {
    const [width, setWidth] = React.useState(0);

    const handleResize = () => {
        setWidth(window.innerWidth * 0.98);
    }

    React.useEffect(() => {
        setWidth(window.innerWidth * 0.98);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handSize = props.cards.length;

    let offset = undefined;
    if(width < (cardSize * handSize)) offset = ((cardSize * handSize) - width) / (handSize - 1);

    const content = props.cards.map((card, id) => <Answer card={card} key={id} pos={id} handSize={handSize} offset={offset} tryAnswer={props.tryAnswer} /> ); 
    return (
        <>
            <div className="hand">{content}</div>
        </>
    )
}

export default Hand;