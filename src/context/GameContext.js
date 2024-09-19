import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [enigmesResolues, setEnigmesResolues] = useState(0);

  const incrementScore = (points) => {
    setScore(prevScore => prevScore + points);
    if (score + points >= level * 100) {
      setLevel(prevLevel => prevLevel + 1);
    }
  };

  const enigmeResolue = () => {
    setEnigmesResolues(prev => prev + 1);
    incrementScore(10);
  };

  return (
    <GameContext.Provider value={{ score, level, enigmesResolues, enigmeResolue }}>
      {children}
    </GameContext.Provider>
  );
};