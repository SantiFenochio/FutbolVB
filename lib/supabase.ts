import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Cancha {
  id: number
  nombre: string
  tipo: "F5" | "F10" | "MIXTA" // Agregamos tipo MIXTA para canchas que ofrecen ambos
  precio: number
  precio_f5?: number // Precio específico para F5
  precio_f10?: number // Precio específico para F10
  descripcion: string
  descripcion_f5?: string
  descripcion_f10?: string
  capacidad: string
  capacidad_f5?: string
  capacidad_f10?: string
  caracteristicas: string[]
  caracteristicas_f5?: string[]
  caracteristicas_f10?: string[]
  horarios: string[]
  imagen_url: string
  imagen_f5_url?: string
  imagen_f10_url?: string
  activa: boolean
  created_at: string
}

export interface Reserva {
  id: string
  cancha_id: number
  tipo_seleccionado?: "F5" | "F10" // Tipo seleccionado para canchas mixtas
  fecha: string
  horario: string
  jugador_nombre: string
  jugador_telefono: string
  jugador_email: string
  precio: number
  sena: number
  sena_pagada: boolean
  comentarios?: string
  estado: "pendiente" | "confirmada" | "cancelada"
  mercadopago_id?: string
  mercadopago_status?: string
  created_at: string
  updated_at: string
  canchas?: Cancha
}

