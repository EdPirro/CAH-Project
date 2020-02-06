import React from "react";

const cardSize = 174;//px

function Answer(props) {
    const ref = React.useRef();

    const handleOver = () => {
        ref.current.style.left = `${normalLeft - 10}px`;
        ref.current.style.top  = "-10px";
        ref.current.style.zIndex = 1;
        ref.current.classList.add("grown");
        props.tryAnswer[0](props.card.content)
    };
    const handleOut = () => {
        ref.current.style.left = `${normalLeft}px`;
        ref.current.style.top  = "";
        ref.current.style.zIndex = -props.pos;
        ref.current.classList.remove("grown");
        props.tryAnswer[1]()
    };

    let normalLeft = 0;

    let style = {};
    if(props.offset) {
        let left = "";
        if(!props.pos) left = "0px"; 
        else {
            normalLeft = (cardSize + ((props.pos - 1) * (cardSize - props.offset))) - props.offset;
            left = `${normalLeft}px`;
        };
        style = {
            position:   "absolute",
            left:       left,
            zIndex:     -props.pos
        }
        
    }


    return (
        <div className="answer" onMouseOver={handleOver} onMouseOut={handleOut} style={style} ref={ref}>
            {props.card.content}
        </div>
    );
}

export default Answer;
