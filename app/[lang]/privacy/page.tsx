import { getDictionary } from "@/lib/dictionaries"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.privacy.title,
    description: dict.privacy.description,
  }
}

export default async function PrivacyPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict.privacy.title}</h1>
        <p className="text-muted-foreground">
          {dict.privacy.lastUpdated}: {dict.privacy.date}
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>{dict.privacy.introTitle}</h2>
        <p>{dict.privacy.introText}</p>

        <h2>{dict.privacy.collectionTitle}</h2>
        <p>{dict.privacy.collectionText}</p>
        <ul>
          <li>{dict.privacy.collectionItem1}</li>
          <li>{dict.privacy.collectionItem2}</li>
          <li>{dict.privacy.collectionItem3}</li>
          <li>{dict.privacy.collectionItem4}</li>
        </ul>

        <h2>{dict.privacy.cookiesTitle}</h2>
        <p>{dict.privacy.cookiesText}</p>

        <h2>{dict.privacy.adsenseTitle}</h2>
        <p>{dict.privacy.adsenseText}</p>

        <h2>{dict.privacy.thirdPartyTitle}</h2>
        <p>{dict.privacy.thirdPartyText}</p>

        <h2>{dict.privacy.rightsTitle}</h2>
        <p>{dict.privacy.rightsText}</p>

        <h2>{dict.privacy.contactTitle}</h2>
        <p>{dict.privacy.contactText}</p>
      </div>
    </div>
  )
}
