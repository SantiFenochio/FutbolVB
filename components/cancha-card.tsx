"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Droplets, Lightbulb, Home, Crown, Zap, Users, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Cancha } from "@/lib/supabase"

interface CanchaCardProps {
  cancha: Cancha
  horariosDisponibles: number
  selectedDate?: string
  selectedTime?: string
}

export function CanchaCard({ cancha, horariosDisponibles, selectedDate, selectedTime }: CanchaCardProps) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<"F5" | "F10">(
    cancha.tipo === "MIXTA" ? "F10" : (cancha.tipo as "F5" | "F10"),
  )

  const getCaracteristicaIcon = (caracteristica: string) => {
    const lower = caracteristica.toLowerCase()
    if (lower.includes("vestuario")) return <Home className="w-4 h-4" />
    if (lower.includes("iluminación") || lower.includes("led")) return <Lightbulb className="w-4 h-4" />
    if (lower.includes("estacionamiento")) return <Car className="w-4 h-4" />
    if (lower.includes("techada")) return <Home className="w-4 h-4" />
    if (lower.includes("climatizada")) return <Droplets className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const getMasReservada = (cancha: Cancha) => {
    return cancha.id === 1 // Boulevard es la más reservada
  }

  const esTechada = (caracteristicas: string[]) => {
    return caracteristicas.some((c) => c.toLowerCase().includes("techada"))
  }

  // Obtener datos según el tipo seleccionado
  const getDatosSegunTipo = () => {
    if (cancha.tipo !== "MIXTA") {
      return {
        precio: cancha.precio,
        descripcion: cancha.descripcion,
        capacidad: cancha.capacidad,
        caracteristicas: cancha.caracteristicas,
        imagen: cancha.imagen_url,
      }
    }

    if (tipoSeleccionado === "F5") {
      return {
        precio: cancha.precio_f5 || cancha.precio,
        descripcion: cancha.descripcion_f5 || cancha.descripcion,
        capacidad: cancha.capacidad_f5 || cancha.capacidad,
        caracteristicas: cancha.caracteristicas_f5 || cancha.caracteristicas,
        imagen: cancha.imagen_f5_url || cancha.imagen_url,
      }
    } else {
      return {
        precio: cancha.precio_f10 || cancha.precio,
        descripcion: cancha.descripcion_f10 || cancha.descripcion,
        capacidad: cancha.capacidad_f10 || cancha.capacidad,
        caracteristicas: cancha.caracteristicas_f10 || cancha.caracteristicas,
        imagen: cancha.imagen_f10_url || cancha.imagen_url,
      }
    }
  }

  const datos = getDatosSegunTipo()
  const esMasReservada = getMasReservada(cancha)
  const tieneOpcionesTechada = esTechada(datos.caracteristicas)

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
        tipoSeleccionado === "F5"
          ? "border-l-4 border-l-blue-500 hover:border-l-blue-600"
          : "border-l-4 border-l-green-500 hover:border-l-green-600"
      }`}
    >
      <div className="relative h-48">
        <Image
          src={datos.imagen || "/placeholder.svg"}
          alt={cancha.nombre}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(cancha.nombre)
          }}
        />

        {/* Badges superiores */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {cancha.tipo === "MIXTA" ? (
            <div className="flex gap-2">
              <Button
                size="lg"
                variant={tipoSeleccionado === "F5" ? "default" : "secondary"}
                className={`h-10 px-4 text-sm font-bold shadow-lg transition-all duration-200 ${
                  tipoSeleccionado === "F5"
                    ? "bg-blue-600 hover:bg-blue-700 text-white scale-105"
                    : "bg-white/90 hover:bg-white text-gray-700 hover:scale-105"
                }`}
                onClick={() => setTipoSeleccionado("F5")}
              >
                ⚽ F5
              </Button>
              <Button
                size="lg"
                variant={tipoSeleccionado === "F10" ? "default" : "secondary"}
                className={`h-10 px-4 text-sm font-bold shadow-lg transition-all duration-200 ${
                  tipoSeleccionado === "F10"
                    ? "bg-green-600 hover:bg-green-700 text-white scale-105"
                    : "bg-white/90 hover:bg-white text-gray-700 hover:scale-105"
                }`}
                onClick={() => setTipoSeleccionado("F10")}
              >
                🏟️ F10
              </Button>
            </div>
          ) : (
            <Badge className={cancha.tipo === "F5" ? "bg-blue-600" : "bg-green-600"}>{cancha.tipo}</Badge>
          )}

          {esMasReservada && (
            <Badge className="bg-yellow-500 text-yellow-900">
              <Crown className="w-3 h-3 mr-1" />
              Más reservada
            </Badge>
          )}
          {tieneOpcionesTechada && (
            <Badge className="bg-purple-600">
              <Home className="w-3 h-3 mr-1" />
              Techada
            </Badge>
          )}
        </div>

        {selectedDate && (
          <Badge className="absolute top-2 left-2 bg-white text-gray-800">
            {horariosDisponibles} horarios disponibles
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {cancha.nombre}
            {cancha.tipo === "MIXTA" && (
              <Badge variant="outline" className="text-xs">
                {tipoSeleccionado}
              </Badge>
            )}
            {esMasReservada && <Crown className="w-4 h-4 text-yellow-500" />}
          </span>
          <span className="text-lg font-bold text-green-600">${datos.precio.toLocaleString()}</span>
        </CardTitle>
        <p className="text-sm text-gray-600">{datos.descripcion}</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {datos.capacidad}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            Villa Ballester
          </div>

          {/* Características con iconos */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Características:</p>
            <div className="flex flex-wrap gap-1">
              {datos.caracteristicas.slice(0, 4).map((caracteristica, index) => (
                <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                  {getCaracteristicaIcon(caracteristica)}
                  {caracteristica}
                </Badge>
              ))}
              {datos.caracteristicas.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{datos.caracteristicas.length - 4} más
                </Badge>
              )}
            </div>
          </div>

          {selectedDate && horariosDisponibles === 0 && (
            <div className="text-sm text-red-600 font-medium bg-red-50 p-2 rounded">
              ❌ Sin horarios disponibles para esta fecha
            </div>
          )}
        </div>

        <Button
          asChild
          className={`w-full ${
            tipoSeleccionado === "F5" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={selectedDate && horariosDisponibles === 0}
        >
          <Link
            href={`/canchas/${cancha.id}?fecha=${selectedDate}&horario=${selectedTime}&tipo=${
              cancha.tipo === "MIXTA" ? tipoSeleccionado : ""
            }`}
          >
            {selectedDate && horariosDisponibles === 0 ? "No disponible" : "⚽ Reservar cancha"}
          </Link>
        </Button>

        <p className="text-xs text-center text-gray-500 mt-2">💡 Pagás solo el 20% de seña</p>
      </CardContent>
    </Card>
  )
}
