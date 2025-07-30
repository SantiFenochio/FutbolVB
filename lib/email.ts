import type { Reserva, Cancha } from "./supabase"

interface EmailData {
  to: string
  subject: string
  reserva: Reserva & { canchas: Cancha }
}

export async function enviarConfirmacionEmail(data: EmailData): Promise<boolean> {
  // Simular envío de email
  console.log("📧 Enviando email de confirmación:", {
    to: data.to,
    subject: data.subject,
    reserva: {
      cancha: data.reserva.canchas.nombre,
      fecha: data.reserva.fecha,
      horario: data.reserva.horario,
      jugador: data.reserva.jugador_nombre,
      precio: data.reserva.precio,
      sena: data.reserva.sena,
    },
  })

  // En producción, aquí integrarías con un servicio como:
  // - SendGrid
  // - Resend
  // - Nodemailer
  // - etc.

  /*
  Ejemplo con Resend:
  
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'FutbolVB <noreply@futbolvb.com>',
    to: data.to,
    subject: data.subject,
    html: `
      <h1>¡Reserva Confirmada!</h1>
      <p>Hola ${data.reserva.jugador_nombre},</p>
      <p>Tu reserva ha sido confirmada:</p>
      <ul>
        <li><strong>Cancha:</strong> ${data.reserva.canchas.nombre}</li>
        <li><strong>Fecha:</strong> ${data.reserva.fecha}</li>
        <li><strong>Horario:</strong> ${data.reserva.horario}</li>
        <li><strong>Precio total:</strong> $${data.reserva.precio.toLocaleString()}</li>
        <li><strong>Seña pagada:</strong> $${data.reserva.sena.toLocaleString()}</li>
      </ul>
      <p>¡Te esperamos!</p>
    `
  })
  */

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Email enviado exitosamente a ${data.to}`)
      resolve(true)
    }, 1000)
  })
}
