import Link from "next/link"
import { Github, Twitter, Rss } from "lucide-react"

interface FooterProps {
  lang: string
  dict: any
}

export default function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} BlogMinimalista. {dict.footer.rights}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href={`/${lang}/privacy`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-500"
            >
              {dict.footer.privacy}
            </Link>
            <Link
              href={`/${lang}/terms`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-500"
            >
              {dict.footer.terms}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/officialrawlight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/officialrawlight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href={`/rss/${lang}.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500"
              title="RSS Feed"
            >
              <Rss className="h-5 w-5" />
              <span className="sr-only">RSS Feed</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
