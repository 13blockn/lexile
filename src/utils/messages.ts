export const getWordLengthMessage = (wordLength: number): string => {
  if (wordLength <= 4) {
    return "Good start!";
  }
  
  switch (wordLength) {
    case 5:
      return "Nice one!";
    case 6:
      return "Great find!";
    case 7:
      return "Excellent word!";
    case 8:
      return "Impressive!";
    case 9:
      return "Outstanding!";
    default:
      return "Spectacular! 🌟";
  }
}; 