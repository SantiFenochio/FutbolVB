import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, CreditCard, CheckCircle } from "lucide-react"

export function ReservationSteps() {
  const steps = [
    {
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      title: "Elegir cancha",
      description: "Seleccioná fecha, horario y tipo de cancha",
    },
    {
      icon: <User className="w-8 h-8 text-green-600" />,
      title: "Ingresar datos",
      description: "Completá tu información de contacto",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      title: "Confirmar seña",
      description: "Pagá solo el 20% con Mercado Pago",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "¡Listo!",
      description: "Recibí confirmación y jugá tranquilo",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Reservá en 4 simples pasos</h2>
          <p className="text-gray-600">Sin registros, sin complicaciones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-green-200 z-0"
                  style={{ transform: "translateX(50%)" }}
                />
              )}

              <Card className="relative z-10 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-green-700 font-medium">⚡ No necesitás registrarte • Pagás solo el 20% y confirmás</p>
        </div>
      </div>
    </section>
  )
}
