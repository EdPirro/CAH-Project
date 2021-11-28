import React from "react";

function Menu({ title, value, pos, offset="0px" }) {

    const style = React.useMemo(() => pos === "right" ? { right: offset } : { left: offset }, [pos, offset]);

    return ( 
        <div className="mHid" style={style} > 
            <div>{title}</div> 
            <div>{value}</div>
        </div>
    );
}

export default Menu;