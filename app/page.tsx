"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Phone, Users, Zap, Shield, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Testimonials } from "@/components/testimonials"
import { ReservationSteps } from "@/components/reservation-steps"

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedDate) params.set("fecha", selectedDate)
    if (selectedTime) params.set("horario", selectedTime)

    window.location.href = `/canchas?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">FutbolVB</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-green-700 hover:text-green-900 font-medium">
                Inicio
              </Link>
              <Link href="/canchas" className="text-gray-600 hover:text-green-700">
                Canchas
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-green-700">
                FAQ
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-green-700">
                Contacto
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-green-800 mb-6 leading-tight">
              Jugá hoy.
              <br />
              <span className="text-green-600">Reservá tu cancha</span>
              <br />
              <span className="text-4xl md:text-5xl">en segundos.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              Canchas de F5 y F10 en Villa Ballester con pago online.
            </p>
            <p className="text-lg text-green-700 font-medium mb-8">⚡ Confirmá tu turno con solo una seña del 20%</p>

            {/* Quick benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Reserva instantánea</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Pago seguro</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Sin registro</span>
              </div>
            </div>

            {/* Search Form */}
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Calendar className="w-6 h-6" />
                  Encontrá tu horario ideal
                </CardTitle>
                <CardDescription className="text-base">
                  Seleccioná fecha y horario para ver canchas disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-base font-medium">
                      Fecha
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-base font-medium">
                      Horario
                    </Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Seleccionar horario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="19:00">19:00</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                        <SelectItem value="21:00">21:00</SelectItem>
                        <SelectItem value="22:00">22:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold"
                >
                  🚀 Buscar canchas disponibles
                </Button>
                <p className="text-center text-sm text-gray-500">
                  💡 Tip: Reservá con anticipación para asegurar tu horario favorito
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reservation Steps */}
      <ReservationSteps />

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">¿Por qué elegir FutbolVB?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-green-100">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Reserva Online 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reservá tu cancha desde cualquier dispositivo, a cualquier hora. Sin llamadas, sin esperas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-blue-100">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Turnos de 1 Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Todos nuestros turnos son de 1 hora completa. Horarios desde las 9:00 hasta las 23:00.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-purple-100">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">F5 y F10 Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Canchas para todos los grupos. Desde partidos íntimos hasta encuentros grandes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Location Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">En el corazón de Villa Ballester</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Nuestras canchas están ubicadas en Villa Ballester, San Martín, Buenos Aires. Fácil acceso en auto y
                transporte público.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <span className="text-lg">Villa Ballester, San Martín, Buenos Aires</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-green-600" />
                  <span className="text-lg">+54 11 1234-5678</span>
                </div>
              </div>
              <Button asChild className="mt-8 bg-green-600 hover:bg-green-700 h-12 px-8 text-lg">
                <Link href="/contacto">📍 Ver ubicación completa</Link>
              </Button>
            </div>
            <div className="relative h-64 lg:h-80">
              <Image
                src="/placeholder.svg?height=320&width=500&text=Vista+aérea+canchas"
                alt="Vista aérea de las canchas de fútbol"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para jugar?</h2>
          <p className="text-xl mb-8 opacity-90">🎯 Reservá ahora y pagá solo el 20% de seña con Mercado Pago</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
              <Link href="/canchas">⚽ Ver todas las canchas</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-semibold bg-transparent text-white border-white hover:bg-white hover:text-green-700"
            >
              <Link href="/contacto">📞 Contactanos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">FutbolVB</span>
              </div>
              <p className="text-gray-400 mb-4">Las mejores canchas de fútbol en Villa Ballester</p>
              <p className="text-sm text-gray-500">⚡ Reservá en segundos • Pagá solo el 20%</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <div className="space-y-2">
                <Link href="/canchas" className="block text-gray-400 hover:text-white transition-colors">
                  Canchas
                </Link>
                <Link href="/faq" className="block text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
                <Link href="/contacto" className="block text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>Villa Ballester, San Martín</p>
                <p>Buenos Aires, Argentina</p>
                <p>+54 11 1234-5678</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FutbolVB. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
