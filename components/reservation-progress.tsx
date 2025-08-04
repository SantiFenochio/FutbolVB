import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, CreditCard, Calendar, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReservationProgressProps {
  currentStep: 1 | 2 | 3 | 4
  isLoading?: boolean
  loadingMessage?: string
}

export function ReservationProgress({ currentStep, isLoading = false, loadingMessage }: ReservationProgressProps) {
  const steps = [
    {
      id: 1,
      title: "Datos de reserva",
      description: "Completar formulario",
      icon: Calendar,
    },
    {
      id: 2,
      title: "Procesando",
      description: "Validando información",
      icon: Clock,
    },
    {
      id: 3,
      title: "Pago",
      description: "Confirmar seña",
      icon: CreditCard,
    },
    {
      id: 4,
      title: "Confirmación",
      description: "Reserva completada",
      icon: CheckCircle,
    },
  ]

  const getProgressValue = () => {
    if (isLoading) {
      return (currentStep - 1) * 25 + 12.5 // Punto medio del paso actual
    }
    return (currentStep - 1) * 25
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de reserva</span>
            <span className="text-sm text-gray-500">
              Paso {currentStep} de {steps.length}
            </span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isUpcoming = step.id > currentStep

            return (
              <div key={step.id} className="text-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-300",
                    {
                      "bg-green-600 text-white": isCompleted,
                      "bg-blue-600 text-white": isCurrent && !isLoading,
                      "bg-blue-100 text-blue-600": isCurrent && isLoading,
                      "bg-gray-200 text-gray-400": isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent && isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs">
                  <div
                    className={cn("font-medium", {
                      "text-green-600": isCompleted,
                      "text-blue-600": isCurrent,
                      "text-gray-400": isUpcoming,
                    })}
                  >
                    {step.title}
                  </div>
                  <div className="text-gray-500 mt-1">{step.description}</div>
                </div>
              </div>
            )
          })}
        </div>

        {isLoading && loadingMessage && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-700">{loadingMessage}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
