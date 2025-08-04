"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  Mail,
  Phone,
  Loader2,
  CreditCard,
  FileText,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getReservaById, updateReservaStatus, type Reserva, type Cancha } from "@/lib/supabase"
import { enviarConfirmacionEmail } from "@/lib/email"
import { ReservationProgress } from "@/components/reservation-progress"
import { LoadingOverlay } from "@/components/loading-overlay"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const [reserva, setReserva] = useState<(Reserva & { canchas: Cancha }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(4)
  const [loadingState, setLoadingState] = useState({
    isVisible: false,
    type: "processing" as "processing" | "payment" | "success" | "error",
    title: "",
    description: "",
  })

  const reservaId = searchParams.get("reserva")
  const status = searchParams.get("status") // success, failure, pending
  const paymentId = searchParams.get("payment_id")

  useEffect(() => {
    if (reservaId) {
      loadReserva()
    }
  }, [reservaId])

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

    showLoadingOverlay("processing", "Confirmando tu pago...", "Estamos procesando la confirmación de tu reserva")

    try {
      // Simular delay para mostrar la animación
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Actualizar estado de la reserva
      await updateReservaStatus(reservaData.id, "confirmada", paymentId || undefined)

      // Enviar email de confirmación
      await enviarConfirmacionEmail({
        to: reservaData.jugador_email,
        subject: "Confirmación de Reserva - FutbolVB",
        reserva: reservaData,
      })

      // Mostrar éxito
      showLoadingOverlay(
        "success",
        "¡Pago confirmado exitosamente!",
        "Tu reserva ha sido confirmada y recibirás un email de confirmación",
      )

      // Actualizar estado local
      setReserva((prev) => (prev ? { ...prev, estado: "confirmada", sena_pagada: true } : null))

      setTimeout(hideLoadingOverlay, 3000)
    } catch (error) {
      console.error("Error processing payment:", error)
      showLoadingOverlay(
        "error",
        "Error al confirmar el pago",
        "Hubo un problema al procesar la confirmación. Contacta con soporte.",
      )
      setTimeout(hideLoadingOverlay, 4000)
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información de la reserva...</p>
        </div>
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
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <ReservationProgress
              currentStep={currentStep}
              isLoading={processingPayment}
              loadingMessage={processingPayment ? "Confirmando pago..." : undefined}
            />

            {/* Status Card */}
            <Card className="mb-8 border-2 border-dashed border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="text-center py-8">
                <div className="mb-4 flex justify-center">{statusInfo.icon}</div>
                <h1 className={`text-3xl font-bold mb-2 text-${statusInfo.color}-800`}>{statusInfo.title}</h1>
                <p className="text-gray-600 mb-4 text-lg">{statusInfo.description}</p>

                {status === "success" && (
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      <Mail className="w-3 h-3 mr-1" />
                      Email enviado
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      <CreditCard className="w-3 h-3 mr-1" />
                      Pago confirmado
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reservation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resumen de la Reserva
                  </CardTitle>
                  <CardDescription>Información completa de tu reserva</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cancha Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{reserva.canchas.nombre}</h3>
                        <p className="text-gray-600">{reserva.canchas.descripcion}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={reserva.canchas.tipo === "F5" ? "bg-blue-600" : "bg-green-600"}>
                            {reserva.canchas.tipo}
                          </Badge>
                          <span className="text-sm text-gray-500">{reserva.canchas.capacidad}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(reserva.fecha).toLocaleDateString("es-AR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Horario</p>
                        <p className="font-semibold text-gray-800">{reserva.horario}</p>
                      </div>
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Datos del jugador:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{reserva.jugador_nombre}</span>
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
                      <h4 className="font-semibold text-gray-800 mb-2">Comentarios:</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg italic">"{reserva.comentarios}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Resumen de Pago
                  </CardTitle>
                  <CardDescription>Detalles financieros de tu reserva</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Precio por turno:</span>
                        <span className="font-medium text-gray-800">${reserva.precio.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Seña pagada (20%):</span>
                        <span
                          className={`font-semibold text-lg ${reserva.sena_pagada ? "text-green-600" : "text-red-600"}`}
                        >
                          ${reserva.sena.toLocaleString()}
                          {reserva.sena_pagada ? " ✓" : " ✗"}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">Resto a pagar en el lugar:</span>
                          <span className="font-bold text-xl text-gray-800">
                            ${(reserva.precio - reserva.sena).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="text-center">
                    <Badge
                      className={`text-sm px-4 py-2 ${
                        reserva.estado === "confirmada"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : reserva.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-red-100 text-red-800 border-red-300"
                      }`}
                    >
                      Estado: {reserva.estado.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Información importante:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Llegá 10 minutos antes del turno</li>
                      <li>• Traé documento de identidad</li>
                      <li>• El resto se paga en efectivo o transferencia</li>
                      <li>• Cancelaciones hasta 2hs antes sin cargo</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <Link href="/canchas">
                        <Calendar className="w-4 h-4 mr-2" />
                        Hacer otra reserva
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/contacto">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contactar soporte
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Message for Failed Payments */}
            {status === "failure" && (
              <Card className="mt-8 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Problema con el pago</h3>
                      <p className="text-red-700 text-sm mb-4">
                        Si tenés problemas con el pago, podés intentar nuevamente o contactarnos por WhatsApp. Tu
                        reserva quedará guardada por 30 minutos para que puedas completar el proceso.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="bg-white border-red-300 text-red-700 hover:bg-red-50">
                          Intentar pago nuevamente
                        </Button>
                        <Button asChild className="bg-green-500 hover:bg-green-600">
                          <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contactar por WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
