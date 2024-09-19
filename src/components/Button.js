import React from 'react';

const Button = ({ children, className, disabled, onClick, type = 'button' }) => {
  const baseClasses = "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out";
  const enabledClasses = "hover:bg-opacity-80 active:bg-opacity-70";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const buttonClasses = `${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;