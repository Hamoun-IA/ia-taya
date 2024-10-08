import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useSpeechRecognition } from 'react-speech-recognition';
import LottieAnimation from './LottieAnimation';
import goodAnswerAnimation from '../animations/Animation - GoodAnswer.json';
import wrongAnswerAnimation from '../animations/Animation - WrongAnswer.json';
import loaderAnimation from '../animations/Animation - Loader.json';
import levelUpAnimation from '../animations/Animation - LevelUp.json';
import { useQuery } from 'react-query';
import { levenshteinDistance } from '../utils/stringUtils';
import '../styles/buttontalk.css';
import '../styles/EnigmePage.css';
import { Brain, Lightbulb, HelpCircle, MessageCircle, Eye, Mic } from "lucide-react";
import Glitter from './Glitter';

function EnigmePage() {
  const [enigme, setEnigme] = useState('');
  const [reponse, setReponse] = useState('');
  const [solution, setSolution] = useState('');
  const [difficulte, setDifficulte] = useState('facile');
  const [needNewEnigme, setNeedNewEnigme] = useState(true);
  const { enigmeResolue, xp, level, enigmesVues, ajouterEnigmeVue } = useUser();
  const [showGoodAnswer, setShowGoodAnswer] = useState(false);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [indice, setIndice] = useState('');
  const [indiceInput, setIndiceInput] = useState('');
  const [isListeningForIndice, setIsListeningForIndice] = useState(false);
  const [isRecordingAnswer, setIsRecordingAnswer] = useState(false);
  const [isRecordingIndice, setIsRecordingIndice] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    SpeechRecognition
  } = useSpeechRecognition();

  const lireTexte = useCallback((texte) => {
    const utterance = new SpeechSynthesisUtterance(texte);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  }, []);

  const genererEnigme = useCallback(async () => {
    console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY); // Ajoutez cette ligne
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {role: "system", content: "Vous êtes un générateur d'énigmes pour enfants. Générez une énigme avec sa solution."},
          {role: "user", content: `Générez une énigme ${difficulte} pour enfants avec sa solution. Commencez l'énigme par '**Énigme :**' et la solution par '**Solution :**'.`}
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices[0].message.content;
      
      // Extraction de l'énigme et de la solution à partir du texte Markdown
      const enigmeMatch = content.match(/\*\*Énigme\s*:\*\*([\s\S]*?)(?=\*\*Solution)/i);
      const solutionMatch = content.match(/\*\*Solution\s*:\*\*([\s\S]*$)/i);
      
      if (!enigmeMatch || !solutionMatch) {
        throw new Error("Format de réponse invalide");
      }

      const generatedContent = {
        id: Date.now().toString(),
        enigme: enigmeMatch[1].trim(),
        solution: solutionMatch[1].trim()
      };

      if (!enigmesVues.includes(generatedContent.id)) {
        return generatedContent;
      } else {
        // Si l'énigme a déjà été vue, on en génère une nouvelle
        return genererEnigme();
      }
    } catch (error) {
      console.error('Erreur lors de la génération de l\'énigme:', error);
      throw error;
    }
  }, [difficulte, enigmesVues]);

  const { isLoading, refetch } = useQuery(
    ['enigme', difficulte],
    genererEnigme,
    { 
      enabled: needNewEnigme,
      onSuccess: (data) => {
        if (data) {
          setEnigme(data.enigme);
          setSolution(data.solution);
          ajouterEnigmeVue(data.id);
          setNeedNewEnigme(false);
        }
      }
    }
  );

  const normaliserReponse = useCallback((texte) => {
    return texte.toLowerCase()
      .replace(/[.,!?]/g, '') // Supprime la ponctuation
      .replace(/^(le |la |les |l'|un |une |des |d')/g, '') // Supprime les articles au début
      .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul espace
      .trim(); // Supprime les espaces au début et à la fin
  }, []);

  const verifierReponse = useCallback((reponseUtilisateur) => {
    const reponseNormalisee = normaliserReponse(reponseUtilisateur);
    const solutionNormalisee = normaliserReponse(solution);

    console.log('Réponse utilisateur:', reponseUtilisateur);
    console.log('Réponse normalisée:', reponseNormalisee);
    console.log('Solution normalisée:', solutionNormalisee);

    // Vérification exacte ou similaire
    if (reponseNormalisee === solutionNormalisee || levenshteinDistance(reponseNormalisee, solutionNormalisee) <= 2) {
      setShowGoodAnswer(true);
      setTimeout(() => {
        setShowGoodAnswer(false);
        const oldLevel = Math.floor(xp / 100);
        enigmeResolue();
        const newLevel = Math.floor((xp + 10) / 100);
        if (newLevel > oldLevel) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }
        setNeedNewEnigme(true);
      }, 3000);
      if (reponseNormalisee !== solutionNormalisee) {
        lireTexte("Presque parfait ! La réponse exacte était : " + solution);
      }
    } else {
      setShowWrongAnswer(true);
      setTimeout(() => setShowWrongAnswer(false), 3000);
    }
    setReponse('');
  }, [solution, enigmeResolue, xp, lireTexte, normaliserReponse]);

  const demanderIndice = useCallback(async (question = "") => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {role: "system", content: `Vous êtes un assistant pour un jeu d'énigmes pour enfants. L'énigme actuelle est : "${enigme}" et sa solution est "${solution}". Donnez un indice sans révéler directement la réponse.`},
          {role: "user", content: question || "Donnez-moi un indice pour cette énigme."}
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const nouvelIndice = response.data.choices[0].message.content.trim();
      setIndice(nouvelIndice);
      lireTexte(nouvelIndice);
    } catch (error) {
      console.error('Erreur lors de la demande d\'indice:', error);
    }
  }, [enigme, solution, lireTexte]);

  const toggleRecording = (forIndice = false) => {
    if (forIndice) {
      if (isRecordingIndice) {
        SpeechRecognition.stopListening();
      } else {
        SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
      }
      setIsRecordingIndice(!isRecordingIndice);
    } else {
      if (isRecordingAnswer) {
        SpeechRecognition.stopListening();
      } else {
        SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
      }
      setIsRecordingAnswer(!isRecordingAnswer);
    }
  };

  useEffect(() => {
    if (!listening) {
      if (isListeningForIndice) {
        setIndiceInput(transcript);
      } else {
        setReponse(transcript);
      }
    }
  }, [listening, isListeningForIndice, transcript]);

  useEffect(() => {
    if (needNewEnigme) {
      refetch();
    }
  }, [needNewEnigme, refetch]);

  const lireEnigme = () => {
    const utterance = new SpeechSynthesisUtterance(enigme);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const revelerReponse = () => {
    setShowSolution(true);
    lireTexte(`La réponse est : ${solution}`);
    setTimeout(() => {
      setShowSolution(false);
      setNeedNewEnigme(true);
    }, 5000); // Cache la réponse et génère une nouvelle énigme après 5 secondes
  };

  if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
    return <span>Le navigateur ne supporte pas la reconnaissance vocale ou le microphone n'est pas disponible.</span>;
  }

  const options = [
    { value: 'facile', label: 'Facile' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'difficile', label: 'Difficile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex flex-col items-center justify-center p-4 overflow-hidden">
      <Glitter />
      <h1 className={`text-5xl font-bold text-white mb-8 text-center animate-wobble font-comic-sans tracking-wide transition-colors duration-500`}>
        ÉNIGME
      </h1>
      
      <p className="text-xl font-semibold text-white mb-4">Niveau : {level} | XP : {xp}</p>
      
      <select 
        value={difficulte} 
        onChange={(e) => setDifficulte(e.target.value)}
        className="w-full max-w-md mb-4 p-2 text-xl font-semibold bg-yellow-400 text-yellow-900 rounded-full"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      
      <div className="w-full max-w-md bg-white bg-opacity-20 rounded-lg p-6 mb-4">
        <p className="text-2xl font-bold text-white mb-4">{enigme}</p>
        <button 
          onClick={lireEnigme}
          className="w-full bg-green-400 hover:bg-green-500 text-green-900 font-bold py-2 px-4 rounded-full flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6 mr-2" />
          Lire l'énigme
        </button>
      </div>

      <div className="w-full max-w-md space-y-4">
        <input 
          type="text" 
          value={reponse} 
          onChange={(e) => setReponse(e.target.value)} 
          placeholder="Votre réponse"
          className="w-full p-2 text-xl font-semibold bg-blue-400 text-blue-900 rounded-full placeholder-blue-700"
        />
        
        <div className="flex space-x-2">
          <button 
            onClick={() => verifierReponse(reponse)}
            className="flex-1 bg-pink-400 hover:bg-pink-500 text-pink-900 font-bold py-2 px-4 rounded-full flex items-center justify-center"
          >
            <Brain className="h-6 w-6 mr-2" />
            Vérifier
          </button>
          
          <button
            onClick={() => toggleRecording(false)}
            className={`flex-1 ${isRecordingAnswer ? 'bg-red-500 animate-pulse' : 'bg-blue-400 hover:bg-blue-500'} text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-300`}
          >
            <Mic className={`h-6 w-6 mr-2 ${isRecordingAnswer ? 'animate-bounce' : ''}`} />
            {isRecordingAnswer ? 'Parle...' : 'Parler'}
          </button>
        </div>
        
        <button 
          onClick={revelerReponse}
          className="w-full bg-red-400 hover:bg-red-500 text-red-900 font-bold py-2 px-4 rounded-full flex items-center justify-center"
        >
          <Eye className="h-6 w-6 mr-2" />
          Voir la réponse
        </button>
        
        {showSolution && (
          <p className="text-xl font-bold text-white bg-green-500 p-2 rounded-lg">
            Solution : {solution}
          </p>
        )}
      </div>

      <div className="w-full max-w-md mt-8">
        <h3 className="text-2xl font-bold text-white mb-4">Demander un indice</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => demanderIndice()}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-full flex items-center justify-center"
          >
            <Lightbulb className="h-6 w-6 mr-2" />
            Demander un indice
          </button>
          
          <button
            onClick={() => toggleRecording(true)}
            className={`flex-1 ${isRecordingIndice ? 'bg-red-500 animate-pulse' : 'bg-green-400 hover:bg-green-500'} text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-300`}
          >
            <Mic className={`h-6 w-6 mr-2 ${isRecordingIndice ? 'animate-bounce' : ''}`} />
            {isRecordingIndice ? 'Parle...' : 'Parler'}
          </button>
        </div>
        {indice && (
          <p className="text-xl font-semibold text-white bg-purple-500 p-2 rounded-lg mt-4">
            Indice : {indice}
          </p>
        )}
      </div>

      {isLoading && <div className="lottie-animation"><LottieAnimation animationData={loaderAnimation} width={200} height={200} /></div>}
      {showGoodAnswer && <div className="lottie-animation"><LottieAnimation animationData={goodAnswerAnimation} width={400} height={400} /></div>}
      {showWrongAnswer && <div className="lottie-animation"><LottieAnimation animationData={wrongAnswerAnimation} width={400} height={400} /></div>}
      {showLevelUp && <div className="lottie-animation"><LottieAnimation animationData={levelUpAnimation} width={400} height={400} /></div>}
    </div>
  );
}

export default React.memo(EnigmePage);