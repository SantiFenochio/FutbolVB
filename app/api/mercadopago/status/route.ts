import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get("payment_id")

  if (!paymentId) {
    return NextResponse.json({ error: "Payment ID required" }, { status: 400 })
  }

  try {
    // En un entorno real, aquí consultarías la API de MercadoPago
    // Por ahora, simulamos la respuesta
    const paymentData = {
      id: paymentId,
      status: "approved",
      status_detail: "accredited",
      transaction_amount: 5000,
      currency_id: "ARS",
      date_created: new Date().toISOString(),
      date_approved: new Date().toISOString(),
      external_reference: "1",
      description: "Reserva de cancha",
      payer: {
        email: "test@test.com",
      },
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
