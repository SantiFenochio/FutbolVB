"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isVisible: boolean
  type: "processing" | "payment" | "success" | "error"
  title: string
  description: string
}

export function LoadingOverlay({ isVisible, type, title, description }: LoadingOverlayProps) {
  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "processing":
        return <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      case "payment":
        return <CreditCard className="w-16 h-16 text-purple-600 animate-pulse" />
      case "success":
        return (
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
            <div className="absolute inset-0 w-16 h-16 bg-green-200 rounded-full animate-ping opacity-20" />
          </div>
        )
      case "error":
        return <XCircle className="w-16 h-16 text-red-600 animate-pulse" />
      default:
        return <Loader2 className="w-16 h-16 text-gray-600 animate-spin" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case "processing":
        return "bg-blue-50"
      case "payment":
        return "bg-purple-50"
      case "success":
        return "bg-green-50"
      case "error":
        return "bg-red-50"
      default:
        return "bg-gray-50"
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "processing":
        return "text-blue-800"
      case "payment":
        return "text-purple-800"
      case "success":
        return "text-green-800"
      case "error":
        return "text-red-800"
      default:
        return "text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={cn("w-full max-w-md", getBackgroundColor())}>
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">{getIcon()}</div>
          <h3 className={cn("text-xl font-bold mb-2", getTextColor())}>{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>

          {type === "processing" && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}

          {type === "payment" && (
            <div className="text-sm text-purple-600 font-medium">Redirigiendo a plataforma segura...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
