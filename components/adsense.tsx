"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AdSenseProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  style?: React.CSSProperties
  responsive?: boolean
  className?: string
}

export default function AdSense({
  slot,
  format = "auto",
  style = {},
  responsive = true,
  className = "",
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carrega o script do AdSense apenas uma vez
    const hasAdScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]')

    if (!hasAdScript) {
      const script = document.createElement("script")
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      script.async = true
      script.crossOrigin = "anonymous"
      script.dataset.adClient = "ca-pub-XXXXXXXXXXXXXXXX" // Substitua pelo seu ID de cliente
      document.head.appendChild(script)
    }

    // Inicializa o anúncio quando o componente montar
    try {
      if (adRef.current && typeof window !== "undefined") {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Substitua pelo seu ID de cliente
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}
