import React from 'react';

const Lottie = ({ animationData, width, height }) => (
  <div data-testid="lottie-animation" style={{ width, height }}>
    Mocked Lottie Animation
  </div>
);

Lottie.loadAnimation = jest.fn();

export default Lottie;