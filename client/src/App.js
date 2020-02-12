import React from "react";
import Game from "./components/game/Game";
import axios from "axios";

const url = "http://192.168.0.10:8000/";

function App() {
    const [namespace, setNamespace] = React.useState(null);

    const createGame = () => {
        axios.post(url + "game", {name: "Game"}).then( res => {
            setNamespace(res.data.namespace);
        });
    }

    const joinGame = () => {
        axios.get(url + "game", { params : { pos: 0 } }).then( res => {
            setNamespace(res.data.namespace);
        });
    }

    const gameOver = () => {
        setNamespace(null);
    }

    return (
        namespace ? 
            <>
                <Game url={url + namespace} gameOver={gameOver}/> 
            </>:
            <div>
                <button onClick={createGame}>Create Game</button>
                <button onClick={joinGame}>Join Game</button>
            </div>
    );
}


export default App;