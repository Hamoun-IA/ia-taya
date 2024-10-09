import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Lightbulb, AlignJustify, HelpCircle, MessageCircle, Settings } from "lucide-react";
import Glitter from './Glitter';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [hoverColor, setHoverColor] = useState('');

  const navigate = useNavigate();

  const handleButtonClick = useCallback((buttonName) => {
    setSelectedButton(buttonName);
    console.log(`${buttonName} cliqué`);
    if (buttonName === 'Parler') {
      navigate('/character-selection');
    }
  }, [navigate]);

  const handleButtonHover = useCallback((color) => {
    setHoverColor(color);
  }, []);

  const ButtonLink = useCallback(({ to, className, onClick, onHover, icon, children }) => (
    <Link
      to={to}
      className={`w-full h-16 text-xl font-semibold transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full flex items-center justify-center ${className} ${selectedButton === children ? 'ring-4 ring-white' : ''}`}
      onClick={() => onClick(children)}
      onMouseEnter={() => onHover(className.split(' ')[0])}
      onMouseLeave={() => onHover('')}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  ), [selectedButton]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${hoverColor}`}>
      <Glitter />
      <h1 className="text-7xl font-bold mb-8 text-center animate-wobble font-comic-sans tracking-wide">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-pulse">
          MENU TAYA
        </span>
      </h1>
      
      <div className="space-y-4 w-full max-w-md">
        <ButtonLink 
          to="/quiz"
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
          onClick={handleButtonClick}
          onHover={handleButtonHover}
          icon={<Brain className="h-6 w-6" />}
        >
          Quiz
        </ButtonLink>
        
        <ButtonLink 
          to="/enigme"
          className="bg-green-400 hover:bg-green-500 text-green-900"
          onClick={handleButtonClick}
          onHover={handleButtonHover}
          icon={<Lightbulb className="h-6 w-6" />}
        >
          Enigme
        </ButtonLink>
        
        <ButtonLink 
          to="/syllabes"
          className="bg-red-400 hover:bg-red-500 text-red-900"
          onClick={handleButtonClick}
          onHover={handleButtonHover}
          icon={<AlignJustify className="h-6 w-6" />}
        >
          Syllabes
        </ButtonLink>
        
        <ButtonLink 
          to="/cest-quoi"
          className="bg-blue-400 hover:bg-blue-500 text-blue-900"
          onClick={handleButtonClick}
          onHover={handleButtonHover}
          icon={<HelpCircle className="h-6 w-6" />}
        >
          C'est quoi ?
        </ButtonLink>
        
        <ButtonLink 
          to="/character-selection"
          className="bg-pink-400 hover:bg-pink-500 text-pink-900"
          onClick={handleButtonClick}
          onHover={handleButtonHover}
          icon={<MessageCircle className="h-6 w-6" />}
        >
          Parler
        </ButtonLink>
        
        <ButtonLink 
          to="/options"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          onClick={handleButtonClick}
          onHover={handleButtonHover}
          icon={<Settings className="h-6 w-6" />}
        >
          Options
        </ButtonLink>
      </div>
    </div>
  );
}

export default MainMenu;