import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of supported locales
const locales = ["en", "pt", "es", "de", "fr", "it", "fil"]
const defaultLocale = "en"

// Alternative locale mappings (for convenience)
const localeAliases: Record<string, string> = {
  br: "pt", // Brazilian alias maps to Portuguese
  ph: "fil", // Philippines alias maps to Filipino
  us: "en", // US alias maps to English
}

// Get the preferred locale from the request
function getLocaleFromRequest(request: NextRequest): string {
  // For path-based routing, we'll use the default locale
  // The actual locale will be determined from the URL path
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle locale aliases first
  for (const [alias, actualLocale] of Object.entries(localeAliases)) {
    if (pathname.startsWith(`/${alias}/`) || pathname === `/${alias}`) {
      const newPathname = pathname.replace(`/${alias}`, `/${actualLocale}`)
      const newUrl = new URL(newPathname, request.url)
      newUrl.search = request.nextUrl.search
      return NextResponse.redirect(newUrl)
    }
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // Special files and folders that should be excluded from localization
  const shouldHandleLocale =
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/sitemap.xml") &&
    !pathname.startsWith("/robots.txt") &&
    !pathname.startsWith("/rss") &&
    !pathname.includes(".") &&
    pathname !== "/favicon.ico"

  // If the pathname doesn't have a locale and should be handled
  if (!pathnameHasLocale && shouldHandleLocale) {
    // Redirect to the default locale
    const newUrl = new URL(`/${defaultLocale}${pathname === "/" ? "" : pathname}`, request.url)
    newUrl.search = request.nextUrl.search
    return NextResponse.redirect(newUrl)
  }

  // Handle post translation redirects and validation
  if (pathnameHasLocale && pathname.includes("/posts/")) {
    const pathParts = pathname.split("/")
    const lang = pathParts[1]
    const slug = pathParts[3]

    // Log for debugging
    console.log(`Accessing post: ${lang}/${slug}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|sitemap.xml|robots.txt|rss|favicon.ico).*)",
  ],
}
