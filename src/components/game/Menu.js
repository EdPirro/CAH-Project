import React from "react";

function Menu(props) {
    const [hidden, setHidden] = React.useState(true);
    React.useEffect(() => {
        window.addEventListener("keydown", keyDownHandle);
        window.addEventListener("keyup", keyUpHandle)

        return(() => {
            window.removeEventListener("keydown", keyDownHandle)
            window.removeEventListener("keyup", keyUpHandle);
        })
    }, []);

    const keyDownHandle = e => {
        if(e.defaultPrevented) return;
        if(e.key === "i") setHidden(false);
    }

    const keyUpHandle = e => {
        if(e.defaultPrevented) return;
        if(e.key === "i") setHidden(true);
    }

    const style = props.pos === "right" ? {right: "0px"} : {left: "0px"}

    return (
        hidden ?
            <div className="mHid" style={style} onClick={() => setHidden(false)} >
                I
            </div>
        :
        <div className="menu scrollbar" style={style}>
            <div className={` mTop ${props.pos === "right" ? "mEnd" : "mStart"}`}>
                <button className="mBut" onClick={() => setHidden(true)} ><strong>^</strong></button>
            </div>
            <div className="pCont">
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
                <div className="pStat"></div>
            </div>
            {props.time !== undefined && <div className="tCont">
                Remaining time:
                <div >{props.time}s</div>
            </div>}
        </div>
    )
}

export default Menu;