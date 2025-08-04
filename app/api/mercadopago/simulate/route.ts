import { type NextRequest, NextResponse } from "next/server"
import { updateReservaPago } from "@/lib/supabase"
import { sendConfirmationEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reservaId = searchParams.get("reserva_id")
  const action = searchParams.get("action") || "success"

  if (!reservaId) {
    return NextResponse.redirect(new URL("/canchas", request.url))
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  try {
    if (action === "success") {
      // Simular pago exitoso
      await updateReservaPago(Number.parseInt(reservaId), {
        sena_pagada: true,
        estado: "confirmada",
        mercadopago_payment_id: `sim_${Date.now()}`,
      })

      // Enviar email de confirmación
      try {
        await sendConfirmationEmail(Number.parseInt(reservaId))
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError)
      }

      return NextResponse.redirect(
        new URL(`/confirmacion?payment_id=sim_${Date.now()}&status=approved&reserva_id=${reservaId}`, request.url),
      )
    } else {
      // Simular pago fallido
      await updateReservaPago(Number.parseInt(reservaId), {
        estado: "cancelada",
      })

      return NextResponse.redirect(new URL(`/canchas/${reservaId}?error=payment_failed`, request.url))
    }
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.redirect(new URL("/canchas", request.url))
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { reservaId, action } = body

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return NextResponse.json({
    redirect_url: `${baseUrl}/api/mercadopago/simulate?reserva_id=${reservaId}&action=${action}`,
  })
}
