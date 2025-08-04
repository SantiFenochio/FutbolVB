"use client"

import { Phone, Clock } from "lucide-react"

interface WeeklyRepeatSelectorProps {
  precio: number
  onRepeatChange: (weeks: number) => void
  selectedWeeks: number
}

export default function WeeklyRepeatSelector({ precio, onRepeatChange, selectedWeeks }: WeeklyRepeatSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Mensaje principal */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservas Semanales</h3>
            <p className="text-gray-700 mb-3">
              Si deseas reservar una cancha semanalmente, comunícate al{" "}
              <a
                href="tel:+5411-5317-3785"
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors underline"
              >
                11-5317-3785
              </a>
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Atención: Lunes a Domingo de 9:00 a 22:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Ventajas de reservar semanalmente:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Descuentos especiales por reservas múltiples</li>
          <li>• Garantizas tu horario favorito todas las semanas</li>
          <li>• Atención personalizada para grupos regulares</li>
          <li>• Flexibilidad para cambios de último momento</li>
        </ul>
      </div>
    </div>
  )
}
