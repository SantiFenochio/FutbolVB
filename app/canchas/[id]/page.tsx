"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Users, CreditCard, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getCanchaById, getReservasByCancha, createReserva, type Cancha } from "@/lib/supabase"
import { createMercadoPagoPreference, getMercadoPagoTestUrl } from "@/lib/mercadopago"
import { ReservationProgress } from "@/components/reservation-progress"
import { LoadingOverlay } from "@/components/loading-overlay"
import { WeeklyRepeatSelector } from "@/components/weekly-repeat-selector"
import { HorariosDisponibilidad } from "@/components/horarios-disponibilidad"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function CanchaDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cancha, setCancha] = useState<Cancha | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(searchParams.get("fecha") || "")
  const [selectedTime, setSelectedTime] = useState(searchParams.get("horario") || "")
  const [playerName, setPlayerName] = useState("")
  const [playerPhone, setPlayerPhone] = useState("")
  const [playerEmail, setPlayerEmail] = useState("")
  const [comments, setComments] = useState("")
  const [isReserving, setIsReserving] = useState(false)
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([])
  const [reservationStep, setReservationStep] = useState<1 | 2 | 3 | 4>(1)

  // Weekly repeat states
  const [weeklyRepeatEnabled, setWeeklyRepeatEnabled] = useState(false)
  const [weeklyRepeatWeeks, setWeeklyRepeatWeeks] = useState(4)

  const [loadingState, setLoadingState] = useState({
    isVisible: false,
    type: "processing" as "processing" | "payment" | "success" | "error",
    title: "",
    description: "",
  })

  useEffect(() => {
    loadCancha()
  }, [params.id])

  useEffect(() => {
    if (cancha && selectedDate) {
      loadHorariosOcupados()
    }
  }, [cancha, selectedDate])

  const loadCancha = async () => {
    try {
      const canchaId = Number.parseInt(params.id as string)
      const data = await getCanchaById(canchaId)
      setCancha(data)
    } catch (error) {
      console.error("Error loading cancha:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHorariosOcupados = async () => {
    if (!cancha) return

    try {
      const horarios = await getReservasByCancha(cancha.id, selectedDate)
      // Simular algunos horarios ocupados para demostración
      const simulatedOccupied = ["18:00", "20:00", "21:00"]
      setHorariosOcupados([...horarios, ...simulatedOccupied])
    } catch (error) {
      console.error("Error loading horarios ocupados:", error)
      setHorariosOcupados(["18:00", "20:00", "21:00"]) // Fallback simulado
    }
  }

  const showLoadingOverlay = (
    type: "processing" | "payment" | "success" | "error",
    title: string,
    description: string,
  ) => {
    setLoadingState({
      isVisible: true,
      type,
      title,
      description,
    })
  }

  const hideLoadingOverlay = () => {
    setLoadingState((prev) => ({ ...prev, isVisible: false }))
  }

  const handleReservation = async () => {
    if (!cancha || !selectedDate || !selectedTime || !playerName || !playerPhone || !playerEmail) {
      alert("Por favor completá todos los campos obligatorios")
      return
    }

    if (horariosOcupados.includes(selectedTime)) {
      alert("Este horario ya fue reservado por otra persona. Por favor elegí otro horario.")
      await loadHorariosOcupados()
      return
    }

    setIsReserving(true)
    setReservationStep(2)

    const totalReservations = weeklyRepeatEnabled ? weeklyRepeatWeeks : 1
    const totalPrice = cancha.precio * totalReservations
    const totalDeposit = Math.round(totalPrice * 0.2)

    // Mostrar overlay de procesamiento
    showLoadingOverlay(
      "processing",
      weeklyRepeatEnabled ? `Procesando ${totalReservations} reservas...` : "Procesando tu reserva...",
      weeklyRepeatEnabled
        ? "Estamos creando tus reservas semanales"
        : "Estamos validando la información y creando tu reserva",
    )

    try {
      // Simular delay para mostrar la animación
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Crear reserva(s) en la base de datos
      const reservas = []

      if (weeklyRepeatEnabled) {
        // Crear múltiples reservas para las semanas seleccionadas
        for (let i = 0; i < weeklyRepeatWeeks; i++) {
          const reservaDate = new Date(selectedDate)
          reservaDate.setDate(reservaDate.getDate() + i * 7)

          const nuevaReserva = await createReserva({
            cancha_id: cancha.id,
            fecha: reservaDate.toISOString().split("T")[0],
            horario: selectedTime,
            jugador_nombre: playerName,
            jugador_telefono: playerPhone,
            jugador_email: playerEmail,
            precio: cancha.precio,
            sena: Math.round(cancha.precio * 0.2),
            sena_pagada: false,
            comentarios: comments + (weeklyRepeatEnabled ? ` (Reserva semanal ${i + 1}/${weeklyRepeatWeeks})` : ""),
            estado: "pendiente",
          })
          reservas.push(nuevaReserva)
        }
      } else {
        // Crear una sola reserva
        const nuevaReserva = await createReserva({
          cancha_id: cancha.id,
          fecha: selectedDate,
          horario: selectedTime,
          jugador_nombre: playerName,
          jugador_telefono: playerPhone,
          jugador_email: playerEmail,
          precio: cancha.precio,
          sena: Math.round(cancha.precio * 0.2),
          sena_pagada: false,
          comentarios: comments,
          estado: "pendiente",
        })
        reservas.push(nuevaReserva)
      }

      // Cambiar a paso de pago
      setReservationStep(3)
      showLoadingOverlay(
        "payment",
        "Redirigiendo a Mercado Pago...",
        "Te estamos llevando a la plataforma de pago segura",
      )

      // Crear preferencia de Mercado Pago
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const paymentUrl = await createMercadoPagoPreference(
          reservas[0].id, // Usar la primera reserva como referencia
          cancha.nombre + (weeklyRepeatEnabled ? ` (${totalReservations} turnos)` : ""),
          selectedDate,
          selectedTime,
          totalDeposit,
        )

        // Mostrar éxito antes de redirigir
        showLoadingOverlay(
          "success",
          weeklyRepeatEnabled ? "¡Reservas creadas exitosamente!" : "¡Reserva creada exitosamente!",
          "Serás redirigido a Mercado Pago en unos segundos...",
        )

        setTimeout(() => {
          window.location.href = paymentUrl
        }, 2000)
      } catch (mpError) {
        console.error("Error creating MercadoPago preference:", mpError)
        hideLoadingOverlay()

        // Fallback: usar URL de prueba
        const testUrl = getMercadoPagoTestUrl(reservas[0].id)
        router.push(testUrl)
      }
    } catch (error) {
      console.error("Error creating reserva:", error)
      hideLoadingOverlay()

      if (error.message?.includes("duplicate key")) {
        showLoadingOverlay(
          "error",
          "Horario no disponible",
          "Este horario ya fue reservado. Por favor elegí otro horario.",
        )
        setTimeout(() => {
          hideLoadingOverlay()
          loadHorariosOcupados()
        }, 3000)
      } else {
        showLoadingOverlay("error", "Error al procesar la reserva", "Hubo un problema. Por favor intentá nuevamente.")
        setTimeout(hideLoadingOverlay, 3000)
      }
    } finally {
      setIsReserving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información de la cancha...</p>
        </div>
      </div>
    )
  }

  if (!cancha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cancha no encontrada</h1>
          <Button asChild>
            <Link href="/canchas">Volver a canchas</Link>
          </Button>
        </div>
      </div>
    )
  }

  const horariosDisponibles = cancha.horarios.filter((h) => !horariosOcupados.includes(h))
  const finalPrice = weeklyRepeatEnabled ? cancha.precio * weeklyRepeatWeeks : cancha.precio
  const finalDeposit = Math.round(finalPrice * 0.2)

  return (
    <>
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
                <Link href="/canchas" className="text-green-700 hover:text-green-900 font-medium">
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

        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="outline" className="mb-6 bg-transparent">
            <Link href="/canchas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a canchas
            </Link>
          </Button>

          {/* Progress Bar */}
          <ReservationProgress
            currentStep={reservationStep}
            isLoading={isReserving}
            loadingMessage={
              reservationStep === 2
                ? "Validando información..."
                : reservationStep === 3
                  ? "Preparando pago..."
                  : undefined
            }
          />

          {selectedDate && horariosOcupados.length > 0 && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Horarios ocupados para el {selectedDate}: {horariosOcupados.join(", ")}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cancha Info */}
            <div>
              <div className="relative h-64 md:h-80 mb-6">
                <Image
                  src={cancha.imagen_url || "/placeholder.svg"}
                  alt={cancha.nombre}
                  fill
                  className="object-cover rounded-lg"
                />
                <Badge className={`absolute top-4 right-4 ${cancha.tipo === "F5" ? "bg-blue-600" : "bg-green-600"}`}>
                  {cancha.tipo}
                </Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {cancha.nombre}
                    <span className="text-2xl font-bold text-green-600">${cancha.precio.toLocaleString()}</span>
                  </CardTitle>
                  <CardDescription>{cancha.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span>{cancha.capacidad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>Duración: 1 hora</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span>Villa Ballester, San Martín</span>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Características:</h3>
                      <div className="flex flex-wrap gap-2">
                        {cancha.caracteristicas.map((caracteristica, index) => (
                          <Badge key={index} variant="secondary">
                            {caracteristica}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">
                        Disponibilidad {selectedDate ? `para ${selectedDate}` : ""}:
                      </h3>
                      <HorariosDisponibilidad
                        horarios={cancha.horarios}
                        horariosOcupados={horariosOcupados}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                        showAvailabilityOnly={false}
                      />
                      {selectedDate && horariosDisponibles.length === 0 && (
                        <Alert className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>No hay horarios disponibles para esta fecha.</strong>
                            <br />
                            Probá con otra fecha o contactanos por WhatsApp para consultar disponibilidad.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservation Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Reservar cancha
                  </CardTitle>
                  <CardDescription>Completá tus datos y pagá solo el 20% de seña</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                        disabled={isReserving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Horario *</Label>
                      <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={isReserving}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <option value="">Seleccionar</option>
                        {horariosDisponibles.map((horario) => (
                          <option key={horario} value={horario}>
                            {horario}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Tu nombre completo"
                      disabled={isReserving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={playerPhone}
                      onChange={(e) => setPlayerPhone(e.target.value)}
                      placeholder="+54 11 1234-5678"
                      disabled={isReserving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={playerEmail}
                      onChange={(e) => setPlayerEmail(e.target.value)}
                      placeholder="tu@email.com"
                      disabled={isReserving}
                    />
                    <p className="text-xs text-gray-500">Recibirás la confirmación por email</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments">Comentarios adicionales</Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Algún comentario especial..."
                      rows={3}
                      disabled={isReserving}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Repeat Selector */}
              {selectedDate && selectedTime && (
                <WeeklyRepeatSelector
                  isEnabled={weeklyRepeatEnabled}
                  onEnabledChange={setWeeklyRepeatEnabled}
                  weeks={weeklyRepeatWeeks}
                  onWeeksChange={setWeeklyRepeatWeeks}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  precio={cancha.precio}
                />
              )}

              {/* Price Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Precio {weeklyRepeatEnabled ? `total (${weeklyRepeatWeeks} turnos)` : "total"}:</span>
                      <span className="font-semibold">${finalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-700">
                      <span>Seña a pagar (20%):</span>
                      <span className="font-bold text-lg">${finalDeposit.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      El resto se paga en el lugar {weeklyRepeatEnabled ? "en cada turno" : "el día del partido"}
                    </p>
                  </div>

                  <Button
                    onClick={handleReservation}
                    disabled={isReserving || (selectedDate && horariosDisponibles.length === 0)}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-all duration-200"
                  >
                    {isReserving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        {weeklyRepeatEnabled ? `Reservar ${weeklyRepeatWeeks} turnos` : "Reservar y pagar seña"}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    Al hacer clic serás redirigido a Mercado Pago para completar el pago de la seña
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={loadingState.isVisible}
        type={loadingState.type}
        title={loadingState.title}
        description={loadingState.description}
      />

      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </>
  )
}
