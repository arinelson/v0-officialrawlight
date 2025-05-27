"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import OptimizedImage from "@/components/optimized-image"

interface WebStorySlide {
  id: string
  type: "cover" | "content" | "end"
  title?: string
  subtitle?: string
  text?: string
  image: string
  backgroundColor?: string
}

interface WebStoryProps {
  slides: WebStorySlide[]
  title: string
  onClose?: () => void
}

export default function WebStory({ slides, title, onClose }: WebStoryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide((prev) => prev + 1)
        setProgress(0)
      } else {
        setIsPlaying(false)
      }
    }, 5000) // 5 seconds per slide

    return () => clearInterval(timer)
  }, [currentSlide, isPlaying, slides.length])

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 2 // 2% every 100ms = 5 seconds total
      })
    }, 100)

    return () => clearInterval(progressTimer)
  }, [currentSlide, isPlaying])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
      setProgress(0)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
      setProgress(0)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Container */}
      <div className="relative w-full max-w-sm h-full bg-black overflow-hidden">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
          {slides.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                style={{
                  width: index < currentSlide ? "100%" : index === currentSlide ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header Controls */}
        <div className="absolute top-12 left-4 right-4 z-20 flex justify-between items-center">
          <div className="text-white text-sm opacity-75">
            {currentSlide + 1} / {slides.length}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-white hover:bg-white/20 p-2">
              <Share2 className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 p-2">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Slide Content */}
        <div className="relative w-full h-full">
          <OptimizedImage
            src={currentSlideData.image}
            alt={currentSlideData.title || `Slide ${currentSlide + 1}`}
            fill
            className="object-cover"
            priority={currentSlide === 0}
            sizes="400px"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            {currentSlideData.type === "cover" && (
              <>
                <h1 className="text-3xl font-bold mb-3 leading-tight">{currentSlideData.title}</h1>
                <p className="text-lg opacity-90 mb-6 leading-relaxed">{currentSlideData.subtitle}</p>
              </>
            )}

            {currentSlideData.type === "content" && (
              <>
                {currentSlideData.title && (
                  <h2 className="text-2xl font-bold mb-3 leading-tight">{currentSlideData.title}</h2>
                )}
                <p className="text-base leading-relaxed opacity-90">{currentSlideData.text}</p>
              </>
            )}

            {currentSlideData.type === "end" && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">{currentSlideData.title}</h2>
                <p className="text-lg opacity-90">{currentSlideData.subtitle}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex">
          {/* Previous Area */}
          <div className="flex-1 cursor-pointer flex items-center justify-start pl-4" onClick={prevSlide}>
            {currentSlide > 0 && (
              <ChevronLeft className="h-8 w-8 text-white/50 hover:text-white/80 transition-colors" />
            )}
          </div>

          {/* Next Area */}
          <div className="flex-1 cursor-pointer flex items-center justify-end pr-4" onClick={nextSlide}>
            {currentSlide < slides.length - 1 && (
              <ChevronRight className="h-8 w-8 text-white/50 hover:text-white/80 transition-colors" />
            )}
          </div>
        </div>

        {/* Play/Pause Toggle */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer" onClick={togglePlay}>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? (
              <div className="w-3 h-3 bg-white rounded-sm" />
            ) : (
              <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
