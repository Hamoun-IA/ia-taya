import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Mic, MicOff } from "lucide-react";
import Button from './Button';

const SYSTEM_PROMPT = `Tu es un assistant virtuel conçu pour expliquer des concepts à des enfants de 6 ans. 
Ton rôle est de répondre à leurs questions de manière très simple, avec des mots qu'un enfant de 6 ans peut comprendre. 
Utilise des comparaisons avec des choses qu'un enfant de cet âge connaît bien. 
Tes explications doivent être courtes, avec des phrases simples. 
Si une question est trop difficile ou pas adaptée, propose gentiment à l'enfant de parler d'autre chose.`;

function CestQuoiComponent() {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { speak, speaking, cancel, voices } = useSpeechSynthesis();

  const lireTexte = useCallback((texte) => {
    const voixFrancaise = voices.find(voice => voice.lang === 'fr-FR');
    speak({ text: texte, voice: voixFrancaise, onEnd: () => setIsPlaying(false) });
    setIsPlaying(true);
  }, [speak, voices]);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
      })
      .catch(err => console.error('Erreur d\'accès au microphone:', err));
  }, []);

  const draw = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (isRecording || isPlaying) {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        const sliceWidth = canvas.width / dataArrayRef.current.length;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const x = i * sliceWidth;
          const y = (dataArrayRef.current[i] / 255.0) * canvas.height / 2;
          ctx.lineTo(x, canvas.height / 2 - y);
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgb(0, 125, 255)';
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.strokeStyle = 'rgb(200, 200, 200)';
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [isRecording, isPlaying]);

  useEffect(() => {
    initAudio();
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [initAudio, draw]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (transcript && !isRecording) {
      handleSubmit(transcript);
    }
  }, [transcript, isRecording]);

  const handleSubmit = async (userInput) => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
          userMessage
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const assistantMessage = response.data.choices[0].message;
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      lireTexte(assistantMessage.content);
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "Désolé, je n'ai pas pu obtenir de réponse. Peux-tu réessayer?" }]);
    }

    resetTranscript();
  };

  const toggleRecording = () => {
    if (isRecording) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
    }
    setIsRecording(!isRecording);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Le navigateur ne supporte pas la reconnaissance vocale.</span>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex flex-col items-center justify-center p-4 overflow-hidden">
      <Glitter />
      <h1 className={`text-5xl font-bold text-yellow-300 mb-8 text-center animate-bounce font-comic-sans tracking-wide`}>
        C'est quoi ?
      </h1>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-6">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={100} 
          className="w-full h-24 bg-gray-100 rounded-2xl mb-4"
        />
        <div className="mt-4 p-3 bg-gray-100 rounded-2xl max-h-[300px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-xl ${message.role === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
                {message.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-6 flex justify-center">
          <button 
            type="button" 
            className={`p-6 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} text-white transform transition duration-200 hover:scale-110 active:scale-95`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CestQuoiComponent);