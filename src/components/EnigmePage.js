import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import LottieAnimation from './LottieAnimation';
import goodAnswerAnimation from '../animations/Animation - GoodAnswer.json';
import wrongAnswerAnimation from '../animations/Animation - WrongAnswer.json';
import loaderAnimation from '../animations/Animation - Loader.json';
import levelUpAnimation from '../animations/Animation - LevelUp.json';
import { useQuery } from 'react-query';
import { levenshteinDistance } from '../utils/stringUtils';
import '../styles/buttontalk.css';
import '../styles/EnigmePage.css';

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
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak, voices } = useSpeechSynthesis();

  const lireTexte = useCallback((texte) => {
    const voixFrancaise = voices.find(voice => voice.lang === 'fr-FR');
    speak({ text: texte, voice: voixFrancaise });
  }, [speak, voices]);

  const genererEnigme = useCallback(async () => {
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

  const verifierReponse = useCallback((reponseUtilisateur) => {
    // Fonction pour nettoyer et normaliser les réponses
    const normaliserReponse = (texte) => {
      return texte.toLowerCase()
        .replace(/[.,!?]/g, '') // Supprime la ponctuation
        .replace(/^(le |la |les |un |une |des )/g, '') // Supprime les articles au début
        .trim(); // Supprime les espaces au début et à la fin
    };

    const reponseNormalisee = normaliserReponse(reponseUtilisateur);
    const solutionNormalisee = normaliserReponse(solution);

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
  }, [solution, enigmeResolue, xp, lireTexte]);

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
        stopRecording(true);
      } else {
        startRecording(true);
      }
      setIsRecordingIndice(!isRecordingIndice);
    } else {
      if (isRecordingAnswer) {
        stopRecording(false);
      } else {
        startRecording(false);
      }
      setIsRecordingAnswer(!isRecordingAnswer);
    }
  };

  const startRecording = (forIndice = false) => {
    resetTranscript();
    setIsListeningForIndice(forIndice);
    SpeechRecognition.startListening({ continuous: true, language: 'fr-FR' });
  };

  const stopRecording = async (forIndice = false) => {
    SpeechRecognition.stopListening();
    setIsListeningForIndice(false);
    
    if (forIndice) {
      await demanderIndice(transcript);
    } else {
      verifierReponse(transcript);
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
    const voixFrancaise = voices.find(voice => voice.lang === 'fr-FR');
    speak({ text: enigme, voice: voixFrancaise });
  };

  const revelerReponse = () => {
    setShowSolution(true);
    lireTexte(`La réponse est : ${solution}`);
    setTimeout(() => {
      setShowSolution(false);
      setNeedNewEnigme(true);
    }, 5000); // Cache la réponse et génère une nouvelle énigme après 5 secondes
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Le navigateur ne supporte pas la reconnaissance vocale.</span>;
  }

  const options = [
    { value: 'facile', label: 'Facile' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'difficile', label: 'Difficile' }
  ];

  return (
    <div className="enigme-page">
      <h2>Énigme</h2>
      <p>Niveau : {level} | XP : {xp}</p>
      <select value={difficulte} onChange={(e) => setDifficulte(e.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      
      <div className="enigme">
        <p>{enigme}</p>
        <button onClick={lireEnigme}>Lire l'énigme</button>
      </div>

      <div className="reponse-section">
        <input 
          type="text" 
          value={reponse} 
          onChange={(e) => setReponse(e.target.value)} 
          placeholder="Votre réponse"
        />
        
        <div className="button-container">
          <input 
            type="checkbox" 
            id="micButtonAnswer" 
            className="mic-checkbox"
            checked={isRecordingAnswer}
            onChange={() => toggleRecording(false)}
          />
          <label htmlFor="micButtonAnswer" className="mic-button">
            <div className='mic'>
              <div className='mic-button-loader'></div>
              <div className="mic-base"></div>
            </div>
            <div className="button-message">
              <span><br/>RÉPONSE</span>
            </div>
          </label>
        </div>
        
        <button onClick={revelerReponse}>Voir la réponse</button>
        {showSolution && <p className="solution">Solution : {solution}</p>}
      </div>

      <div className="indice-section">
        <h3>Demander un indice</h3>
        <input 
          type="text" 
          value={indiceInput} 
          onChange={(e) => setIndiceInput(e.target.value)} 
          placeholder="Posez une question pour obtenir un indice"
          readOnly
        />
        <button onClick={() => demanderIndice()}>Demander un indice général</button>
        <p>Indice : {indice}</p>
        
        <div className="button-container">
          <input 
            type="checkbox" 
            id="micButtonIndice" 
            className="mic-checkbox"
            checked={isRecordingIndice}
            onChange={() => toggleRecording(true)}
          />
          <label htmlFor="micButtonIndice" className="mic-button">
            <div className='mic'>
              <div className='mic-button-loader'></div>
              <div className="mic-base"></div>
            </div>
            <div className="button-message">
              <span><br/>INDICE</span>
            </div>
          </label>
        </div>
      </div>

      {isLoading && <div className="lottie-animation"><LottieAnimation animationData={loaderAnimation} width={200} height={200} /></div>}
      {showGoodAnswer && <div className="lottie-animation"><LottieAnimation animationData={goodAnswerAnimation} width={400} height={400} /></div>}
      {showWrongAnswer && <div className="lottie-animation"><LottieAnimation animationData={wrongAnswerAnimation} width={400} height={400} /></div>}
      {showLevelUp && <div className="lottie-animation"><LottieAnimation animationData={levelUpAnimation} width={400} height={400} /></div>}
    </div>
  );
}

export default React.memo(EnigmePage);