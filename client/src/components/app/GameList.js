import React from "react";
import axios from "axios";
import GameListItem from "./GameListItem";

export default function GameList({ handleJoin, errorOpen, baseURL }) {

    const [gameList, setGameList] = React.useState([]);

    React.useEffect(() => {
        axios.get(`${baseURL}api/game-list`).then(res => {
            setGameList(res.data);
        }).catch(() => setGameList([]));
    }, [baseURL]);

    return (
        <div className={`main-menu-games-container ${errorOpen ? "shrunk" : ""}`}>
            <div className="game-list" >
                {gameList.map((el, id) => <GameListItem key={id} meta={el} handleJoin={handleJoin} />)}
            </div>
        </div>
    )
}