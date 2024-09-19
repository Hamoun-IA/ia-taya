'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

export default function Component() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let phase = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)')
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.5)')
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)')

      const lineCount = 3
      const amplitude = isListening ? 30 : 5
      const frequency = 0.05

      for (let j = 0; j < lineCount; j++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let i = 0; i < canvas.width; i++) {
          const y = canvas.height / 2 + 
                    Math.sin(i * frequency + phase + j * 0.5) * amplitude * 
                    (1 + Math.sin(i * 0.01 + phase * 0.1) * 0.5) * 
                    (isListening ? (0.8 + Math.random() * 0.4) : 1)
          ctx.lineTo(i, y)
        }

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
      }

      phase += isListening ? 0.2 : 0.05
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isListening])

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulating speech recognition
      const words = ["Bonjour", "Comment", "ça", "va", "aujourd'hui", "?"]
      let i = 0
      const interval = setInterval(() => {
        if (i < words.length) {
          setTranscript(prev => prev + " " + words[i])
          i++
        } else {
          clearInterval(interval)
          setIsListening(false)
        }
      }, 500)
    } else {
      setTranscript("")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">Chat Vocal pour Enfants</h2>
          <canvas 
            ref={canvasRef} 
            width={300} 
            height={100} 
            className="w-full h-24 bg-gray-100 rounded-lg"
          />
          <div className="mt-4 p-3 bg-gray-100 rounded-lg min-h-[100px] text-lg">
            {transcript || "Ce que tu dis apparaîtra ici..."}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={toggleListening}
              className={`rounded-full w-16 h-16 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}