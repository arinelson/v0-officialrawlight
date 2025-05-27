"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface NewsletterSignupProps {
  lang: string
  dict: any
}

export default function NewsletterSignup({ lang, dict }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Safely access dictionary values with fallbacks
  const newsletter = dict?.newsletter || {}
  const title = newsletter.title || "Subscribe to our newsletter"
  const description = newsletter.description || "Get the latest articles and teachings directly in your inbox"
  const placeholder = newsletter.placeholder || "Your email address"
  const submitText = newsletter.submit || "Subscribe"
  const submittingText = newsletter.submitting || "Submitting..."
  const privacyText = newsletter.privacy || "We respect your privacy. You can unsubscribe at any time."
  const successTitle = newsletter.successTitle || "Successfully subscribed!"
  const successMessage = newsletter.successMessage || "Thank you for subscribing to our newsletter."
  const errorTitle = newsletter.errorTitle || "Error"
  const errorMessage = newsletter.errorMessage || "There was an error subscribing. Please try again."

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: successTitle,
        description: successMessage,
      })

      setEmail("")
    } catch (error) {
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-12 px-6 rounded-lg">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600">
            {isSubmitting ? submittingText : submitText}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">{privacyText}</p>
      </div>
    </section>
  )
}
