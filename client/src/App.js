import React from "react";
import Game from "./components/game/Game";
import axios from "axios";

const url = "http://localhost:8000/";

function App() {
    const [gameName, setGameName] = React.useState(null);
    const createdGamePos = React.useRef(null);

    const createGame = () => {
        axios.post(url + "game", { name: "Game" }).then( res => {
            createdGamePos.current = res.data.slot; // saves the created game slot
        });
    }

    const joinGame = () => {
        axios.get(url + "game", { params : { name: "Game" } }).then( res => {
            setGameName(res.data.name);
        });
    }

    const gameOver = () => {
        axios.delete(url + "game", {slot: createdGamePos})
        .then(res => setGameName(null));
    }

    return (
        gameName ? 
            <>
                <Game url={url + gameName} gameOver={gameOver}/> 
            </>:
            <div>
                <button onClick={createGame}>Create Game</button>
                <button onClick={joinGame}>Join Game</button>
            </div>
    );
}


export default App;