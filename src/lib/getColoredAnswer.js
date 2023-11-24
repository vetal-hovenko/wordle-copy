export function getColoredAnswer(word, currentTopic) {
    const coloredAnswer = word
        .trim()
        .split("")
        .map((char, index) => {
            const token = currentTopic.charAt(index);
            const isCorrect = char === token;
            const isIncorrectButPresent = !isCorrect && currentTopic.includes(char);

            let spanClass = "letter";
            if (isCorrect) {
                spanClass += " correct";
            } else if (isIncorrectButPresent) {
                spanClass += " misplaced"; 
            } else {
                spanClass += " incorrect";
            }

            const uniqueKey = `${index}-${char}-${Date.now()}`;
            return (
                <span key={uniqueKey} className={spanClass}>
                    {char}
                </span>
            );
        });

    return coloredAnswer;
}
