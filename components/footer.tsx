"use client"

import Link from "next/link"

interface FooterProps {
  dict: any
  lang: string
}

export function Footer({ dict, lang }: FooterProps) {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 {dict?.site?.name || "LUZ CRUA"}. {dict?.footer?.rights || "All rights reserved"}.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href={`/${lang}/privacy`} className="text-sm text-muted-foreground hover:text-foreground">
            {dict?.footer?.privacy || "Privacy"}
          </Link>
          <Link href={`/${lang}/terms`} className="text-sm text-muted-foreground hover:text-foreground">
            {dict?.footer?.terms || "Terms"}
          </Link>
        </div>
      </div>
    </footer>
  )
}
