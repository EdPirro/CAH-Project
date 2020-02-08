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

    return (
        hidden ?
            <div className="mHid" onClick={() => setHidden(false)} >
                I
            </div>
        :
        <div className="menu scrollbar">
            <div className="mTop">
                <button className="mBut" onClick={() => setHidden(true)} >></button>
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
            <div className="tCont">
                Remaining time:
                <div >{props.time}s</div>
            </div>
        </div>
    )
}

export default Menu;