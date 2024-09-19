import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [enigmesResolues, setEnigmesResolues] = useState(0);
  const [enigmesVues, setEnigmesVues] = useState([]);

  useEffect(() => {
    // Charger les données de l'utilisateur depuis le localStorage au démarrage
    const savedXP = localStorage.getItem('userXP');
    const savedLevel = localStorage.getItem('userLevel');
    const savedEnigmes = localStorage.getItem('enigmesResolues');
    const savedEnigmesVues = localStorage.getItem('enigmesVues');

    if (savedXP) setXP(parseInt(savedXP));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedEnigmes) setEnigmesResolues(parseInt(savedEnigmes));
    if (savedEnigmesVues) setEnigmesVues(JSON.parse(savedEnigmesVues));
  }, []);

  const incrementXP = (points) => {
    const newXP = xp + points;
    setXP(newXP);
    localStorage.setItem('userXP', newXP.toString());

    // Vérifier si l'utilisateur monte de niveau
    if (newXP >= level * 100) {
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem('userLevel', newLevel.toString());
    }
  };

  const enigmeResolue = () => {
    const newEnigmesResolues = enigmesResolues + 1;
    setEnigmesResolues(newEnigmesResolues);
    localStorage.setItem('enigmesResolues', newEnigmesResolues.toString());
    incrementXP(10);
  };

  const ajouterEnigmeVue = (enigmeId) => {
    const newEnigmesVues = [...enigmesVues, enigmeId];
    setEnigmesVues(newEnigmesVues);
    localStorage.setItem('enigmesVues', JSON.stringify(newEnigmesVues));
  };

  return (
    <UserContext.Provider value={{ 
      xp, 
      level, 
      enigmesResolues, 
      enigmesVues,
      enigmeResolue, 
      incrementXP,
      ajouterEnigmeVue
    }}>
      {children}
    </UserContext.Provider>
  );
};