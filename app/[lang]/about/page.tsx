import { getDictionary } from "@/lib/dictionaries"
import type { Metadata } from "next"
import Image from "next/image"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.about.title,
    description: dict.about.description,
  }
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict.about.title}</h1>
        <p className="text-muted-foreground">{dict.about.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <Image
          src="/placeholder.svg?height=300&width=300"
          alt={dict.about.imageAlt}
          width={300}
          height={300}
          className="rounded-full"
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{dict.about.missionTitle}</h2>
          <p>{dict.about.missionText}</p>

          <h2 className="text-2xl font-semibold">{dict.about.visionTitle}</h2>
          <p>{dict.about.visionText}</p>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>{dict.about.storyTitle}</h2>
        <p>{dict.about.storyText1}</p>
        <p>{dict.about.storyText2}</p>

        <h2>{dict.about.valuesTitle}</h2>
        <ul>
          <li>{dict.about.value1}</li>
          <li>{dict.about.value2}</li>
          <li>{dict.about.value3}</li>
        </ul>
      </div>
    </div>
  )
}
