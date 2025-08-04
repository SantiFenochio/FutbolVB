"use client"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, DollarSign } from "lucide-react"

interface HorariosDisponibilidadProps {
  horarios: string[]
  horariosOcupados: string[]
  selectedTime: string
  onTimeSelect: (time: string) => void
  showAvailabilityOnly?: boolean
  precio?: number
}

export function HorariosDisponibilidad({
  horarios,
  horariosOcupados,
  selectedTime,
  onTimeSelect,
  showAvailabilityOnly = true,
  precio,
}: HorariosDisponibilidadProps) {
  const horariosDisponibles = horarios.filter((h) => !horariosOcupados.includes(h))
  const horariosToShow = showAvailabilityOnly ? horariosDisponibles : horarios

  const getHorarioStatus = (horario: string) => {
    if (horariosOcupados.includes(horario)) return "ocupado"
    if (selectedTime === horario) return "seleccionado"
    return "disponible"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ocupado":
        return "bg-red-100 text-red-800 border-red-200 cursor-not-allowed"
      case "seleccionado":
        return "bg-green-100 text-green-800 border-green-300 ring-2 ring-green-200"
      case "disponible":
        return "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300 cursor-pointer"
      default:
        return "bg-gray-100 text-gray-500 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ocupado":
        return <X className="w-3 h-3" />
      case "seleccionado":
        return <Check className="w-3 h-3" />
      case "disponible":
        return <Clock className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {horariosToShow.map((horario) => {
          const status = getHorarioStatus(horario)
          const isDisabled = status === "ocupado"

          return (
            <Button
              key={horario}
              variant="outline"
              size="sm"
              disabled={isDisabled}
              onClick={() => !isDisabled && onTimeSelect(horario)}
              className={`${getStatusColor(status)} transition-all duration-200 flex items-center justify-center gap-1 p-2 h-auto`}
            >
              {getStatusIcon(status)}
              <span className="text-xs font-medium">{horario}</span>
            </Button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-600">Ocupado</span>
        </div>
      </div>

      {/* Información de precio */}
      {precio && selectedTime && !horariosOcupados.includes(selectedTime) && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Horario seleccionado: {selectedTime}</span>
            </div>
            <span className="text-sm font-bold text-green-700">${precio.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay horarios disponibles */}
      {horariosDisponibles.length === 0 && (
        <div className="text-center py-4">
          <div className="text-red-600 font-medium mb-1">No hay horarios disponibles</div>
          <div className="text-sm text-gray-500">Todos los horarios están ocupados para esta fecha</div>
        </div>
      )}
    </div>
  )
}
