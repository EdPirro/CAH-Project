import React from "react";
import Answer from "./Answer";

const cardSize = 194;

function AnswersContainer(props) {
    const [width, setWidth] = React.useState(0.0);

    const handleResize = () => {
        setWidth(window.innerWidth * 0.18);
    }

    React.useEffect(() => {
        setWidth(window.innerWidth * 0.18);
        window.addEventListener("resize", handleResize);

        return () => {window.removeEventListener("resize", handleResize);}
    }, []);

    const clickHandle = () => {
        props.revealAnswer(props.player);
    }

    const nCards = props.player.cards.length;

    let overlap = null
    if(width < (nCards * cardSize)) overlap = (((nCards * cardSize) - width) / (nCards - 1));


    let content;

    content = props.player.cards.map((v, id) => <Answer 
                                                    card={{content: v}} 
                                                    size={cardSize} 
                                                    key={id} 
                                                    pos={id} 
                                                    overlap={overlap} 
                                                    noResize={true}
                                                    hidden={!props.show}
                                                    />);
   

    return (
        <div className="czarAnsCont scrollbar" onClick={clickHandle}>
            {content}
        </div> 
    )
}

export default AnswersContainer;