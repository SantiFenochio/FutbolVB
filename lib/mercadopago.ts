interface MercadoPagoPreference {
  items: Array<{
    title: string
    quantity: number
    unit_price: number
    currency_id: string
  }>
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return: string
  external_reference: string
  notification_url?: string
}

export async function createMercadoPagoPreference(
  reservaId: string,
  cancha: string,
  fecha: string,
  horario: string,
  sena: number,
): Promise<string> {
  // En producción, aquí harías la llamada real a la API de Mercado Pago
  const preference: MercadoPagoPreference = {
    items: [
      {
        title: `Seña - ${cancha} - ${fecha} ${horario}`,
        quantity: 1,
        unit_price: sena,
        currency_id: "ARS",
      },
    ],
    back_urls: {
      success: `${window.location.origin}/confirmacion?reserva=${reservaId}&status=success`,
      failure: `${window.location.origin}/confirmacion?reserva=${reservaId}&status=failure`,
      pending: `${window.location.origin}/confirmacion?reserva=${reservaId}&status=pending`,
    },
    auto_return: "approved",
    external_reference: reservaId,
    notification_url: `${window.location.origin}/api/mercadopago/webhook`,
  }

  // Simulación de respuesta de Mercado Pago
  console.log("Creando preferencia de Mercado Pago:", preference)

  // En producción, esto sería algo como:
  // const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(preference)
  // })
  // const data = await response.json()
  // return data.init_point

  // Por ahora, simulamos con un delay y retornamos una URL de prueba
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=simulado-${reservaId}`
}

export function getMercadoPagoTestUrl(
  reservaId: string,
  status: "success" | "failure" | "pending" = "success",
): string {
  return `/confirmacion?reserva=${reservaId}&status=${status}&payment_id=test-${Date.now()}`
}
