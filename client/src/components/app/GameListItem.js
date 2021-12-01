import React from "react";

export default function GameListItem({ meta, handleJoin }) {
    return (
        <div className="game-item" >
            <div className="game-item-title-container">
                <div className="game-item-title">{meta.name}</div>
                <button className="button game-item-button" onClick={() => handleJoin(meta)} >Join</button>
            </div>
            <div className="divider full centered-in-flex" />
            <div className="game-item-info">
                <div className="game-item-info-title">Game Rules:</div>
                <div className="game-item-info-item">Decks: {meta.decks.join(" & ")}</div>
                <div className="game-item-info-item">Time per Round: 90 seconds</div>
                <div className="game-item-info-item">Points per Win: 10 points</div>
                <div className="game-item-info-item">Hand size: 10 cards</div>
            </div>
        </div>
    );
}