import React, { useEffect, useState } from 'react';
import WebSocketExport from '../ws/WebSocket';

const WebSocketHandlers = {
    handleRoomCreated: (roomId, setMessage, setIsRoomPicked) => {
        setMessage(`Room created with ID: ${roomId}`);
        setIsRoomPicked(true);
    },
    handleJoinedRoom: (roomId, setMessage, setIsRoomPicked) => {
        setMessage(`Joined room with ID: ${roomId}`);
        setIsRoomPicked(true);
    },
    handleInvalidRoom: (setMessage) => {
        setMessage('Invalid room or game already started.');
    },
};

const RoomPicker = ({ roomId, setIsRoomPicked, setRoomId, isRoomPicked }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        WebSocketExport.onRoomCreated = (roomId) => {
            WebSocketHandlers.handleRoomCreated(
                roomId,
                setMessage,
                setIsRoomPicked
            );

            setRoomId(roomId);
        };
        WebSocketExport.onJoinedRoom = (roomId) => {
            WebSocketHandlers.handleJoinedRoom(
                roomId,
                setMessage,
                setIsRoomPicked
            );
        };
        WebSocketExport.onInvalidRoom = () => {
            WebSocketHandlers.handleInvalidRoom(setMessage);
        };

        return () => {
            WebSocketExport.onRoomCreated = null;
            WebSocketExport.onJoinedRoom = null;
            WebSocketExport.onInvalidRoom = null;
        };
    }, [setIsRoomPicked, setRoomId]);

    const handleCreateRoom = () => {
        WebSocketExport.createRoom();
    };

    const handleJoinRoom = () => {
        WebSocketExport.joinRoom(roomId);
    };

    return (
        <div className="room-container">
            {!isRoomPicked ? (
                <>
            <button
                disabled={isRoomPicked}
                onClick={handleCreateRoom}
                className="create-room-button"
            >
                Create Room
            </button>

            {isRoomPicked || <p>Guests always begin</p>}

            <div className="join-room-container">
                <input
                    type='text'
                    placeholder='Enter Room ID'
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="room-input"
                />
                <button
                    disabled={isRoomPicked}
                    onClick={handleJoinRoom}
                    className="join-room-button"
                >
                    Join
                </button>
            </div>
                </>
            ) : (
                roomId && isRoomPicked && <p className="message">{message}</p>
            )}
        </div>
    );
};

export default RoomPicker;
