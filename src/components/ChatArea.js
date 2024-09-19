import React, { useState } from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';

function ChatArea({ enigme, solution }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { speak, voices } = useSpeechSynthesis();

  const envoyerMessage = async () => {
    if (input.trim() === '') return;

    const nouveauMessage = { text: input, sender: 'user' };
    setMessages([...messages, nouveauMessage]);

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {role: "system", content: `Vous êtes un assistant pour un jeu d'énigmes pour enfants. L'énigme actuelle est : "${enigme}" et sa solution est "${solution}". Donnez des indices sans révéler directement la réponse.`},
          {role: "user", content: input}
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const reponseAssistant = { 
        text: response.data.choices[0].message.content.trim(), 
        sender: 'assistant' 
      };
      setMessages(prevMessages => [...prevMessages, reponseAssistant]);
    } catch (error) {
      console.error('Erreur lors de la communication avec l\'assistant:', error);
    }

    setInput('');
  };

  const lireMessage = (texte) => {
    const voixFrancaise = voices.find(voice => voice.lang === 'fr-FR');
    speak({ text: texte, voice: voixFrancaise });
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
            {msg.sender === 'assistant' && (
              <button onClick={() => lireMessage(msg.text)}>Lire</button>
            )}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Posez une question pour obtenir un indice"
      />
      <button onClick={envoyerMessage}>Envoyer</button>
    </div>
  );
}

export default ChatArea;