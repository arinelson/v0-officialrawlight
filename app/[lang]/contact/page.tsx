"use client"

import type React from "react"

import { useState } from "react"
import { useDictionary } from "@/hooks/use-dictionary"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage({ params }: { params: { lang: string } }) {
  const dict = useDictionary(params.lang)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Replace with your actual form submission logic
      // This is a mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: dict?.contact?.successTitle || "Message sent!",
        description: dict?.contact?.successMessage || "We will get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: dict?.contact?.errorTitle || "Error",
        description: dict?.contact?.errorMessage || "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict?.contact?.title || "Contact Us"}</h1>
        <p className="text-muted-foreground">{dict?.contact?.subtitle || "Get in touch with us"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            {dict?.contact?.nameLabel || "Name"}
          </label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            {dict?.contact?.emailLabel || "Email"}
          </label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium">
            {dict?.contact?.subjectLabel || "Subject"}
          </label>
          <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">
            {dict?.contact?.messageLabel || "Message"}
          </label>
          <Textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? dict?.contact?.submitting || "Sending..." : dict?.contact?.submit || "Send Message"}
        </Button>
      </form>

      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">{dict?.contact?.alternativeTitle || "Other Ways to Reach Us"}</h2>
        <div className="space-y-2">
          <p>
            <strong>{dict?.contact?.emailTitle || "Email"}:</strong> contact@officialrawlight.com
          </p>
          <p>
            <strong>{dict?.contact?.socialTitle || "Social Media"}:</strong> @officialrawlight
          </p>
        </div>
      </div>
    </div>
  )
}
