import { redirect } from "next/navigation"

export default function Home() {
  // Use a simple redirect without any data fetching
  redirect("/en")

  // This won't be reached but is needed to satisfy TypeScript
  return null
}
