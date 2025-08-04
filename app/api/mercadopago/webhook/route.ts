import { type NextRequest, NextResponse } from "next/server"
import { updateReservaPago } from "@/lib/supabase"
import { sendConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Webhook received:", body)

    // Verificar que es una notificación de pago
    if (body.type !== "payment") {
      return NextResponse.json({ status: "ignored" })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: "No payment ID" }, { status: 400 })
    }

    // En un entorno real, aquí consultarías la API de MercadoPago para obtener los detalles del pago
    // Por ahora, simulamos la respuesta
    const paymentData = {
      id: paymentId,
      status: "approved", // approved, pending, rejected, cancelled
      external_reference: body.external_reference || "1",
      transaction_amount: 5000,
      metadata: {
        reserva_id: body.external_reference || "1",
      },
    }

    const reservaId = Number.parseInt(paymentData.external_reference)

    // Actualizar el estado de la reserva
    if (paymentData.status === "approved") {
      await updateReservaPago(reservaId, {
        sena_pagada: true,
        estado: "confirmada",
        mercadopago_payment_id: paymentId.toString(),
      })

      // Enviar email de confirmación
      try {
        await sendConfirmationEmail(reservaId)
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError)
      }
    } else if (paymentData.status === "rejected" || paymentData.status === "cancelled") {
      await updateReservaPago(reservaId, {
        estado: "cancelada",
      })
    }

    return NextResponse.json({ status: "processed" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint is working" })
}
