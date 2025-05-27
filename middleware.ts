import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of supported locales
const locales = ["en", "pt", "es", "de", "fr", "it", "fil"]
const defaultLocale = "en"

// Country to language mapping
const countryToLanguage: Record<string, string> = {
  // Portuguese speaking countries
  BR: "pt", // Brazil
  PT: "pt", // Portugal
  AO: "pt", // Angola
  MZ: "pt", // Mozambique

  // Spanish speaking countries
  ES: "es", // Spain
  MX: "es", // Mexico
  AR: "es", // Argentina
  CO: "es", // Colombia
  PE: "es", // Peru
  VE: "es", // Venezuela
  CL: "es", // Chile
  EC: "es", // Ecuador
  BO: "es", // Bolivia
  PY: "es", // Paraguay
  UY: "es", // Uruguay
  CR: "es", // Costa Rica
  PA: "es", // Panama
  SV: "es", // El Salvador
  HN: "es", // Honduras
  NI: "es", // Nicaragua
  GT: "es", // Guatemala
  CU: "es", // Cuba
  DO: "es", // Dominican Republic

  // French speaking countries
  FR: "fr", // France
  CA: "fr", // Canada (Quebec)
  BE: "fr", // Belgium
  CH: "fr", // Switzerland
  SN: "fr", // Senegal
  CI: "fr", // Ivory Coast

  // German speaking countries
  DE: "de", // Germany
  AT: "de", // Austria

  // Italian speaking countries
  IT: "it", // Italy
  SM: "it", // San Marino
  VA: "it", // Vatican

  // Filipino speaking countries
  PH: "fil", // Philippines

  // English speaking countries (default)
  US: "en", // United States
  GB: "en", // United Kingdom
  AU: "en", // Australia
  NZ: "en", // New Zealand
  IE: "en", // Ireland
  ZA: "en", // South Africa
  IN: "en", // India
  SG: "en", // Singapore
  MY: "en", // Malaysia
}

// Get the preferred locale from the request
function getLocaleFromRequest(request: NextRequest): string {
  // Check if user has manually selected a language (from cookie)
  const manualLanguage = request.cookies.get("preferred-language")?.value
  if (manualLanguage && locales.includes(manualLanguage)) {
    return manualLanguage
  }

  // Try to get country from Cloudflare header (Vercel uses Cloudflare)
  const country =
    request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || request.geo?.country

  if (country && countryToLanguage[country]) {
    return countryToLanguage[country]
  }

  // Fallback to Accept-Language header
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    // Parse accept-language header
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, q = "1"] = lang.trim().split(";q=")
        return { code: code.split("-")[0], quality: Number.parseFloat(q) }
      })
      .sort((a, b) => b.quality - a.quality)

    // Find the first supported language
    for (const { code } of languages) {
      if (locales.includes(code)) {
        return code
      }
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
    // Get the preferred locale based on country/language detection
    const preferredLocale = getLocaleFromRequest(request)

    // Redirect to the detected locale
    const newUrl = new URL(`/${preferredLocale}${pathname === "/" ? "" : pathname}`, request.url)
    newUrl.search = request.nextUrl.search

    const response = NextResponse.redirect(newUrl)

    // Set cookie to remember the auto-detected language (but allow manual override)
    if (!request.cookies.get("preferred-language")) {
      response.cookies.set("auto-detected-language", preferredLocale, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|sitemap.xml|robots.txt|rss|favicon.ico).*)",
  ],
}
