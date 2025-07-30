"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users, DollarSign, TrendingUp, Loader2, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { getAllReservas, getEstadisticas, type Reserva, type Cancha } from "@/lib/supabase"

export default function EstadisticasPage() {
  const [reservas, setReservas] = useState<(Reserva & { canchas: Cancha })[]>([])
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [reservasData, estadisticasData] = await Promise.all([getAllReservas(), getEstadisticas()])

      setReservas(reservasData)
      setEstadisticas(estadisticasData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const reservasRecientes = reservas.slice(0, 10)
  const reservasPorEstado = reservas.reduce(
    (acc, r) => {
      acc[r.estado] = (acc[r.estado] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">FutbolVB Admin</span>
            </Link>
            <Button asChild variant="outline">
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Estadísticas Detalladas</h1>
          <p className="text-gray-600">Análisis completo del rendimiento de las canchas</p>
        </div>

        {/* Resumen general */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas?.totalReservas || 0}</div>
              <p className="text-xs text-muted-foreground">Confirmadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservasPorEstado.pendiente || 0}</div>
              <p className="text-xs text-muted-foreground">Por confirmar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservasPorEstado.cancelada || 0}</div>
              <p className="text-xs text-muted-foreground">Cancelaciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${estadisticas?.ingresosTotales?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Confirmados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Señas Recaudadas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${estadisticas?.senasRecaudadas?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Pagadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservas recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Reservas Recientes
              </CardTitle>
              <CardDescription>Últimas 10 reservas realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reservasRecientes.map((reserva) => (
                  <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            reserva.estado === "confirmada"
                              ? "bg-green-100 text-green-800"
                              : reserva.estado === "pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {reserva.estado}
                        </Badge>
                        <span className="font-medium">{reserva.jugador_nombre}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{reserva.canchas.nombre}</span> • {reserva.fecha} •{" "}
                        {reserva.horario}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {reserva.jugador_telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {reserva.jugador_email}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${reserva.precio.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        Seña: ${reserva.sena.toLocaleString()}
                        {reserva.sena_pagada ? " ✓" : " ✗"}
                      </div>
                    </div>
                  </div>
                ))}
                {reservasRecientes.length === 0 && <p className="text-gray-500 text-center py-4">No hay reservas</p>}
              </div>
            </CardContent>
          </Card>

          {/* Ranking de canchas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ranking de Canchas
              </CardTitle>
              <CardDescription>Por número de reservas confirmadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticas?.canchasMasPopulares?.map((cancha, index) => (
                  <div key={cancha.nombre} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-600"
                              : index === 1
                                ? "bg-gray-100 text-gray-600"
                                : index === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-green-100 text-green-600"
                          }`}
                        >
                          <span className="text-sm font-bold">#{index + 1}</span>
                        </div>
                        <span className="font-medium">{cancha.nombre}</span>
                      </div>
                      <Badge variant="outline">{cancha.reservas} reservas</Badge>
                    </div>
                  </div>
                )) || <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ocupación por día */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Ocupación por Día
            </CardTitle>
            <CardDescription>Actividad diaria de reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estadisticas?.reservasPorDia?.slice(-21).map((dia) => (
                <div key={dia.fecha} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{dia.fecha}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((dia.cantidad / Math.max(...(estadisticas?.reservasPorDia?.map((d) => d.cantidad) || [1]))) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <Badge variant="secondary">{dia.cantidad}</Badge>
                  </div>
                </div>
              )) || <p className="text-gray-500 text-center py-4 col-span-full">No hay datos disponibles</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
