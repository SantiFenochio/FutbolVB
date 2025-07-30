import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Users, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      question: "¿Cómo funciona el sistema de reservas?",
      answer:
        "Podés reservar tu cancha online las 24 horas. Seleccioná fecha, horario y cancha, completá tus datos y pagá la seña del 20% con Mercado Pago. Recibirás una confirmación por email y WhatsApp.",
    },
    {
      question: "¿Cuánto debo pagar de seña?",
      answer:
        "La seña es del 20% del valor total de la cancha. Por ejemplo, si la cancha cuesta $15.000, la seña es de $3.000. El resto se paga en efectivo el día del partido.",
    },
    {
      question: "¿Puedo cancelar mi reserva?",
      answer:
        "Sí, podés cancelar hasta 24 horas antes del horario reservado y te devolvemos el 100% de la seña. Si cancelás con menos de 24 horas, la seña no se reembolsa.",
    },
    {
      question: "¿Qué pasa si llueve?",
      answer:
        "Tenemos canchas techadas disponibles. Si tu reserva es en cancha descubierta y llueve, podés reprogramar sin costo adicional o cambiar a una cancha techada (sujeto a disponibilidad).",
    },
    {
      question: "¿Cuál es la diferencia entre Fútbol 5 y Fútbol 10?",
      answer:
        "Fútbol 5: canchas más pequeñas para 10 jugadores (5 vs 5). Fútbol 10: canchas más grandes para 20 jugadores (10 vs 10). Los precios varían según el tamaño.",
    },
    {
      question: "¿Incluye pelota y pecheras?",
      answer:
        "Sí, todas las reservas incluyen pelota de fútbol y pecheras para diferenciar los equipos. También tenés acceso a vestuarios con duchas.",
    },
    {
      question: "¿Hay estacionamiento?",
      answer:
        "Sí, contamos con estacionamiento gratuito para todos nuestros clientes. El predio está cerrado y es seguro.",
    },
    {
      question: "¿Puedo reservar con anticipación?",
      answer:
        "Podés reservar hasta 30 días de anticipación. Te recomendamos reservar con tiempo, especialmente para fines de semana y horarios pico.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Para la seña online aceptamos todos los medios de pago de Mercado Pago (tarjetas, transferencias, etc.). El saldo restante se paga en efectivo en el lugar.",
    },
    {
      question: "¿Hay descuentos por reservas frecuentes?",
      answer:
        "Sí, ofrecemos descuentos para clientes frecuentes y paquetes especiales para torneos. Consultanos por WhatsApp para más información.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">FutbolVB</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-green-700">
                Inicio
              </Link>
              <Link href="/canchas" className="text-gray-600 hover:text-green-700">
                Canchas
              </Link>
              <Link href="/faq" className="text-green-700 hover:text-green-900 font-medium">
                FAQ
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-green-700">
                Contacto
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Preguntas Frecuentes</h1>
            </div>
            <p className="text-gray-600">Encontrá respuestas a las preguntas más comunes sobre nuestro servicio</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todo lo que necesitás saber</CardTitle>
              <CardDescription>Si no encontrás la respuesta que buscás, no dudes en contactarnos</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold text-green-800 mb-2">¿No encontraste lo que buscabas?</h2>
              <p className="text-green-700 mb-4">Nuestro equipo está listo para ayudarte con cualquier consulta</p>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700"
              >
                Contactanos
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
