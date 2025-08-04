import { MercadoPagoConfig, Preference } from "mercadopago"

// Configuración de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
  options: {
    timeout: 5000,
    idempotencyKey: "abc",
  },
})

const preference = new Preference(client)

export interface ReservaData {
  id: number
  cancha_nombre: string
  fecha: string
  horario: string
  precio: number
  jugador_nombre: string
  jugador_email: string
  isWeekly?: boolean
  weekCount?: number
}

export async function createMercadoPagoPreference(
  reservaId: number,
  canchaName: string,
  fecha: string,
  horario: string,
  precio: number,
  jugadorEmail?: string,
  isWeekly = false,
  weekCount = 1,
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const totalPrice = isWeekly ? precio * weekCount : precio

    const preferenceData = {
      items: [
        {
          id: reservaId.toString(),
          title: isWeekly ? `${canchaName} - ${weekCount} turnos semanales` : `${canchaName} - ${fecha} ${horario}`,
          description: isWeekly
            ? `Reserva semanal por ${weekCount} semanas - ${fecha} ${horario}`
            : `Reserva cancha ${canchaName} para el ${fecha} a las ${horario}`,
          quantity: 1,
          unit_price: totalPrice,
          currency_id: "ARS",
        },
      ],
      payer: {
        email: jugadorEmail || "test@test.com",
      },
      back_urls: {
        success: `${baseUrl}/confirmacion?payment_id={{payment_id}}&status={{payment_status}}&merchant_order_id={{merchant_order_id}}&reserva_id=${reservaId}`,
        failure: `${baseUrl}/canchas/${reservaId}?error=payment_failed`,
        pending: `${baseUrl}/confirmacion?payment_id={{payment_id}}&status={{payment_status}}&merchant_order_id={{merchant_order_id}}&reserva_id=${reservaId}`,
      },
      auto_return: "approved" as const,
      external_reference: reservaId.toString(),
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      metadata: {
        reserva_id: reservaId,
        cancha_name: canchaName,
        fecha,
        horario,
        is_weekly: isWeekly,
        week_count: weekCount,
      },
    }

    const response = await preference.create({ body: preferenceData })

    if (response.init_point) {
      return response.init_point
    } else {
      throw new Error("No se pudo crear la preferencia de pago")
    }
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error)
    throw error
  }
}

export function getMercadoPagoTestUrl(reservaId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/api/mercadopago/simulate?reserva_id=${reservaId}`
}

export function mapMercadoPagoStatus(status: string): "pendiente" | "confirmada" | "cancelada" {
  switch (status) {
    case "approved":
      return "confirmada"
    case "pending":
    case "in_process":
      return "pendiente"
    case "cancelled":
    case "rejected":
      return "cancelada"
    default:
      return "pendiente"
  }
}
