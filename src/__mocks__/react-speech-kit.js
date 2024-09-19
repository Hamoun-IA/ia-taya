export const useSpeechSynthesis = () => ({
  speak: jest.fn(),
  voices: [],
  speaking: false,
  supported: true
});