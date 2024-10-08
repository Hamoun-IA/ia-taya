import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
// Remplacez l'import de next/image par une balise img standard
// import Image from 'next/image'

export default function CharacterSelection() {
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null)
  const titleControls = useAnimation()
  const navigate = useNavigate()

  const characters = [
    { name: 'Princesse', image: './public/images/princesse.jpg', borderColor: 'border-pink-200', nameColor: 'text-pink-200' },
    { name: 'Pirate', image: './public/images/pirate.jpg', borderColor: 'border-blue-300', nameColor: 'text-blue-300' }
  ]

  useEffect(() => {
    titleControls.start({
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    })
  }, [titleControls])

  const handleCharacterClick = (character: string) => {
    console.log(`Personnage sélectionné : ${character}`)
    navigate(`/chat/${character.toLowerCase()}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-400 to-purple-800 py-8 px-4">
      <motion.h1 
        className="text-4xl sm:text-5xl font-bold mb-12 text-white tracking-wide text-center"
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif", textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
        animate={titleControls}
      >
        À qui veux-tu parler ?
      </motion.h1>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-12 sm:space-y-0 sm:space-x-12 w-full max-w-4xl">
        {characters.map((character) => (
          <motion.div 
            key={character.name} 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredCharacter(character.name)}
            onHoverEnd={() => setHoveredCharacter(null)}
            onClick={() => handleCharacterClick(character.name)}
          >
            <motion.div 
              className={`rounded-full overflow-hidden border-8 ${character.borderColor} shadow-lg mb-4`}
              whileHover={{ 
                rotate: 360,
                boxShadow: "0px 0px 8px rgba(255,255,255,0.5)"
              }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-48 h-48 sm:w-64 sm:h-64 object-cover"
              />
            </motion.div>
            <motion.span 
              className={`text-3xl font-bold ${character.nameColor} tracking-wide`}
              style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
              animate={{ scale: hoveredCharacter === character.name ? 1.1 : 1 }}
            >
              {character.name}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}