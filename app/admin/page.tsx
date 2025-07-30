"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useReservaStore } from "@/lib/store"
import { Calendar, Users, DollarSign, TrendingUp, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { DatabaseStatus } from "@/components/database-status"

export default function AdminDashboard() {
  const { reservas, getEstadisticas } = useReservaStore()
  const estadisticas = getEstadisticas()

  const reservasRecientes = reservas
    .filter((r) => r.estado === "confirmada")
    .sort((a, b) => new Date(b.fechaReserva).getTime() - new Date(a.fechaReserva).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800">FutbolVB Admin</span>
            </Link>
            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href="/">Ver sitio público</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/estadisticas">Ver estadísticas detalladas</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <DatabaseStatus />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Administración</h1>
          <p className="text-gray-600">Gestión y estadísticas de las canchas de fútbol</p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.totalReservas}</div>
              <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${estadisticas.ingresosTotales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ingresos confirmados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancha Más Popular</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.canchasMasPopulares[0]?.nombre.split(" ")[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {estadisticas.canchasMasPopulares[0]?.reservas || 0} reservas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Día</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.reservasPorDia.length > 0
                  ? Math.round(estadisticas.totalReservas / estadisticas.reservasPorDia.length)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Reservas por día</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservas recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Reservas Recientes</CardTitle>
              <CardDescription>Últimas 5 reservas confirmadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservasRecientes.map((reserva) => (
                  <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Cancha {reserva.canchaId}</Badge>
                        <span className="font-medium">{reserva.jugador}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {reserva.fecha}
                        </span>
                        <span>{reserva.horario}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {reserva.telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {reserva.email}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${reserva.precio.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Seña: ${reserva.seña.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {reservasRecientes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No hay reservas recientes</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Canchas más populares */}
          <Card>
            <CardHeader>
              <CardTitle>Canchas Más Populares</CardTitle>
              <CardDescription>Ranking por número de reservas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estadisticas.canchasMasPopulares.map((cancha, index) => (
                  <div key={cancha.nombre} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                      </div>
                      <span className="font-medium">{cancha.nombre}</span>
                    </div>
                    <Badge variant="outline">{cancha.reservas} reservas</Badge>
                  </div>
                ))}
                {estadisticas.canchasMasPopulares.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestión del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-20 flex-col">
                <Link href="/admin/estadisticas">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Ver Estadísticas Detalladas
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/canchas">
                  <MapPin className="w-6 h-6 mb-2" />
                  Ver Canchas Públicas
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/contacto">
                  <Mail className="w-6 h-6 mb-2" />
                  Información de Contacto
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
