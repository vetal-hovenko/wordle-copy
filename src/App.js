import { useState } from 'react';
import './App.css';
import Game from './components/Game';

import RoomPicker from './components/RoomPicker';
import WebSocketInstance from './ws/WebSocket';
import HomePageHeader from './components/HomePageHeader';

function App() {
    const [isRoomPicked, setIsRoomPicked] = useState(false);
    const [roomId, setRoomId] = useState('');
    const disconnect = () => {
        WebSocketInstance.onGameOver();
        setIsRoomPicked(false);
        setRoomId('');
    };

    return (
        <main className='main-container'>
            {!isRoomPicked && <HomePageHeader />}
            <RoomPicker
                isRoomPicked={isRoomPicked}
                roomId={roomId}
                setRoomId={setRoomId}
                setIsRoomPicked={setIsRoomPicked}
            />
            {isRoomPicked && (
                <>
                    <button onClick={disconnect} className='leave-button'>
                        Leave the room
                    </button>
                    <Game roomId={roomId} />
                </>
            )}
        </main>
    );
}

export default App;
