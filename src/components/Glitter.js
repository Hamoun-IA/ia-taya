import React, { useEffect, useState } from 'react';

const Glitter = () => {
  const [glitters, setGlitters] = useState([]);

  useEffect(() => {
    const createGlitter = () => {
      const newGlitter = {
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        size: `${Math.random() * 5 + 2}px`,
      };
      setGlitters(prev => [...prev, newGlitter]);
    };

    const intervalId = setInterval(createGlitter, 300);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (glitters.length > 50) {
      setGlitters(prev => prev.slice(1));
    }
  }, [glitters]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      {glitters.map(glitter => (
        <div
          key={glitter.id}
          className="absolute bg-white rounded-full opacity-70"
          style={{
            left: glitter.left,
            width: glitter.size,
            height: glitter.size,
            animation: `fall ${glitter.animationDuration} linear forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default Glitter;