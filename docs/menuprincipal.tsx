import React from 'react'
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, AlignJustify, HelpCircle, MessageCircle, Settings } from "lucide-react"

export default function MenuPrincipal() {
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null)

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName)
    console.log(`${buttonName} clicked`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-8 text-center animate-wobble font-comic-sans tracking-wide">
        MENU TAYA
      </h1>
      
      <div className="space-y-4 w-full max-w-md">
        <Button 
          className={`w-full h-16 text-xl font-semibold bg-yellow-400 hover:bg-yellow-500 text-yellow-900 transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full ${selectedButton === 'Quiz' ? 'ring-4 ring-white' : ''}`}
          onClick={() => handleButtonClick('Quiz')}
        >
          <Brain className="mr-2 h-6 w-6" />
          Quiz
        </Button>
        
        <Button 
          className={`w-full h-16 text-xl font-semibold bg-green-400 hover:bg-green-500 text-green-900 transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full ${selectedButton === 'Enigme' ? 'ring-4 ring-white' : ''}`}
          onClick={() => handleButtonClick('Enigme')}
        >
          <Lightbulb className="mr-2 h-6 w-6" />
          Enigme
        </Button>
        
        <Button 
          className={`w-full h-16 text-xl font-semibold bg-red-400 hover:bg-red-500 text-red-900 transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full ${selectedButton === 'Syllabes' ? 'ring-4 ring-white' : ''}`}
          onClick={() => handleButtonClick('Syllabes')}
        >
          <AlignJustify className="mr-2 h-6 w-6" />
          Syllabes
        </Button>
        
        <Button 
          className={`w-full h-16 text-xl font-semibold bg-blue-400 hover:bg-blue-500 text-blue-900 transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full ${selectedButton === 'C\'est quoi?' ? 'ring-4 ring-white' : ''}`}
          onClick={() => handleButtonClick('C\'est quoi?')}
        >
          <HelpCircle className="mr-2 h-6 w-6" />
          C'est quoi ?
        </Button>
        
        <Button 
          className={`w-full h-16 text-xl font-semibold bg-pink-400 hover:bg-pink-500 text-pink-900 transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full ${selectedButton === 'Parler' ? 'ring-4 ring-white' : ''}`}
          onClick={() => handleButtonClick('Parler')}
        >
          <MessageCircle className="mr-2 h-6 w-6" />
          Parler
        </Button>
        
        <Button 
          className={`w-full h-16 text-xl font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 transform transition duration-200 hover:scale-105 active:scale-95 animate-bounce-in rounded-full ${selectedButton === 'Options' ? 'ring-4 ring-white' : ''}`}
          onClick={() => handleButtonClick('Options')}
        >
          <Settings className="mr-2 h-6 w-6" />
          Options
        </Button>
      </div>
    </div>
  )
}