// Add fallback mock data with real images
const MOCK_CANCHAS: Cancha[] = [
  {
    id: 1,
    nombre: "Boulevard",
    tipo: "MIXTA",
    precio: 15000, // Precio por defecto (F10)
    precio_f5: 8000,
    precio_f10: 15000,
    descripcion: "Cancha principal con iluminación profesional",
    descripcion_f5: "Perfecta para partidos íntimos de fútbol 5",
    descripcion_f10: "Cancha principal con iluminación nocturna profesional",
    capacidad: "10-20 jugadores",
    capacidad_f5: "10 jugadores",
    capacidad_f10: "20 jugadores",
    caracteristicas: ["Césped sintético", "Iluminación LED profesional", "Vestuarios", "Estacionamiento"],
    caracteristicas_f5: ["Césped sintético", "Iluminación LED", "Vestuarios"],
    caracteristicas_f10: [
      "Césped sintético",
      "Iluminación LED profesional",
      "Vestuarios",
      "Estacionamiento",
      "Tribuna",
    ],
    horarios: [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    imagen_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boulevard.PNG-13Fr9bx3zlaCfU5McLZTtmo0Jmtlu6.png",
    imagen_f5_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boulevard.PNG-13Fr9bx3zlaCfU5McLZTtmo0Jmtlu6.png",
    imagen_f10_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boulevard.PNG-13Fr9bx3zlaCfU5McLZTtmo0Jmtlu6.png",
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nombre: "La Calle",
    tipo: "MIXTA",
    precio: 8000, // Precio por defecto (F5)
    precio_f5: 8000,
    precio_f10: 12000,
    descripcion: "Cancha techada amplia y luminosa",
    descripcion_f5: "Cancha techada perfecta para partidos íntimos",
    descripcion_f10: "Amplia cancha techada para grupos grandes",
    capacidad: "10-20 jugadores",
    capacidad_f5: "10 jugadores",
    capacidad_f10: "20 jugadores",
    caracteristicas: ["Techada", "Césped sintético", "Iluminación LED", "Vestuarios"],
    caracteristicas_f5: ["Techada", "Césped sintético", "Iluminación LED", "Vestuarios"],
    caracteristicas_f10: ["Techada", "Césped sintético", "Iluminación LED", "Vestuarios", "Climatizada"],
    horarios: [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    imagen_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/La%20Calle.PNG-rwingc5EihswrlCx6DFPzla8wqeBGQ.png",
    imagen_f5_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/La%20Calle.PNG-rwingc5EihswrlCx6DFPzla8wqeBGQ.png",
    imagen_f10_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/La%20Calle.PNG-rwingc5EihswrlCx6DFPzla8wqeBGQ.png",
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    nombre: "El Playón",
    tipo: "F10",
    precio: 18000,
    descripcion: "Cancha descubierta con césped sintético premium",
    capacidad: "20 jugadores",
    caracteristicas: [
      "Césped sintético premium",
      "Descubierta",
      "Vestuarios",
      "Estacionamiento",
      "Publicidad profesional",
    ],
    horarios: [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    imagen_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/El%20Playon.PNG-0HOP7V6TiAnjECKHLd3snidrOFguid.png",
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    nombre: "Italia",
    tipo: "F5",
    precio: 9000,
    descripcion: "Cancha techada con ambiente íntimo y profesional",
    capacidad: "10 jugadores",
    caracteristicas: ["Techada", "Césped sintético", "Iluminación LED", "Vestuarios", "Ambiente íntimo"],
    horarios: [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
    ],
    imagen_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/italia.PNG-Rgm19dOyhDK3iTruSD4zpdbEpLxJbF.png",
    activa: true,
    created_at: new Date().toISOString(),
  },
]

// Funciones para canchas
// Update the getCanchas function to use fallback data
export async function getCanchas(): Promise<Cancha[]> {
  try {
    const { data, error } = await supabase.from("canchas").select("*").eq("activa", true).order("id")

    if (error) {
      console.warn("Database not available, using mock data:", error.message)
      return MOCK_CANCHAS
    }

    return data || MOCK_CANCHAS
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_CANCHAS
  }
}

// Update getCanchaById function
export async function getCanchaById(id: number): Promise<Cancha | null> {
  try {
    const { data, error } = await supabase.from("canchas").select("*").eq("id", id).eq("activa", true).single()

    if (error) {
      console.warn("Database not available, using mock data:", error.message)
      return MOCK_CANCHAS.find((c) => c.id === id) || null
    }

    return data
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_CANCHAS.find((c) => c.id === id) || null
  }
}

// Funciones para reservas
// Update createReserva function
export async function createReserva(reserva: Omit<Reserva, "id" | "created_at" | "updated_at">): Promise<Reserva> {
  try {
    const { data, error } = await supabase.from("reservas").insert([reserva]).select().single()

    if (error) {
      console.warn("Database not available, simulating reservation creation:", error.message)
      // Return a mock reservation for demo purposes
      return {
        ...reserva,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Reserva
    }

    return data
  } catch (error) {
    console.warn("Database connection failed, simulating reservation creation:", error)
    // Return a mock reservation for demo purposes
    return {
      ...reserva,
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Reserva
  }
}

// Update getReservasByCancha function - now considers tipo_seleccionado for mixed courts
export async function getReservasByCancha(
  canchaId: number,
  fecha: string,
  tipoSeleccionado?: "F5" | "F10",
): Promise<string[]> {
  try {
    let query = supabase
      .from("reservas")
      .select("horario")
      .eq("cancha_id", canchaId)
      .eq("fecha", fecha)
      .in("estado", ["confirmada", "pendiente"])

    // Para canchas mixtas, filtrar por tipo seleccionado
    if (tipoSeleccionado) {
      query = query.eq("tipo_seleccionado", tipoSeleccionado)
    }

    const { data, error } = await query

    if (error) {
      console.warn("Database not available, returning empty reservations:", error.message)
      return []
    }

    return data?.map((r) => r.horario) || []
  } catch (error) {
    console.warn("Database connection failed, returning empty reservations:", error)
    return []
  }
}

// Update other functions with similar error handling
export async function getReservaById(id: string): Promise<Reserva | null> {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select(`
        *,
        canchas (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.warn("Database not available:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.warn("Database connection failed:", error)
    return null
  }
}

export async function updateReservaStatus(id: string, status: string, mercadopagoId?: string): Promise<void> {
  try {
    const updateData: any = {
      estado: status,
      updated_at: new Date().toISOString(),
    }

    if (status === "confirmada") {
      updateData.sena_pagada = true
    }

    if (mercadopagoId) {
      updateData.mercadopago_id = mercadopagoId
    }

    const { error } = await supabase.from("reservas").update(updateData).eq("id", id)

    if (error) {
      console.warn("Database not available for status update:", error.message)
    }
  } catch (error) {
    console.warn("Database connection failed for status update:", error)
  }
}

export async function getAllReservas(): Promise<Reserva[]> {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select(`
        *,
        canchas (*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Database not available, returning empty reservations:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.warn("Database connection failed, returning empty reservations:", error)
    return []
  }
}

export async function getEstadisticas() {
  try {
    const { data: reservas, error } = await supabase.from("reservas").select(`
        *,
        canchas (nombre)
      `)

    if (error) {
      console.warn("Database not available, returning mock statistics:", error.message)
      return {
        totalReservas: 0,
        ingresosTotales: 0,
        senasRecaudadas: 0,
        canchasMasPopulares: [],
        reservasPorDia: [],
        ocupacionPromedio: 0,
      }
    }

    const reservasConfirmadas = reservas?.filter((r) => r.estado === "confirmada") || []

    const totalReservas = reservasConfirmadas.length
    const ingresosTotales = reservasConfirmadas.reduce((total, r) => total + r.precio, 0)
    const senasRecaudadas = reservasConfirmadas.filter((r) => r.sena_pagada).reduce((total, r) => total + r.sena, 0)

    // Canchas más populares
    const canchaCount = reservasConfirmadas.reduce(
      (acc, r) => {
        const nombre = r.canchas?.nombre || `Cancha ${r.cancha_id}`
        const nombreCompleto = r.tipo_seleccionado ? `${nombre} ${r.tipo_seleccionado}` : nombre
        acc[nombreCompleto] = (acc[nombreCompleto] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const canchasMasPopulares = Object.entries(canchaCount)
      .map(([nombre, reservas]) => ({ nombre, reservas }))
      .sort((a, b) => b.reservas - a.reservas)

    // Reservas por día
    const reservasPorDia = reservasConfirmadas.reduce(
      (acc, r) => {
        acc[r.fecha] = (acc[r.fecha] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const reservasPorDiaArray = Object.entries(reservasPorDia)
      .map(([fecha, cantidad]) => ({ fecha, cantidad }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))

    return {
      totalReservas,
      ingresosTotales,
      senasRecaudadas,
      canchasMasPopulares,
      reservasPorDia: reservasPorDiaArray,
      ocupacionPromedio: totalReservas > 0 ? Math.round((totalReservas / (reservasPorDiaArray.length * 4)) * 100) : 0,
    }
  } catch (error) {
    console.warn("Database connection failed, returning mock statistics:", error)
    return {
      totalReservas: 0,
      ingresosTotales: 0,
      senasRecaudadas: 0,
      canchasMasPopulares: [],
      reservasPorDia: [],
      ocupacionPromedio: 0,
    }
  }
}
