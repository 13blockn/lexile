import React from 'react';

interface EndScreenProps {
  userWords: string[]
  totalWords: number
  onRestart: () => void
}
// Need to show all words on non-daily challenge
const EndScreen: React.FC<EndScreenProps> = ({ userWords, totalWords, onRestart }) => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Time's Up!</h2>
      <h3>You found {userWords.length} out of {totalWords} words.</h3>
      <div>
        <h4>Your Words:</h4>
        {userWords.length > 0 ? (
          userWords.map((word, index) => (
            <p key={index}>{word}</p>
          ))
        ) : (
          <p>No words found.</p>
        )}
      </div>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
}

export default EndScreen;
