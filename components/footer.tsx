import Link from "next/link"

interface FooterProps {
  lang: string
  dict: any
}

export default function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              LUZ <span className="text-blue-500">CRUA</span>
            </h3>
            <p className="text-sm text-muted-foreground">{dict?.site?.description || "A multilingual blog"}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{dict?.nav?.home || "Navigation"}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="text-muted-foreground hover:text-foreground">
                  {dict?.nav?.home || "Home"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/posts`} className="text-muted-foreground hover:text-foreground">
                  {dict?.nav?.posts || "Posts"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/about`} className="text-muted-foreground hover:text-foreground">
                  {dict?.nav?.about || "About"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="text-muted-foreground hover:text-foreground">
                  {dict?.nav?.contact || "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">{dict?.nav?.tags || "Categories"}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/tags`} className="text-muted-foreground hover:text-foreground">
                  {dict?.nav?.tags || "Tags"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/webstories`} className="text-muted-foreground hover:text-foreground">
                  {dict?.nav?.webstories || "WebStories"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/privacy`} className="text-muted-foreground hover:text-foreground">
                  {dict?.footer?.privacy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/terms`} className="text-muted-foreground hover:text-foreground">
                  {dict?.footer?.terms || "Terms of Use"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} LUZ CRUA. {dict?.footer?.rights || "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
