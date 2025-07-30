"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Calendar, MapPin, Users, Mail, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getReservaById, updateReservaStatus, type Reserva, type Cancha } from "@/lib/supabase"
import { enviarConfirmacionEmail } from "@/lib/email"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const [reserva, setReserva] = useState<(Reserva & { canchas: Cancha }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  const reservaId = searchParams.get("reserva")
  const status = searchParams.get("status") // success, failure, pending
  const paymentId = searchParams.get("payment_id")

  useEffect(() => {
    if (reservaId) {
      loadReserva()
    }
  }, [reservaId])

  const loadReserva = async () => {
    if (!reservaId) return

    try {
      const data = await getReservaById(reservaId)
      if (data) {
        setReserva(data)

        // Si el pago fue exitoso y la reserva aún está pendiente, actualizarla
        if (status === "success" && data.estado === "pendiente") {
          await processSuccessfulPayment(data)
        }
      }
    } catch (error) {
      console.error("Error loading reserva:", error)
    } finally {
      setLoading(false)
    }
  }

  const processSuccessfulPayment = async (reservaData: Reserva & { canchas: Cancha }) => {
    setProcessingPayment(true)

    try {
      // Actualizar estado de la reserva
      await updateReservaStatus(reservaData.id, "confirmada", paymentId || undefined)

      // Enviar email de confirmación
      await enviarConfirmacionEmail({
        to: reservaData.jugador_email,
        subject: "Confirmación de Reserva - FutbolVB",
        reserva: reservaData,
      })

      // Actualizar estado local
      setReserva((prev) => (prev ? { ...prev, estado: "confirmada", sena_pagada: true } : null))
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!reserva) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reserva no encontrada</h1>
          <Button asChild>
            <Link href="/canchas">Volver a canchas</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    if (processingPayment) {
      return {
        icon: <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />,
        title: "Procesando pago...",
        description: "Estamos confirmando tu reserva",
        color: "blue",
      }
    }

    switch (status) {
      case "success":
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-600" />,
          title: "¡Reserva confirmada!",
          description: "Tu pago fue procesado exitosamente",
          color: "green",
        }
      case "failure":
        return {
          icon: <XCircle className="w-16 h-16 text-red-600" />,
          title: "Pago rechazado",
          description: "Hubo un problema con tu pago",
          color: "red",
        }
      case "pending":
        return {
          icon: <Clock className="w-16 h-16 text-yellow-600" />,
          title: "Pago pendiente",
          description: "Tu pago está siendo procesado",
          color: "yellow",
        }
      default:
        return {
          icon: <Clock className="w-16 h-16 text-gray-600" />,
          title: "Estado desconocido",
          description: "Verificando el estado de tu reserva",
          color: "gray",
        }
    }
  }

  const statusInfo = getStatusInfo()

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
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Status Card */}
          <Card className="mb-8">
            <CardContent className="text-center py-8">
              <div className="mb-4 flex justify-center">{statusInfo.icon}</div>
              <h1 className={`text-2xl font-bold mb-2 text-${statusInfo.color}-800`}>{statusInfo.title}</h1>
              <p className="text-gray-600 mb-4">{statusInfo.description}</p>

              {status === "success" && (
                <Badge className="bg-green-100 text-green-800">Email de confirmación enviado</Badge>
              )}
            </CardContent>
          </Card>

          {/* Reservation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Reserva</CardTitle>
              <CardDescription>Información completa de tu reserva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reserva.canchas.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{reserva.fecha}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{reserva.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{reserva.canchas.capacidad}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Jugador:</span>
                    <p className="text-gray-600">{reserva.jugador_nombre}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{reserva.jugador_telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{reserva.jugador_email}</span>
                  </div>
                </div>
              </div>

              {reserva.comentarios && (
                <div>
                  <span className="font-medium">Comentarios:</span>
                  <p className="text-gray-600 mt-1">{reserva.comentarios}</p>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Resumen de Pago</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Precio total:</span>
                    <span className="font-medium">${reserva.precio.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seña pagada (20%):</span>
                    <span className={`font-medium ${reserva.sena_pagada ? "text-green-600" : "text-red-600"}`}>
                      ${reserva.sena.toLocaleString()}
                      {reserva.sena_pagada ? " ✓" : " ✗"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Resto a pagar en el lugar:</span>
                    <span className="font-bold">${(reserva.precio - reserva.sena).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge
                  className={
                    reserva.estado === "confirmada"
                      ? "bg-green-100 text-green-800"
                      : reserva.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  Estado: {reserva.estado.toUpperCase()}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/canchas">Hacer otra reserva</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/contacto">Contactar soporte</Link>
                </Button>
              </div>

              {status === "failure" && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-700 text-sm">
                    Si tenés problemas con el pago, podés intentar nuevamente o contactarnos por WhatsApp. Tu reserva
                    quedará guardada por 30 minutos.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
