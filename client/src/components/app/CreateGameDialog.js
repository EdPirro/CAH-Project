import React from "react";
import axios from "axios";

export default function CreateGameDialog({ show, onClose, baseURL, afterCreateCallback }) {
    const [playerName, setPlayerName] = React.useState("");
    const [gameRules, setGameRules] = React.useState({});
    const [error, setError] = React.useState({});
    const [selectedDecks, setSelectedDecks] = React.useState({ family: true });

    const generateCheckboxHandler = React.useMemo(() => type => () => {
        setError(prev => ({...prev, general: null, decks: null}));
        setSelectedDecks(prev => ({...prev, [type]: !prev[type] }));
    }, []);

    const generateHandler = React.useMemo(() => field => e => {
        const val = e.target.value;
        if(val.toString().length >= 20) setError(prev => ({...prev, general: null, [field]: "That's a looong name, try something smaller." }));
        else {
            setError(prev => ({ ...prev, general: null, [field]: null }));
            setGameRules(prev => ({ ...prev, [field]: val }));
        }
    }, []);

    const handlePlayerNameChange = React.useMemo(() => e => {
        const val = e.target.value;
        if(val.toString().length >= 20) setError(prev => ({...prev, general: null, playerName: "That's a looong name, try something smaller."}));
        else {
            setError(prev => ({ ...prev, general: null, playerName: null }));
            setPlayerName(val);
        }
    }, []);

    const handleSubmit = React.useMemo(() => () => {
        if(Object.keys(error).some(el => error[el])) return setError(prev => ({...prev, general: "There are some issues with the inserted data, you may want to fix them first."}));
        if(!gameRules.name) return setError({name: "We need a name to create the game..."});
        if(!playerName) return setError({playerName: "Excuse me, how may I call you?..."});

        const decks = Object.keys(selectedDecks).filter(el => selectedDecks[el]);
        if(!decks.length) return setError({ decks: "Can't play with no cards, can you?" });

        axios.post(`${baseURL}api/game`, { ...gameRules, decks }).then(res => {
            afterCreateCallback(res.data, playerName);
        }).catch(e => {
            console.log(e);
            if(e.response.status === 400)
                setError({ general: e.response.data });
            else setError({ general: "Sorry, what did you ask? (Unknown error, please try again.)"});
        });

    }, [error, gameRules, selectedDecks, afterCreateCallback, baseURL, playerName]);

    return (
        !show ? 
            null
            :
            <div className="fullscreen fixed" onClick={() => onClose && onClose() }>
                <div className="dialog" onClick={e => e.stopPropagation() }>
                    <div className="dialog-title">Create New Game</div>
                    <div className="dialog-content">

                        {error.general && <div className="error">{error.general}</div>}  

                        {/* Player name input */}
                        <div className="dialog-content-title">Player Name</div>
                        <input className="dialog-input" type="text" onChange={handlePlayerNameChange} value={playerName} placeholder="Pick a nickname" />
                        {error.playerName && <div className="error">{error.playerName}</div>}
                        <div className="divider"></div> 

                        {/* Game name input */}
                        <div className="dialog-content-title">Game Name</div>
                        <input className="dialog-input" type="text" onChange={generateHandler("name")} value={gameRules?.name ?? ""} placeholder="Enter Game Name" />
                        {error.name && <div className="error">{error.name}</div>}
                        <div className="divider"></div>

                        {/* Deck selection combobox */}
                        <div className="dialog-content-title">Deck</div>
                        {error.decks && <div className="error">{error.decks}</div>}
                        <div className="dialog-combobox"> 

                            <div className="dialog-checkbox-pair">
                                <input 
                                    type="checkbox" 
                                    id="family"
                                    checked={selectedDecks["family"] ?? false} 
                                    onChange={generateCheckboxHandler("family")}
                                />
                                <label htmlFor="family">Family Edition Set (censored)</label>
                            </div>

                            <div className="dialog-checkbox-pair">
                                <input 
                                    type="checkbox" 
                                    id="standard"
                                    value="Standard Base Set (uncensored)" 
                                    checked={selectedDecks["standard"] ?? false} 
                                    onChange={generateCheckboxHandler("standard")}
                                />
                                <label htmlFor="standard">Standard Set (uncensored)</label>
                            </div>
                            More to come maybe...
                        </div>
                        <div className="divider"></div>

                        {/* Other rules shall be added here */}
                        <div className="dialog-content-title">More rules will be added Soon&trade;</div>
                    </div>
                    <div className="dialog-actions">
                        <button className="dialog-button negative" onClick={onClose} >
                            Cancel
                        </button>
                        <button className="dialog-button" onClick={handleSubmit} >
                            Create Game
                        </button>
                    </div>
                </div>
            </div>
    )
}