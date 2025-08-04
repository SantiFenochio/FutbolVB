"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Loader2, Shield, Clock, CheckCircle } from "lucide-react"
import { createMercadoPagoPreference, getMercadoPagoTestUrl } from "@/lib/mercadopago"

interface MercadoPagoButtonProps {
  reservaId: number
  canchaName: string
  fecha: string
  horario: string
  precio: number
  jugadorEmail: string
  isWeekly?: boolean
  weekCount?: number
  disabled?: boolean
  onPaymentStart?: () => void
  onPaymentError?: (error: string) => void
}

export function MercadoPagoButton({
  reservaId,
  canchaName,
  fecha,
  horario,
  precio,
  jugadorEmail,
  isWeekly = false,
  weekCount = 1,
  disabled = false,
  onPaymentStart,
  onPaymentError,
}: MercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = isWeekly ? precio * weekCount : precio

  const handlePayment = async () => {
    if (disabled) return

    setIsLoading(true)
    onPaymentStart?.()

    try {
      // En desarrollo, usar simulador
      if (process.env.NODE_ENV === "development") {
        const testUrl = getMercadoPagoTestUrl(reservaId)
        window.location.href = testUrl
        return
      }

      // En producción, crear preferencia real
      const paymentUrl = await createMercadoPagoPreference(
        reservaId,
        canchaName,
        fecha,
        horario,
        totalPrice,
        jugadorEmail,
        isWeekly,
        weekCount,
      )

      window.location.href = paymentUrl
    } catch (error) {
      console.error("Error creating payment:", error)
      onPaymentError?.("Error al procesar el pago. Por favor intentá nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CreditCard className="w-5 h-5" />
          Pagar con Mercado Pago
        </CardTitle>
        <CardDescription className="text-green-700">Pago seguro y protegido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumen del pago */}
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {isWeekly ? `${weekCount} turnos semanales` : "Seña (20%)"}:
              </span>
              <span className="font-semibold">${totalPrice.toLocaleString()}</span>
            </div>
            {isWeekly && <div className="text-xs text-gray-500">Reserva semanal por {weekCount} semanas</div>}
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            <CreditCard className="w-3 h-3 mr-1" />
            Tarjetas
          </Badge>
          <Badge variant="outline" className="text-xs">
            Débito
          </Badge>
          <Badge variant="outline" className="text-xs">
            Efectivo
          </Badge>
          <Badge variant="outline" className="text-xs">
            Transferencia
          </Badge>
        </div>

        {/* Información de seguridad */}
        <div className="flex items-center gap-2 text-xs text-green-700">
          <Shield className="w-4 h-4" />
          <span>Pago 100% seguro y encriptado</span>
        </div>

        {/* Botón de pago */}
        <Button
          onClick={handlePayment}
          disabled={disabled || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirigiendo a Mercado Pago...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar ${totalPrice.toLocaleString()}
            </>
          )}
        </Button>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>El link de pago expira en 30 minutos</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Confirmación inmediata por email</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
