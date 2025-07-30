"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const { error } = await supabase.from("canchas").select("count", { count: "exact", head: true })
      setIsConnected(!error)
    } catch (error) {
      setIsConnected(false)
    }
  }

  if (isConnected === null) return null

  if (!isConnected) {
    return (
      <Alert className="mb-4 border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Modo Demo:</strong> La base de datos no está configurada. Usando datos de ejemplo.
          <br />
          <span className="text-sm">
            Para usar datos reales, configura Supabase y ejecuta el script de creación de tablas.
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <Database className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <strong>Base de datos conectada:</strong> Usando datos en tiempo real.
      </AlertDescription>
    </Alert>
  )
}
