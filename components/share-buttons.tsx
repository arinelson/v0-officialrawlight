"use client"

import { Share, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareButtonsProps {
  url: string
  title: string
  dict: any
  lang: string
}

export default function ShareButtons({ url, title, dict, lang }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <MessageCircle className="h-4 w-4 mr-2" />,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Share className="h-4 w-4 mr-2" />,
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <Send className="h-4 w-4 mr-2" />,
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <MessageCircle className="h-4 w-4 mr-2" />,
    },
  ]

  function copyToClipboard() {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-b py-4 my-8">
      <span className="text-sm font-medium">{dict.post.share}:</span>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <Button key={link.name} variant="outline" size="sm" asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
              {link.icon}
              {link.name}
            </a>
          </Button>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              {dict.post.more}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyToClipboard}>{dict.post.copyLink}</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/rss/${lang}.xml`} target="_blank" rel="noopener noreferrer">
                RSS Feed
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
