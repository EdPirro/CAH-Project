import React from "react";
import Card from "./Card";

function Game() {
    return (
        <>
            <link rel="stylesheet" type="text/css" href="styles/game.css" />
            <div className="main">
                <Card card={{nAns: 1, content: [" is the most arousing thing in the world."], begin: true}} selAns={['Richard Gere holding a banana']} />
                <div className="idk" >Cards Will go Here</div>
            </div>
        </>
    );
}

export default Game;