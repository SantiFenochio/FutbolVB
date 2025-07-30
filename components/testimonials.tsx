import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Carlos M.",
      text: "Súper fácil reservar. En 2 minutos ya tenía confirmado mi turno para el sábado. Las canchas están impecables.",
      rating: 5,
      cancha: "Cancha Principal F10",
    },
    {
      name: "Ana L.",
      text: "Me encanta que solo pago la seña online. El resto lo abono cuando llego. Muy práctico y seguro.",
      rating: 5,
      cancha: "Cancha Norte F5",
    },
    {
      name: "Diego R.",
      text: "La cancha techada es perfecta para cuando llueve. Siempre encuentro horarios disponibles.",
      rating: 5,
      cancha: "Cancha Sur F5",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros jugadores</h2>
          <p className="text-gray-600">Miles de partidos jugados, miles de sonrisas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-green-200 mb-4" />
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.cancha}</p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
