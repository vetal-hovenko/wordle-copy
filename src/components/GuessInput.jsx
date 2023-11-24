import React from "react";

const GuessInput = ({
    winnerMessage,
    isYourTurn,
    guessInput,
    setGuessInput,
    setInputLength,
    handleSendGuess,
}) => {
    return (
        <div className="wordle-input">
            <input
                disabled={!!winnerMessage || !isYourTurn}
                minLength={6}
                maxLength={6}
                type="text"
                placeholder="Guess..."
                value={guessInput}
                onChange={(e) => {
                    setGuessInput(e.target.value);
                    setInputLength(e.target.value.length);
                }}
            />
            <button
                disabled={!!winnerMessage || !isYourTurn}
                onClick={handleSendGuess}
            >
                Send
            </button>
        </div>
    );
};

export default GuessInput;
