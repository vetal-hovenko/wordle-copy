import React, { useEffect, useState } from "react";
import WebSocketExport from "../ws/WebSocket";
import { getColoredAnswer } from "../lib/getColoredAnswer";
import GuessInput from "./GuessInput";

const Game = ({ roomId }) => {
    const [guessInput, setGuessInput] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [winnerMessage, setWinnerMessage] = useState("");
    const [formattedGuesses, setFormattedGuesses] = useState([]);
    const [currentTopic, setCurrentTopic] = useState("");
    const [isYourTurn, setIsYourTurn] = useState(true);
    const [inputLength, setInputLength] = useState(0);

    useEffect(() => {
        WebSocketExport.onNewRound = (guessesFromSocket, topicFromSocket) => {
            setGuesses(guessesFromSocket);
            setCurrentTopic(topicFromSocket);
            setIsYourTurn(true);

            const newFormattedGuesses = guessesFromSocket.map((guess) =>
                getColoredAnswer(guess, topicFromSocket)
            );

            setFormattedGuesses([...newFormattedGuesses]);
        };

        WebSocketExport.onGameOver = () => {
            setGuessInput("");
        };

        WebSocketExport.onResult = (result, topic) => {
            setWinnerMessage(`You ${result}, Word: ${topic.toUpperCase()}`);
        };
        
        WebSocketExport.wrongTurn = (message) => {
            setIsYourTurn(message !== "notYourTurn");
        };

        WebSocketExport.onTurnNotification = (isYourTurn) => {
            setIsYourTurn(isYourTurn);
        };

        WebSocketExport.onUniversalRestart = () => {
            setWinnerMessage("");
            setGuesses([]);
            setFormattedGuesses([]);
            setCurrentTopic("");
            setIsYourTurn(true);
        };

        return () => {
            WebSocketExport.onNewRound = null;
            WebSocketExport.onGameOver = null;
            WebSocketExport.onTurnSwitch = null;
            WebSocketExport.onResult = null;
            WebSocketExport.onUniversalRestart = null;
            WebSocketExport.onTurnNotification = null;
            WebSocketExport.wrongTurn = null;
        };
    }, [currentTopic, guesses, formattedGuesses, isYourTurn, roomId]);

    const handleSendGuess = () => {
        setIsYourTurn(true);
        const trimmedGuess = guessInput.trim();

        if (trimmedGuess.length === 6 && isYourTurn) {
            const updatedGuesses = [...guesses, guessInput.trim()];

            WebSocketExport.sendGuess(
                roomId,
                guessInput.trim(),
                updatedGuesses
            );

            setGuessInput("");
        }
    };

    const handleRestart = () => {
        setWinnerMessage("");
        setGuesses([]);
        setFormattedGuesses([]);
        setCurrentTopic("");
        WebSocketExport.onRestart(roomId);
        setInputLength(0);
    };

    return (
        <div className="wordle-container">
            <h2>Make a guess</h2>

            <div className="game-container">
                {winnerMessage ? (
                    <h3>{winnerMessage}</h3>
                ) : (
                    <p>{`Length of the word: ${inputLength}/6`}</p>
                )}

                <GuessInput
                    winnerMessage={winnerMessage}
                    setGuessInput={setGuessInput}
                    setInputLength={setInputLength}
                    isYourTurn={isYourTurn}
                    handleSendGuess={handleSendGuess}
                    guessInput={guessInput}
                />

                {!!winnerMessage || (
                    <p>{
                        isYourTurn
                            ? "This is your turn"
                            : "Wait for your opponent to make a guess"
                    }</p>
                )}

                <ul className="guess-list">
                    {formattedGuesses.map((formattedGuess, index) => {
                        const uniqueKey = `${index}-${Date.now()}`;
                        return <li key={uniqueKey}>{formattedGuess}</li>;
                    })}
                </ul>
            </div>

            <button onClick={handleRestart} className="restart-button">
                Restart
            </button>
        </div>
    );
};

export default Game;
