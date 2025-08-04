"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Clock } from "lucide-react"

interface WeeklyRepeatSelectorProps {
  isEnabled: boolean
  onEnabledChange: (enabled: boolean) => void
  weeks: number
  onWeeksChange: (weeks: number) => void
  selectedDate: string
  selectedTime: string
  precio: number
}

export function WeeklyRepeatSelector({
  isEnabled,
  onEnabledChange,
  weeks,
  onWeeksChange,
  selectedDate,
  selectedTime,
  precio,
}: WeeklyRepeatSelectorProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
          <Clock className="w-5 h-5 text-blue-600" />
          Reservas Semanales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
          <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            Si deseas reservar una cancha semanalmente, comunícate al{" "}
            <a
              href="tel:+5411-5317-3785"
              className="font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg"
            >
              11-5317-3785
            </a>
          </p>
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
            <p className="mb-1">
              <strong>Ventajas de reservar semanalmente:</strong>
            </p>
            <ul className="text-left space-y-1">
              <li>• Mismo horario garantizado cada semana</li>
              <li>• Descuentos especiales por volumen</li>
              <li>• Atención personalizada</li>
              <li>• Flexibilidad en los pagos</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
