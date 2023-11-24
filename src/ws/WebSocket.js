import { WS_URL } from "../lib/constants";

class WebSocketInstance {
    constructor() {
        this.socket = null;
        this.onNewRound = null;
        this.onGameOver = null;
        this.onResult = null;
        this.onRoomCreated = null;
        this.onJoinedRoom = null;
        this.onInvalidRoom = null;
        this.onTurnSwitch = null;
        this.resetting = false;
        this.onUniversalRestart = null;

        this.socket = new WebSocket(WS_URL);

        this.socket.onopen = () => {
            console.log("WebSocket connected");
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        };

        this.socket.onclose = () => {
            console.log("WebSocket closed");
        };
    }

    handleMessage(message) {
        switch (message.type) {
            case "incorrectGuess":
                if (this.onNewRound) {
                    this.onNewRound(message.guesses, message.topic);
                }
                break;
            case "gameOver":
                if (this.onGameOver) {
                    this.onGameOver();
                }
                break;
            case "win":
                if (this.onResult) {
                    this.onResult(message.type, message.topic);
                }
                break;
            case "lose":
                if (this.onResult) {
                    this.onResult(message.type, message.topic);
                }
                break;
            case "roomCreated":
                if (this.onRoomCreated) {
                    this.onRoomCreated(message.roomId);
                }
                break;
            case "joinedRoom":
                if (this.onJoinedRoom) {
                    this.onJoinedRoom(message.roomId);
                }
                break;
            case "invalidRoom":
                if (this.onInvalidRoom) {
                    this.onInvalidRoom();
                }
                break;
            case "restart":
                if (this.onRestart) {
                    this.onRestart(message.roomId);
                }
                break;

            case "notYourTurn":
                if (this.wrongTurn) {
                    this.wrongTurn(message.type);
                }
                break;
            case "universalRestart":
                if (this.onUniversalRestart) {
                    this.onUniversalRestart();
                }
                break;
            case "turnNotification":
                if (this.onTurnNotification) {
                    this.onTurnNotification(message.isYourTurn);
                }
                break;
            default:
                break;
        }
    }

    sendGuess(roomId, guess, guesses) {
        const message = {
            type: "guess",
            roomId,
            guess,
            guesses,
        };
        this.send(JSON.stringify(message));
    }

    createRoom() {
        const message = {
            type: "createRoom",
        };
        this.send(JSON.stringify(message));
    }

    joinRoom(roomId) {
        const message = {
            type: "joinRoom",
            roomId,
        };
        this.send(JSON.stringify(message));
    }

    onRestart(roomId) {
        const message = {
            type: "restart",
            roomId,
        };
        this.send(JSON.stringify(message));
    }

    onResult(resultString, topic) {}

    wrongTurn(message) {}

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            console.error("WebSocket connection not available");
        }
    }
}

const WebSocketExport = new WebSocketInstance();

export default WebSocketExport;
