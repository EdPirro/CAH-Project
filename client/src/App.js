import React from "react";
import Game from "./components/game/Game";
import axios from "axios";

function App() {
    const [socket, setSocket] = React.useState(null);

    React.useEffect(() => {
        axios.get("http://localhost:8000/new-game").then(res => setSocket(res.data.socket))
    }, []);

    return (
        socket ? 
            <>
                <script src="/socket.io/socket.io.js"></script>
                <Game socket={socket}/> 
            </>:
            <div>Finding Game...</div>
    );
}


export default App;