"use client"

import { create } from "zustand"

interface Reserva {
  id: string
  canchaId: number
  fecha: string
  horario: string
  jugador: string
  telefono: string
  email: string
  precio: number
  seña: number
  estado: "confirmada" | "pendiente" | "cancelada"
  fechaReserva: string
}

interface ReservaStore {
  reservas: Reserva[]
  addReserva: (reserva: Omit<Reserva, "id" | "fechaReserva">) => void
  getReservasByCancha: (canchaId: number, fecha: string) => string[]
  isHorarioOcupado: (canchaId: number, fecha: string, horario: string) => boolean
  getEstadisticas: () => {
    totalReservas: number
    ingresosTotales: number
    canchasMasPopulares: { nombre: string; reservas: number }[]
    reservasPorDia: { fecha: string; cantidad: number }[]
  }
}

export const useReservaStore = create<ReservaStore>((set, get) => ({
  reservas: [
    // Datos de ejemplo
    {
      id: "1",
      canchaId: 1,
      fecha: "2024-01-15",
      horario: "18:00",
      jugador: "Juan Pérez",
      telefono: "+54 11 1234-5678",
      email: "juan@email.com",
      precio: 15000,
      seña: 3000,
      estado: "confirmada",
      fechaReserva: "2024-01-10",
    },
    {
      id: "2",
      canchaId: 2,
      fecha: "2024-01-15",
      horario: "20:00",
      jugador: "María García",
      telefono: "+54 11 9876-5432",
      email: "maria@email.com",
      precio: 8000,
      seña: 1600,
      estado: "confirmada",
      fechaReserva: "2024-01-12",
    },
  ],

  addReserva: (reservaData) => {
    const nuevaReserva: Reserva = {
      ...reservaData,
      id: Date.now().toString(),
      fechaReserva: new Date().toISOString().split("T")[0],
    }
    set((state) => ({
      reservas: [...state.reservas, nuevaReserva],
    }))
  },

  getReservasByCancha: (canchaId, fecha) => {
    const reservas = get().reservas
    return reservas
      .filter((r) => r.canchaId === canchaId && r.fecha === fecha && r.estado === "confirmada")
      .map((r) => r.horario)
  },

  isHorarioOcupado: (canchaId, fecha, horario) => {
    const horariosOcupados = get().getReservasByCancha(canchaId, fecha)
    return horariosOcupados.includes(horario)
  },

  getEstadisticas: () => {
    const reservas = get().reservas.filter((r) => r.estado === "confirmada")

    const totalReservas = reservas.length
    const ingresosTotales = reservas.reduce((total, r) => total + r.precio, 0)

    // Canchas más populares
    const canchaCount = reservas.reduce(
      (acc, r) => {
        acc[r.canchaId] = (acc[r.canchaId] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const canchaNames = {
      1: "Boulevard",
      2: "La Calle",
      3: "El Playón",
      4: "Italia",
    }

    const canchasMasPopulares = Object.entries(canchaCount)
      .map(([id, count]) => ({
        nombre: canchaNames[Number.parseInt(id)] || `Cancha ${id}`,
        reservas: count,
      }))
      .sort((a, b) => b.reservas - a.reservas)

    // Reservas por día
    const reservasPorDia = reservas.reduce(
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
      canchasMasPopulares,
      reservasPorDia: reservasPorDiaArray,
    }
  },
}))
