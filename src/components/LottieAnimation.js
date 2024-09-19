import React from 'react';
import Lottie from 'lottie-react';

function LottieAnimation({ animationData, width, height }) {
  return (
    <Lottie 
      animationData={animationData} 
      style={{ width, height }}
    />
  );
}

export default LottieAnimation;