"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(true)

  const whatsappNumber = "5491123456789" // Reemplazar con el número real
  const message = encodeURIComponent(
    "¡Hola! Me interesa reservar una cancha. ¿Podrían ayudarme con información sobre disponibilidad y precios?",
  )

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Botón de cerrar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-gray-100 hover:bg-gray-200 rounded-full z-10"
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Botón principal de WhatsApp */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </a>

        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          ¿Necesitás ayuda? ¡Escribinos!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  )
}
