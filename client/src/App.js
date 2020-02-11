import React from "react";
import Game from "./components/game/Game";
import axios from "axios";

const url = "http://localhost:8000/";

function App() {
    const [namespace, setNamespace] = React.useState(null);

    React.useEffect(() => {
        axios.get(url + "new-game").then(res => setNamespace(res.data.namespace))
    }, []);

    return (
        namespace ? 
            <>
                <Game url={url + namespace}/> 
            </>:
            <div>Finding Game...</div>
    );
}


export default App;