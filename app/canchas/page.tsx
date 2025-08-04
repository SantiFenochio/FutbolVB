"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Clock, Users, Filter, Loader2, AlertCircle, MessageCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getCanchas, getReservasByCancha, type Cancha } from "@/lib/supabase"
import { DatabaseStatus } from "@/components/database-status"
import { CanchaCard } from "@/components/cancha-card"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function CanchasPage() {
  const searchParams = useSearchParams()
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [filteredCanchas, setFilteredCanchas] = useState<Cancha[]>([])
  const [loading, setLoading] = useState(true)
  const [tipoFilter, setTipoFilter] = useState("todos")
  const [superficieFilter, setSuperficieFilter] = useState("todas")
  const [precioRange, setPrecioRange] = useState([20000])
  const [ordenarPor, setOrdenarPor] = useState("nombre")
  const [selectedDate, setSelectedDate] = useState(searchParams.get("fecha") || "")
  const [selectedTime, setSelectedTime] = useState(searchParams.get("horario") || "")
  const [horariosOcupados, setHorariosOcupados] = useState<Record<string, string[]>>({})

  useEffect(() => {
    loadCanchas()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      loadHorariosOcupados()
    }
  }, [selectedDate, canchas])

  useEffect(() => {
    filterCanchas()
  }, [tipoFilter, superficieFilter, precioRange, ordenarPor, selectedTime, selectedDate, canchas, horariosOcupados])

  const loadCanchas = async () => {
    try {
      const data = await getCanchas()
      setCanchas(data)
    } catch (error) {
      console.error("Error loading canchas:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHorariosOcupados = async () => {
    const ocupados: Record<string, string[]> = {}

    for (const cancha of canchas) {
      try {
        if (cancha.tipo === "MIXTA") {
          // Para canchas mixtas, cargar horarios para F5 y F10 por separado
          const horariosF5 = await getReservasByCancha(cancha.id, selectedDate, "F5")
          const horariosF10 = await getReservasByCancha(cancha.id, selectedDate, "F10")
          ocupados[`${cancha.id}-F5`] = horariosF5
          ocupados[`${cancha.id}-F10`] = horariosF10
        } else {
          const horarios = await getReservasByCancha(cancha.id, selectedDate)
          ocupados[cancha.id.toString()] = horarios
        }
      } catch (error) {
        console.error(`Error loading horarios for cancha ${cancha.id}:`, error)
        // Simular algunos horarios ocupados para demostración
        ocupados[cancha.id.toString()] = ["18:00", "20:00", "21:00"]
      }
    }

    setHorariosOcupados(ocupados)
  }

  const filterCanchas = () => {
    let filtered = canchas

    // Filtro por tipo
    if (tipoFilter !== "todos") {
      filtered = filtered.filter((cancha) => {
        if (cancha.tipo === "MIXTA") return true // Las canchas mixtas aparecen en todos los filtros
        return cancha.tipo === tipoFilter
      })
    }

    // Filtro por superficie
    if (superficieFilter !== "todas") {
      filtered = filtered.filter((cancha) => {
        const caracteristicas = cancha.caracteristicas.join(" ").toLowerCase()
        switch (superficieFilter) {
          case "sintetico":
            return caracteristicas.includes("sintético")
          case "techada":
            return caracteristicas.includes("techada")
          case "climatizada":
            return caracteristicas.includes("climatizada")
          default:
            return true
        }
      })
    }

    // Filtro por precio (considerando ambos precios para canchas mixtas)
    filtered = filtered.filter((cancha) => {
      if (cancha.tipo === "MIXTA") {
        const precioF5 = cancha.precio_f5 || cancha.precio
        const precioF10 = cancha.precio_f10 || cancha.precio
        return precioF5 <= precioRange[0] || precioF10 <= precioRange[0]
      }
      return cancha.precio <= precioRange[0]
    })

    // Filtro por horario disponible
    if (selectedTime && selectedTime !== "all") {
      filtered = filtered.filter((cancha) => {
        if (!selectedDate) return cancha.horarios.includes(selectedTime)

        if (cancha.tipo === "MIXTA") {
          const ocupadosF5 = horariosOcupados[`${cancha.id}-F5`] || []
          const ocupadosF10 = horariosOcupados[`${cancha.id}-F10`] || []
          return (
            cancha.horarios.includes(selectedTime) &&
            (!ocupadosF5.includes(selectedTime) || !ocupadosF10.includes(selectedTime))
          )
        } else {
          const ocupados = horariosOcupados[cancha.id.toString()] || []
          return cancha.horarios.includes(selectedTime) && !ocupados.includes(selectedTime)
        }
      })
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (ordenarPor) {
        case "precio-asc":
          const precioA = a.tipo === "MIXTA" ? Math.min(a.precio_f5 || a.precio, a.precio_f10 || a.precio) : a.precio
          const precioB = b.tipo === "MIXTA" ? Math.min(b.precio_f5 || b.precio, b.precio_f10 || b.precio) : b.precio
          return precioA - precioB
        case "precio-desc":
          const precioMaxA = a.tipo === "MIXTA" ? Math.max(a.precio_f5 || a.precio, a.precio_f10 || a.precio) : a.precio
          const precioMaxB = b.tipo === "MIXTA" ? Math.max(b.precio_f5 || b.precio, b.precio_f10 || b.precio) : b.precio
          return precioMaxB - precioMaxA
        case "horarios":
          const horariosA = getHorariosDisponibles(a)
          const horariosB = getHorariosDisponibles(b)
          return horariosB - horariosA
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

    setFilteredCanchas(filtered)
  }

  const getHorariosDisponibles = (cancha: Cancha) => {
    if (!selectedDate) return cancha.horarios.length

    if (cancha.tipo === "MIXTA") {
      const ocupadosF5 = horariosOcupados[`${cancha.id}-F5`] || []
      const ocupadosF10 = horariosOcupados[`${cancha.id}-F10`] || []
      // Retornamos el máximo de horarios disponibles entre F5 y F10
      const disponiblesF5 = cancha.horarios.filter((h) => !ocupadosF5.includes(h)).length
      const disponiblesF10 = cancha.horarios.filter((h) => !ocupadosF10.includes(h)).length
      return Math.max(disponiblesF5, disponiblesF10)
    } else {
      const ocupados = horariosOcupados[cancha.id.toString()] || []
      return cancha.horarios.filter((h) => !ocupados.includes(h)).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-green-800">FutbolVB</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-green-700">
                  Inicio
                </Link>
                <Link href="/canchas" className="text-green-700 hover:text-green-900 font-medium">
                  Canchas
                </Link>
                <Link href="/faq" className="text-gray-600 hover:text-green-700">
                  FAQ
                </Link>
                <Link href="/contacto" className="text-gray-600 hover:text-green-700">
                  Contacto
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <DatabaseStatus />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nuestras Canchas</h1>
            <p className="text-gray-600">Elegí la cancha perfecta para tu partido</p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  Todos los turnos son de 1 hora de duración • Disponibilidad en tiempo real
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros y Ordenamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de cancha</Label>
                  <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="F5">⚽ Fútbol 5</SelectItem>
                      <SelectItem value="F10">🏟️ Fútbol 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Superficie</Label>
                  <Select value={superficieFilter} onValueChange={setSuperficieFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="sintetico">🌱 Césped sintético</SelectItem>
                      <SelectItem value="techada">🏠 Techada</SelectItem>
                      <SelectItem value="climatizada">❄️ Climatizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Precio máximo: ${precioRange[0].toLocaleString()}</Label>
                  <Slider
                    value={precioRange}
                    onValueChange={setPrecioRange}
                    max={20000}
                    min={5000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ordenar por</Label>
                  <Select value={ordenarPor} onValueChange={setOrdenarPor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nombre">📝 Nombre</SelectItem>
                      <SelectItem value="precio-asc">💰 Precio (menor a mayor)</SelectItem>
                      <SelectItem value="precio-desc">💎 Precio (mayor a menor)</SelectItem>
                      <SelectItem value="horarios">⏰ Más horarios disponibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Horario específico</Label>
                  <Select value={selectedTime || "all"} onValueChange={setSelectedTime}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Cualquier horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Cualquier horario</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                      <SelectItem value="22:00">22:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando {filteredCanchas.length} de {canchas.length} canchas
            </p>
          </div>

          {/* Canchas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCanchas.map((cancha) => {
              const horariosDisponibles = getHorariosDisponibles(cancha)

              return (
                <CanchaCard
                  key={cancha.id}
                  cancha={cancha}
                  horariosDisponibles={horariosDisponibles}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />
              )
            })}
          </div>

          {/* No Results Message */}
          {filteredCanchas.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay canchas disponibles</h3>
                {selectedTime && selectedTime !== "all" && selectedDate ? (
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>No hay canchas disponibles en ese horario.</strong>
                      <br />
                      Probá con otra hora o día, o contactanos por WhatsApp para consultar disponibilidad especial.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-gray-500 text-lg mb-4">No se encontraron canchas con los filtros seleccionados</p>
                )}
                <p className="text-gray-400 text-sm mb-6">
                  Probá ajustando los filtros o aumentando el rango de precio
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setTipoFilter("todos")
                      setSuperficieFilter("todas")
                      setPrecioRange([20000])
                      setSelectedTime("all")
                    }}
                    variant="outline"
                    className="bg-transparent"
                  >
                    🔄 Limpiar todos los filtros
                  </Button>
                  <Button asChild className="bg-green-500 hover:bg-green-600">
                    <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Consultar por WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </>
  )
}
