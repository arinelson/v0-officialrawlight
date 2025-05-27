import { getDictionary } from "@/lib/dictionaries"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.terms.title,
    description: dict.terms.description,
  }
}

export default async function TermsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict.terms.title}</h1>
        <p className="text-muted-foreground">
          {dict.terms.lastUpdated}: {dict.terms.date}
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>{dict.terms.introTitle}</h2>
        <p>{dict.terms.introText}</p>

        <h2>{dict.terms.useTitle}</h2>
        <p>{dict.terms.useText}</p>

        <h2>{dict.terms.contentTitle}</h2>
        <p>{dict.terms.contentText}</p>

        <h2>{dict.terms.intellectualTitle}</h2>
        <p>{dict.terms.intellectualText}</p>

        <h2>{dict.terms.linksTitle}</h2>
        <p>{dict.terms.linksText}</p>

        <h2>{dict.terms.terminationTitle}</h2>
        <p>{dict.terms.terminationText}</p>

        <h2>{dict.terms.disclaimerTitle}</h2>
        <p>{dict.terms.disclaimerText}</p>

        <h2>{dict.terms.contactTitle}</h2>
        <p>{dict.terms.contactText}</p>
      </div>
    </div>
  )
}
