const mockUseSpeechRecognition = () => ({
  transcript: '',
  listening: false,
  resetTranscript: jest.fn(),
  browserSupportsSpeechRecognition: true
});

const mockSpeechRecognition = {
  startListening: jest.fn(),
  stopListening: jest.fn(),
  abortListening: jest.fn()
};

export { mockUseSpeechRecognition as useSpeechRecognition };
export default mockSpeechRecognition;