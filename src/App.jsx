import React, { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_COLOR = '#439A86';

// Reusable Child Component: Box
function Box({ color, onClick }) {
  return (
    <div 
      className="box" 
      style={{ backgroundColor: color }} 
      onClick={onClick}
    />
  );
}

// Helper function to randomly shuffle an array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Parent Component: App
export default function App() {
  const paletteSequence = [
    '#FF1493', // 1. Pink
    '#1E90FF', // 2. Blue
    '#DC143C', // 3. Red
    '#FF7F50', // 4. Orange
    '#00FFFF', // 5. Cyan
    '#32CD32', // 6. Green
    '#ADFF2F', // 7. Lime
    '#FFD700', // 8. Yellow
    '#8A2BE2'  // 9. Purple
  ];

  // Hidden colors array (shuffled randomly on start)
  const [hiddenColors, setHiddenColors] = useState(() => shuffleArray(paletteSequence));

  // Current sequence step (0 to 8)
  const [currentStep, setCurrentStep] = useState(0);

  // Visible color for each square on screen
  const [visibleColors, setVisibleColors] = useState(Array(9).fill(DEFAULT_COLOR));

  // Handle clicking a grid box
  const handleBoxClick = (index) => {
    // Ignore click if box is already revealed
    if (visibleColors[index] !== DEFAULT_COLOR) return;

    const clickedHiddenColor = hiddenColors[index];
    const expectedColor = paletteSequence[currentStep];

    if (clickedHiddenColor === expectedColor) {
      // CORRECT GUESS: Reveal color & advance step
      const updatedVisible = [...visibleColors];
      updatedVisible[index] = clickedHiddenColor;
      setVisibleColors(updatedVisible);

      setCurrentStep((prev) => prev + 1);
    } else {
      // WRONG GUESS: Show wrong color briefly, then reset ALL boxes back to default!
      const wrongAttempt = [...visibleColors];
      wrongAttempt[index] = clickedHiddenColor;
      setVisibleColors(wrongAttempt);

      setTimeout(() => {
        // Reset visible board back to teal & start sequence over from Pink
        setVisibleColors(Array(9).fill(DEFAULT_COLOR));
        setCurrentStep(0);
        // Note: hiddenColors are NOT reshuffled here so player can memorize locations
      }, 500);
    }
  };

  // Win condition: Triggers ONLY when all 9 colors are successfully completed
  useEffect(() => {
    if (currentStep === paletteSequence.length) {
      setTimeout(() => {
        alert('Good job!');
        // Full Reset: Clear board, reset sequence, and RESHUFFLE hidden colors for a new game
        setVisibleColors(Array(9).fill(DEFAULT_COLOR));
        setCurrentStep(0);
        setHiddenColors(shuffleArray(paletteSequence));
      }, 200);
    }
  }, [currentStep]);

  return (
    <div className="container">
      {/* Top Palette Bar (Reference Sequence) */}
      <div className="palette">
        {paletteSequence.map((color, index) => (
          <div 
            key={index} 
            className={`palette-swatch ${index === currentStep ? 'active-target' : ''}`}
            style={{ backgroundColor: color }} 
          />
        ))}
      </div>

      {/* 3x3 Grid of Reusable Box Components */}
      <div className="grid">
        {visibleColors.map((color, index) => (
          <Box 
            key={index} 
            color={color} 
            onClick={() => handleBoxClick(index)} 
          />
        ))}
      </div>
    </div>
  );
}