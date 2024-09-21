import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Lightbulb, AlignJustify, HelpCircle, MessageCircle, Settings } from "lucide-react";

function MainMenu() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [titleColor, setTitleColor] = useState('text-white');

  useEffect(() => {
    const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500'];
    const changeColor = () => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setTitleColor(randomColor);
    };
    const intervalId = setInterval(changeColor, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    console.log(`${buttonName} cliqué`);
  };

  const ButtonLink = ({ to, className, onClick, icon, children }) => (
    <Link
      to={to}
      className={`w-full h-16 text-xl font-semibold transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full flex items-center justify-center ${className} ${selectedButton === children ? 'ring-4 ring-white' : ''}`}
      onClick={() => onClick(children)}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex flex-col items-center justify-center p-4">
      <h1 className={`text-7xl font-bold ${titleColor} mb-8 text-center animate-wobble font-comic-sans tracking-wide transition-colors duration-500`}>
        MENU TAYA
      </h1>
      
      <div className="space-y-4 w-full max-w-md">
        <ButtonLink 
          to="/quiz"
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
          onClick={handleButtonClick}
          icon={<Brain className="h-6 w-6" />}
        >
          Quiz
        </ButtonLink>
        
        <ButtonLink 
          to="/enigme"
          className="bg-green-400 hover:bg-green-500 text-green-900"
          onClick={handleButtonClick}
          icon={<Lightbulb className="h-6 w-6" />}
        >
          Enigme
        </ButtonLink>
        
        <ButtonLink 
          to="/syllabes"
          className="bg-red-400 hover:bg-red-500 text-red-900"
          onClick={handleButtonClick}
          icon={<AlignJustify className="h-6 w-6" />}
        >
          Syllabes
        </ButtonLink>
        
        <ButtonLink 
          to="/cest-quoi"
          className="bg-blue-400 hover:bg-blue-500 text-blue-900"
          onClick={handleButtonClick}
          icon={<HelpCircle className="h-6 w-6" />}
        >
          C'est quoi ?
        </ButtonLink>
        
        <ButtonLink 
          to="/parler"
          className="bg-pink-400 hover:bg-pink-500 text-pink-900"
          onClick={handleButtonClick}
          icon={<MessageCircle className="h-6 w-6" />}
        >
          Parler
        </ButtonLink>
        
        <ButtonLink 
          to="/options"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          onClick={handleButtonClick}
          icon={<Settings className="h-6 w-6" />}
        >
          Options
        </ButtonLink>
      </div>
    </div>
  );
}

export default MainMenu;