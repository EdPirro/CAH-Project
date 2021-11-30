import React from "react";
import Game from "./components/game/Game";
import CreateGameDialog from "./components/app/CreateGameDialog";
import GameList from "./components/app/GameList";
import "./styles/game.css";

const baseURL = "http://localhost:8000/";

function App() {
    const [gameName, setGameName] = React.useState(null);
    const [playerName, setPlayerName] = React.useState("");
    const [creatingGame, setCreatingGame] = React.useState(false);
    const [error, setError] = React.useState({});

    const afterCreateCallback = React.useMemo(() => (meta, pn) => {
        setGameName(meta.name);
        setPlayerName(pn);
    }, []);

    const handleJoin = React.useMemo(() => meta => {
        setGameName(meta.name);
    }, []);

    const handlePlayerNameChange = React.useMemo(() => e => {
        const val = e.target.value;
        if(val.toString().length >= 20) setError(prev => ({...prev, general: "That's a looong name, try something smaller."}));
        else {
            setError(prev => ({ ...prev, general: null }));
            setPlayerName(val);
        }
    }, []);

    return (
        Boolean(gameName && playerName) ?
            <Game url={baseURL + gameName} playerName={playerName} /> 
            :
            <>
                <CreateGameDialog 
                    show={creatingGame} 
                    onClose={() => setCreatingGame(false)} 
                    afterCreateCallback={afterCreateCallback} 
                    baseURL={baseURL} 
                />
                <div className="main-menu">
                    <div className="main-menu-input-container">
                        <input className="dialog-input" type="text" onChange={handlePlayerNameChange} value={playerName} placeholder="Pick a nickname to play" />
                        <button className="button" onClick={() => setCreatingGame(true)}>Create Game</button>
                    </div>
                    {error.general && <div className="main-menu-error">{error.general}</div>}
                    <GameList handleJoin={handleJoin} errorOpen={Boolean(error.general)} baseURL={baseURL} />
                </div>
                {/* <button className onClick={joinGame}>Join Game</button> */}
            </>
    );
}


export default App;