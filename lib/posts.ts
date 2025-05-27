import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const postsDirectory = path.join(process.cwd(), "content/posts")

// Ensure the posts directory exists
if (!fs.existsSync(postsDirectory)) {
  try {
    fs.mkdirSync(postsDirectory, { recursive: true })
    console.log("Created posts directory:", postsDirectory)
  } catch (error) {
    console.error("Error creating posts directory:", error)
  }
}

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  readingTime: number
}

export async function getAllPosts(lang: string): Promise<Post[]> {
  try {
    console.log(`Getting posts for language: ${lang}`)

    // Create language-specific directory if it doesn't exist
    const langDirectory = path.join(postsDirectory, lang)

    if (!fs.existsSync(langDirectory)) {
      console.log(`Creating directory for language: ${lang}`)
      try {
        fs.mkdirSync(langDirectory, { recursive: true })
        // Create sample posts for this language if directory is empty
        await createSamplePosts(lang)
      } catch (error) {
        console.error(`Error creating directory for language ${lang}:`, error)
        return [] // Return empty array if directory creation fails
      }
    }

    // Check if directory has any markdown files
    let fileNames: string[] = []
    try {
      fileNames = fs.readdirSync(langDirectory)
      console.log(`Found files in ${lang}:`, fileNames)

      // If no markdown files exist, create sample posts
      const markdownFiles = fileNames.filter((name) => name.endsWith(".md"))
      if (markdownFiles.length === 0) {
        console.log(`No markdown files found for ${lang}, creating sample posts`)
        await createSamplePosts(lang)
        fileNames = fs.readdirSync(langDirectory)
      }
    } catch (error) {
      console.error(`Error reading directory for language ${lang}:`, error)
      return [] // Return empty array if directory reading fails
    }

    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        try {
          // Remove ".md" from file name to get slug
          const slug = fileName.replace(/\.md$/, "")

          // Read markdown file as string
          const fullPath = path.join(langDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")

          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents)

          // Calculate reading time
          const stats = readingTime(matterResult.content)

          // Ensure tags is an array
          const tags = Array.isArray(matterResult.data.tags)
            ? matterResult.data.tags
            : matterResult.data.tags
              ? matterResult.data.tags.split(",").map((tag: string) => tag.trim())
              : []

          // Combine the data with the slug
          return {
            slug,
            title: matterResult.data.title || "Untitled Post",
            date: matterResult.data.date || new Date().toISOString().split("T")[0],
            excerpt: matterResult.data.excerpt || "",
            content: matterResult.content,
            tags,
            readingTime: Math.ceil(stats.minutes) || 1,
          }
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error)
          // Return a default post object if processing fails
          return {
            slug: fileName.replace(/\.md$/, ""),
            title: "Error Loading Post",
            date: new Date().toISOString().split("T")[0],
            excerpt: "This post could not be loaded correctly.",
            content: "Error loading content.",
            tags: ["error"],
            readingTime: 1,
          }
        }
      })

    console.log(`Processed ${allPostsData.length} posts for language ${lang}`)

    // Sort posts by date
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error(`Unexpected error in getAllPosts for language ${lang}:`, error)
    return [] // Return empty array for any unexpected error
  }
}

export async function getPostBySlug(lang: string, slug: string): Promise<Post | null> {
  try {
    const langDirectory = path.join(postsDirectory, lang)

    if (!fs.existsSync(langDirectory)) {
      // Try to create the directory and sample posts
      try {
        fs.mkdirSync(langDirectory, { recursive: true })
        await createSamplePosts(lang)
      } catch (error) {
        console.error(`Error creating directory for language ${lang}:`, error)
        return null
      }
    }

    const fullPath = path.join(langDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.log(`Post ${slug} not found for language ${lang}, checking if we need to create sample posts`)

      // Check if this is one of our standard slugs and create it if needed
      const standardSlugs = ["how-to-pray-like-jesus", "importance-of-bible-reading", "finding-peace-in-chaos"]
      if (standardSlugs.includes(slug)) {
        await createSamplePosts(lang)

        // Try again after creating sample posts
        if (fs.existsSync(fullPath)) {
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const matterResult = matter(fileContents)
          const stats = readingTime(matterResult.content)

          const tags = Array.isArray(matterResult.data.tags)
            ? matterResult.data.tags
            : matterResult.data.tags
              ? matterResult.data.tags.split(",").map((tag: string) => tag.trim())
              : []

          return {
            slug,
            title: matterResult.data.title || "Untitled Post",
            date: matterResult.data.date || new Date().toISOString().split("T")[0],
            excerpt: matterResult.data.excerpt || "",
            content: matterResult.content,
            tags,
            readingTime: Math.ceil(stats.minutes) || 1,
          }
        }
      }

      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)

    // Calculate reading time
    const stats = readingTime(matterResult.content)

    // Ensure tags is an array
    const tags = Array.isArray(matterResult.data.tags)
      ? matterResult.data.tags
      : matterResult.data.tags
        ? matterResult.data.tags.split(",").map((tag: string) => tag.trim())
        : []

    return {
      slug,
      title: matterResult.data.title || "Untitled Post",
      date: matterResult.data.date || new Date().toISOString().split("T")[0],
      excerpt: matterResult.data.excerpt || "",
      content: matterResult.content,
      tags,
      readingTime: Math.ceil(stats.minutes) || 1,
    }
  } catch (error) {
    console.error(`Error in getPostBySlug for language ${lang} and slug ${slug}:`, error)
    return null
  }
}

export async function getPostsByTag(lang: string, tag: string): Promise<Post[]> {
  try {
    const posts = await getAllPosts(lang)
    return posts.filter((post) => post.tags.includes(tag))
  } catch (error) {
    console.error(`Error in getPostsByTag for language ${lang} and tag ${tag}:`, error)
    return []
  }
}

export async function getRelatedPosts(
  lang: string,
  currentSlug: string,
  tags: string[],
  limit: number,
): Promise<Post[]> {
  try {
    const allPosts = await getAllPosts(lang)

    // Filter out the current post
    const otherPosts = allPosts.filter((post) => post.slug !== currentSlug)

    // Find posts with matching tags
    const relatedPosts = otherPosts.filter((post) => post.tags.some((tag) => tags.includes(tag)))

    // If we don't have enough related posts, add some recent posts
    if (relatedPosts.length < limit) {
      const recentPosts = otherPosts
        .filter((post) => !relatedPosts.includes(post))
        .slice(0, limit - relatedPosts.length)

      return [...relatedPosts, ...recentPosts].slice(0, limit)
    }

    // Randomize and limit the related posts
    return relatedPosts.sort(() => 0.5 - Math.random()).slice(0, limit)
  } catch (error) {
    console.error(`Error in getRelatedPosts for language ${lang} and slug ${currentSlug}:`, error)
    return []
  }
}

// Update the createSamplePosts function to ensure all languages have content
async function createSamplePosts(lang: string) {
  try {
    console.log(`Creating sample posts for language: ${lang}`)
    const langDirectory = path.join(postsDirectory, lang)

    // Ensure directory exists
    if (!fs.existsSync(langDirectory)) {
      fs.mkdirSync(langDirectory, { recursive: true })
    }

    // Get language-specific titles and content based on the language code
    const titles = getLocalizedTitles(lang)
    const contents = getLocalizedContents(lang)

    // Create sample posts with localized content
    for (let i = 0; i < titles.length; i++) {
      const postContent = `---
title: "${titles[i].title}"
date: "${new Date(Date.now() - i * 86400000).toISOString().split("T")[0]}"
tags: [${titles[i].tags.map((tag) => `"${tag}"`).join(", ")}]
excerpt: "${titles[i].excerpt}"
---

${contents[i]}
`
      try {
        const filePath = path.join(langDirectory, `${titles[i].slug}.md`)
        fs.writeFileSync(filePath, postContent)
        console.log(`Created post: ${filePath}`)
      } catch (error) {
        console.error(`Error writing sample post ${titles[i].slug} for language ${lang}:`, error)
      }
    }

    console.log(`Finished creating sample posts for language: ${lang}`)
  } catch (error) {
    console.error(`Error in createSamplePosts for language ${lang}:`, error)
  }
}

// Helper function to get localized titles for sample posts
function getLocalizedTitles(lang: string) {
  const titlesByLang = {
    en: [
      {
        title: "How to Pray Like Jesus",
        slug: "how-to-pray-like-jesus",
        tags: ["prayer", "jesus", "faith"],
        excerpt: "Learn to pray as Jesus taught, with simplicity and power.",
      },
      {
        title: "The Importance of Bible Reading",
        slug: "importance-of-bible-reading",
        tags: ["bible", "spirituality", "faith"],
        excerpt: "Discover how Bible reading can transform your spiritual life.",
      },
      {
        title: "Finding Peace in a Chaotic World",
        slug: "finding-peace-in-chaos",
        tags: ["peace", "mindfulness", "spirituality"],
        excerpt: "Practical strategies to find inner peace in today's hectic world.",
      },
    ],
    pt: [
      {
        title: "Como Orar Como Jesus",
        slug: "how-to-pray-like-jesus",
        tags: ["oração", "jesus", "fé"],
        excerpt: "Aprenda a orar como Jesus ensinou, com simplicidade e poder.",
      },
      {
        title: "A Importância da Leitura Bíblica",
        slug: "importance-of-bible-reading",
        tags: ["bíblia", "espiritualidade", "fé"],
        excerpt: "Descubra como a leitura bíblica pode transformar sua vida espiritual.",
      },
      {
        title: "Encontrando Paz em um Mundo Caótico",
        slug: "finding-peace-in-chaos",
        tags: ["paz", "atenção plena", "espiritualidade"],
        excerpt: "Estratégias práticas para encontrar paz interior no mundo agitado de hoje.",
      },
    ],
    es: [
      {
        title: "Cómo Orar Como Jesús",
        slug: "how-to-pray-like-jesus",
        tags: ["oración", "jesús", "fe"],
        excerpt: "Aprende a orar como Jesús enseñó, con simplicidad y poder.",
      },
      {
        title: "La Importancia de la Lectura Bíblica",
        slug: "importance-of-bible-reading",
        tags: ["biblia", "espiritualidad", "fe"],
        excerpt: "Descubre cómo la lectura bíblica puede transformar tu vida espiritual.",
      },
      {
        title: "Encontrando Paz en un Mundo Caótico",
        slug: "finding-peace-in-chaos",
        tags: ["paz", "atención plena", "espiritualidad"],
        excerpt: "Estrategias prácticas para encontrar paz interior en el agitado mundo de hoy.",
      },
    ],
    de: [
      {
        title: "Wie man wie Jesus betet",
        slug: "how-to-pray-like-jesus",
        tags: ["gebet", "jesus", "glaube"],
        excerpt: "Lernen Sie zu beten, wie Jesus es lehrte, mit Einfachheit und Kraft.",
      },
      {
        title: "Die Bedeutung des Bibellesens",
        slug: "importance-of-bible-reading",
        tags: ["bibel", "spiritualität", "glaube"],
        excerpt: "Entdecken Sie, wie Bibellesen Ihr spirituelles Leben verändern kann.",
      },
      {
        title: "Frieden finden in einer chaotischen Welt",
        slug: "finding-peace-in-chaos",
        tags: ["frieden", "achtsamkeit", "spiritualität"],
        excerpt: "Praktische Strategien, um inneren Frieden in der hektischen Welt von heute zu finden.",
      },
    ],
    fr: [
      {
        title: "Comment prier comme Jésus",
        slug: "how-to-pray-like-jesus",
        tags: ["prière", "jésus", "foi"],
        excerpt: "Apprenez à prier comme Jésus l'a enseigné, avec simplicité et puissance.",
      },
      {
        title: "L'importance de la lecture biblique",
        slug: "importance-of-bible-reading",
        tags: ["bible", "spiritualité", "foi"],
        excerpt: "Découvrez comment la lecture biblique peut transformer votre vie spirituelle.",
      },
      {
        title: "Trouver la paix dans un monde chaotique",
        slug: "finding-peace-in-chaos",
        tags: ["paix", "pleine conscience", "spiritualité"],
        excerpt: "Stratégies pratiques pour trouver la paix intérieure dans le monde trépidant d'aujourd'hui.",
      },
    ],
    it: [
      {
        title: "Come pregare come Gesù",
        slug: "how-to-pray-like-jesus",
        tags: ["preghiera", "gesù", "fede"],
        excerpt: "Impara a pregare come ha insegnato Gesù, con semplicità e potenza.",
      },
      {
        title: "L'importanza della lettura biblica",
        slug: "importance-of-bible-reading",
        tags: ["bibbia", "spiritualità", "fede"],
        excerpt: "Scopri come la lettura biblica può trasformare la tua vita spirituale.",
      },
      {
        title: "Trovare pace in un mondo caotico",
        slug: "finding-peace-in-chaos",
        tags: ["pace", "mindfulness", "spiritualità"],
        excerpt: "Strategie pratiche per trovare la pace interiore nel frenetico mondo di oggi.",
      },
    ],
    fil: [
      {
        title: "Paano Manalangin Tulad ni Hesus",
        slug: "how-to-pray-like-jesus",
        tags: ["panalangin", "hesus", "pananampalataya"],
        excerpt: "Matuto kung paano manalangin tulad ng itinuro ni Hesus, nang may kasimplehan at kapangyarihan.",
      },
      {
        title: "Ang Kahalagahan ng Pagbabasa ng Bibliya",
        slug: "importance-of-bible-reading",
        tags: ["bibliya", "espiritwalidad", "pananampalataya"],
        excerpt: "Tuklasin kung paano mababago ng pagbabasa ng Bibliya ang inyong espirituwal na buhay.",
      },
      {
        title: "Paghahanap ng Kapayapaan sa isang Magulo na Mundo",
        slug: "finding-peace-in-chaos",
        tags: ["kapayapaan", "mindfulness", "espiritwalidad"],
        excerpt: "Mga praktikal na estratehiya upang makahanap ng panloob na kapayapaan sa abalang mundo ngayon.",
      },
    ],
  }

  return titlesByLang[lang] || titlesByLang.en
}

// Helper function to get localized content for sample posts
function getLocalizedContents(lang: string) {
  const contentsByLang = {
    en: [
      `Praying is an essential practice to strengthen your connection with God. Jesus left us a clear model of prayer in the Lord's Prayer. Here are some practical steps to pray as He taught:

## 1. Start with Gratitude
Thank God for daily blessings and acknowledge His goodness in your life.

## 2. Be Sincere
Talk to God as you would talk to a close friend. Be honest about your struggles and joys.

## 3. Ask with Faith
Trust that God will hear and answer your prayers according to His perfect will.

## 4. Pray for Others
Include prayers for your family, friends, and even those who have wronged you.

## 5. Listen
Prayer is not just about talking to God, but also listening for His voice and guidance.

Remember, Jesus said: "And when you pray, do not be like the hypocrites, for they love to pray standing in the synagogues and on the street corners to be seen by others." (Matthew 6:5)

Share this post with your friends and family to help them grow in their prayer life!`,

      `The Bible is an inexhaustible source of wisdom and guidance for our daily lives. Here are some tips to make your reading more productive and meaningful:

## 1. Establish a Routine
Read the Bible daily, even if it's just a few verses. Consistency is more important than quantity.

## 2. Start with Prayer
Ask God to open your heart and mind to understand His word before you begin reading.

## 3. Reflection and Meditation
Don't rush through the text. Take time to meditate on the meaning and how it applies to your life.

## 4. Practical Application
Try to apply the teachings in your daily life. The Bible is meant to transform us, not just inform us.

## 5. Study with Others
Join a Bible study group or discuss what you've read with fellow believers.

As the Psalmist wrote: "Your word is a lamp for my feet, a light on my path." (Psalm 119:105)

Share this post with your friends and family to encourage them in their Bible reading journey!`,

      `In today's fast-paced world, finding peace can seem like an impossible task. However, Jesus taught us that true peace comes from within and from our relationship with God. Here are some ways to cultivate inner peace:

## 1. Daily Prayer and Meditation
Set aside time each day for quiet prayer and reflection. This helps center your mind on God.

## 2. Scripture Meditation
Focus on verses about peace and God's promises. Let His word calm your anxious thoughts.

## 3. Gratitude Practice
Regularly count your blessings and express thanks to God for His goodness.

## 4. Trust in God's Plan
Remember that God is in control, even when circumstances seem chaotic.

## 5. Serve Others
Sometimes the best way to find peace is to focus on helping others in need.

## 6. Limit Negative Influences
Reduce exposure to negative news and toxic relationships that disturb your peace.

Remember, Jesus said: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." (John 14:27)

Share this message of peace with others who need encouragement today!`,
    ],
    pt: [
      `Orar é uma prática essencial para fortalecer sua conexão com Deus. Jesus nos deixou um modelo claro de oração no Pai Nosso. Aqui estão alguns passos práticos para orar como Ele ensinou:

## 1. Comece com Gratidão
Agradeça a Deus pelas bênçãos diárias e reconheça Sua bondade em sua vida.

## 2. Seja Sincero
Fale com Deus como falaria com um amigo próximo. Seja honesto sobre suas lutas e alegrias.

## 3. Peça com Fé
Confie que Deus ouvirá e responderá suas orações de acordo com Sua vontade perfeita.

## 4. Ore pelos Outros
Inclua orações por sua família, amigos e até mesmo por aqueles que o machucaram.

## 5. Escute
A oração não é apenas falar com Deus, mas também ouvir Sua voz e orientação.

Lembre-se, Jesus disse: "E, quando orardes, não sejais como os hipócritas, pois se comprazem em orar em pé nas sinagogas e às esquinas das ruas, para serem vistos pelos homens." (Mateus 6:5)

Compartilhe este post com seus amigos e familiares para ajudá-los a crescer em sua vida de oração!`,

      `A Bíblia é uma fonte inesgotável de sabedoria e orientação para nossa vida diária. Aqui estão algumas dicas para tornar sua leitura mais produtiva e significativa:

## 1. Estabeleça uma Rotina
Leia a Bíblia diariamente, mesmo que sejam poucos versículos. A consistência é mais importante que a quantidade.

## 2. Comece com Oração
Peça a Deus para abrir seu coração e mente para entender Sua palavra antes de começar a ler.

## 3. Reflexão e Meditação
Não se apresse no texto. Reserve tempo para meditar sobre o significado e como se aplica à sua vida.

## 4. Aplicação Prática
Tente aplicar os ensinamentos em sua vida diária. A Bíblia deve nos transformar, não apenas nos informar.

## 5. Estude com Outros
Participe de um grupo de estudo bíblico ou discuta o que leu com outros crentes.

Como escreveu o salmista: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." (Salmo 119:105)

Compartilhe este post com seus amigos e familiares para encorajá-los em sua jornada de leitura bíblica!`,

      `No mundo acelerado de hoje, encontrar paz pode parecer uma tarefa impossível. No entanto, Jesus nos ensinou que a verdadeira paz vem de dentro e de nosso relacionamento com Deus. Aqui estão algumas maneiras de cultivar a paz interior:

## 1. Oração e Meditação Diárias
Reserve um tempo todos os dias para oração silenciosa e reflexão. Isso ajuda a centralizar sua mente em Deus.

## 2. Meditação nas Escrituras
Concentre-se em versículos sobre paz e promessas de Deus. Deixe Sua palavra acalmar seus pensamentos ansiosos.

## 3. Prática de Gratidão
Regularmente conte suas bênçãos e expresse gratidão a Deus por Sua bondade.

## 4. Confie no Plano de Deus
Lembre-se de que Deus está no controle, mesmo quando as circunstâncias parecem caóticas.

## 5. Sirva aos Outros
Às vezes, a melhor maneira de encontrar paz é focar em ajudar outros necessitados.

## 6. Limite Influências Negativas
Reduza a exposição a notícias negativas e relacionamentos tóxicos que perturbam sua paz.

Lembre-se, Jesus disse: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize." (João 14:27)

Compartilhe esta mensagem de paz com outros que precisam de encorajamento hoje!`,
    ],
    es: [
      `Orar es una práctica esencial para fortalecer tu conexión con Dios. Jesús nos dejó un modelo claro de oración en el Padre Nuestro. Aquí hay algunos pasos prácticos para orar como Él enseñó:

## 1. Comienza con Gratitud
Agradece a Dios por las bendiciones diarias y reconoce Su bondad en tu vida.

## 2. Sé Sincero
Habla con Dios como hablarías con un amigo cercano. Sé honesto sobre tus luchas y alegrías.

## 3. Pide con Fe
Confía en que Dios escuchará y responderá tus oraciones según Su voluntad perfecta.

## 4. Ora por Otros
Incluye oraciones por tu familia, amigos e incluso por aquellos que te han lastimado.

## 5. Escucha
La oración no es solo hablar con Dios, sino también escuchar Su voz y guía.

Recuerda, Jesús dijo: "Y cuando ores, no seas como los hipócritas; porque ellos aman el orar en pie en las sinagogas y en las esquinas de las calles, para ser vistos de los hombres." (Mateo 6:5)

¡Comparte esta publicación con tus amigos y familiares para ayudarlos a crecer en su vida de oración!`,

      `La Biblia es una fuente inagotable de sabiduría y orientación para nuestra vida diaria. Aquí hay algunos consejos para hacer tu lectura más productiva y significativa:

## 1. Establece una Rutina
Lee la Biblia diariamente, aunque sean solo unos pocos versículos. La consistencia es más importante que la cantidad.

## 2. Comienza con Oración
Pide a Dios que abra tu corazón y mente para entender Su palabra antes de comenzar a leer.

## 3. Reflexión y Meditación
No te apresures en el texto. Tómate tiempo para meditar sobre el significado y cómo se aplica a tu vida.

## 4. Aplicación Práctica
Intenta aplicar las enseñanzas en tu vida diaria. La Biblia debe transformarnos, no solo informarnos.

## 5. Estudia con Otros
Únete a un grupo de estudio bíblico o discute lo que has leído con otros creyentes.

Como escribió el salmista: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." (Salmo 119:105)

¡Comparte esta publicación con tus amigos y familiares para alentarlos en su jornada de lectura bíblica!`,

      `En el mundo acelerado de hoy, encontrar paz puede parecer una tarea imposible. Sin embargo, Jesús nos enseñó que la verdadera paz viene de adentro y de nuestra relación con Dios. Aquí hay algunas formas de cultivar la paz interior:

## 1. Oración y Meditación Diarias
Reserva tiempo cada día para la oración silenciosa y la reflexión. Esto ayuda a centrar tu mente en Dios.

## 2. Meditación en las Escrituras
Concéntrate en versículos sobre la paz y las promesas de Dios. Deja que Su palabra calme tus pensamientos ansiosos.

## 3. Práctica de Gratitud
Regularmente cuenta tus bendiciones y expresa gratitud a Dios por Su bondad.

## 4. Confía en el Plan de Dios
Recuerda que Dios está en control, incluso cuando las circunstancias parecen caóticas.

## 5. Sirve a Otros
A veces la mejor manera de encontrar paz es enfocarse en ayudar a otros necesitados.

## 6. Limita las Influencias Negativas
Reduce la exposición a noticias negativas y relaciones tóxicas que perturben tu paz.

Recuerda, Jesús dijo: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo." (Juan 14:27)

¡Comparte este mensaje de paz con otros que necesitan ánimo hoy!`,
    ],
    de: [
      `Beten ist eine wesentliche Praxis, um Ihre Verbindung mit Gott zu stärken. Jesus hat uns im Vaterunser ein klares Gebetsmodell hinterlassen. Hier sind einige praktische Schritte, um zu beten, wie Er es lehrte:

## 1. Beginnen Sie mit Dankbarkeit
Danken Sie Gott für tägliche Segnungen und erkennen Sie Seine Güte in Ihrem Leben an.

## 2. Seien Sie aufrichtig
Sprechen Sie mit Gott, wie Sie mit einem engen Freund sprechen würden. Seien Sie ehrlich über Ihre Kämpfe und Freuden.

## 3. Bitten Sie mit Glauben
Vertrauen Sie darauf, dass Gott Ihre Gebete hören und nach Seinem vollkommenen Willen beantworten wird.

## 4. Beten Sie für andere
Schließen Sie Gebete für Ihre Familie, Freunde und sogar für diejenigen ein, die Ihnen Unrecht getan haben.

## 5. Hören Sie zu
Gebet bedeutet nicht nur, mit Gott zu sprechen, sondern auch auf Seine Stimme und Führung zu hören.

Denken Sie daran, Jesus sagte: "Und wenn ihr betet, sollt ihr nicht sein wie die Heuchler, die gern in den Synagogen und an den Straßenecken stehen und beten, damit sie von den Menschen gesehen werden." (Matthäus 6:5)

Teilen Sie diesen Beitrag mit Ihren Freunden und Ihrer Familie, um ihnen zu helfen, in ihrem Gebetsleben zu wachsen!`,

      `Die Bibel ist eine unerschöpfliche Quelle der Weisheit und Führung für unser tägliches Leben. Hier sind einige Tipps, um Ihr Lesen produktiver und bedeutungsvoller zu gestalten:

## 1. Etablieren Sie eine Routine
Lesen Sie täglich in der Bibel, auch wenn es nur wenige Verse sind. Beständigkeit ist wichtiger als Quantität.

## 2. Beginnen Sie mit Gebet
Bitten Sie Gott, Ihr Herz und Ihren Verstand zu öffnen, um Sein Wort zu verstehen, bevor Sie mit dem Lesen beginnen.

## 3. Reflexion und Meditation
Hetzen Sie nicht durch den Text. Nehmen Sie sich Zeit, über die Bedeutung zu meditieren und wie sie sich auf Ihr Leben anwenden lässt.

## 4. Praktische Anwendung
Versuchen Sie, die Lehren in Ihrem täglichen Leben anzuwenden. Die Bibel soll uns verwandeln, nicht nur informieren.

## 5. Studieren Sie mit anderen
Treten Sie einer Bibelstudiengruppe bei oder diskutieren Sie das Gelesene mit anderen Gläubigen.

Wie der Psalmist schrieb: "Dein Wort ist meines Fußes Leuchte und ein Licht auf meinem Wege." (Psalm 119:105)

Teilen Sie diesen Beitrag mit Ihren Freunden und Ihrer Familie, um sie auf ihrer Bibellesereise zu ermutigen!`,

      `In der heutigen schnelllebigen Welt kann es wie eine unmögliche Aufgabe sein, Frieden zu finden. Jesus lehrte uns jedoch, dass wahrer Frieden von innen und aus unserer Beziehung zu Gott kommt. Hier sind einige Möglichkeiten, inneren Frieden zu kultivieren:

## 1. Tägliches Gebet und Meditation
Nehmen Sie sich jeden Tag Zeit für stilles Gebet und Besinnung. Dies hilft, Ihren Geist auf Gott zu konzentrieren.

## 2. Schriftmeditation
Konzentrieren Sie sich auf Verse über Frieden und Gottes Verheißungen. Lassen Sie Sein Wort Ihre ängstlichen Gedanken beruhigen.

## 3. Dankbarkeitspraxis
Zählen Sie regelmäßig Ihre Segnungen und drücken Sie Gott Dankbarkeit für Seine Güte aus.

## 4. Vertrauen Sie auf Gottes Plan
Denken Sie daran, dass Gott die Kontrolle hat, auch wenn die Umstände chaotisch erscheinen.

## 5. Dienen Sie anderen
Manchmal ist der beste Weg, Frieden zu finden, sich darauf zu konzentrieren, anderen in Not zu helfen.

## 6. Begrenzen Sie negative Einflüsse
Reduzieren Sie die Exposition gegenüber negativen Nachrichten und toxischen Beziehungen, die Ihren Frieden stören.

Denken Sie daran, Jesus sagte: "Frieden lasse ich euch, meinen Frieden gebe ich euch. Nicht gebe ich euch, wie die Welt gibt. Euer Herz erschrecke nicht und fürchte sich nicht." (Johannes 14:27)

Teilen Sie diese Friedensbotschaft mit anderen, die heute Ermutigung brauchen!`,
    ],
    fr: [
      `Prier est une pratique essentielle pour renforcer votre connexion avec Dieu. Jésus nous a laissé un modèle clair de prière dans le Notre Père. Voici quelques étapes pratiques pour prier comme Il l'a enseigné :

## 1. Commencez par la Gratitude
Remerciez Dieu pour les bénédictions quotidiennes et reconnaissez Sa bonté dans votre vie.

## 2. Soyez Sincère
Parlez à Dieu comme vous parleriez à un ami proche. Soyez honnête au sujet de vos luttes et de vos joies.

## 3. Demandez avec Foi
Ayez confiance que Dieu entendra et répondra à vos prières selon Sa volonté parfaite.

## 4. Priez pour les Autres
Incluez des prières pour votre famille, vos amis et même ceux qui vous ont fait du mal.

## 5. Écoutez
La prière ne consiste pas seulement à parler à Dieu, mais aussi à écouter Sa voix et Sa guidance.

Souvenez-vous, Jésus a dit : "Et quand vous priez, ne soyez pas comme les hypocrites, qui aiment à prier debout dans les synagogues et aux coins des rues, pour être vus des hommes." (Matthieu 6:5)

Partagez ce post avec vos amis et votre famille pour les aider à grandir dans leur vie de prière !`,

      `La Bible est une source inépuisable de sagesse et de guidance pour notre vie quotidienne. Voici quelques conseils pour rendre votre lecture plus productive et significative :

## 1. Établissez une Routine
Lisez la Bible quotidiennement, même si ce n'est que quelques versets. La constance est plus importante que la quantité.

## 2. Commencez par la Prière
Demandez à Dieu d'ouvrir votre cœur et votre esprit pour comprendre Sa parole avant de commencer à lire.

## 3. Réflexion et Méditation
Ne vous précipitez pas dans le texte. Prenez le temps de méditer sur la signification et comment elle s'applique à votre vie.

## 4. Application Pratique
Essayez d'appliquer les enseignements dans votre vie quotidienne. La Bible doit nous transformer, pas seulement nous informer.

## 5. Étudiez avec d'Autres
Rejoignez un groupe d'étude biblique ou discutez de ce que vous avez lu avec d'autres croyants.

Comme l'a écrit le psalmiste : "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier." (Psaume 119:105)

Partagez ce post avec vos amis et votre famille pour les encourager dans leur parcours de lecture biblique !`,

      `Dans le monde trépidant d'aujourd'hui, trouver la paix peut sembler une tâche impossible. Cependant, Jésus nous a enseigné que la vraie paix vient de l'intérieur et de notre relation avec Dieu. Voici quelques façons de cultiver la paix intérieure :

## 1. Prière et Méditation Quotidiennes
Réservez du temps chaque jour pour la prière silencieuse et la réflexion. Cela aide à centrer votre esprit sur Dieu.

## 2. Méditation des Écritures
Concentrez-vous sur les versets concernant la paix et les promesses de Dieu. Laissez Sa parole calmer vos pensées anxieuses.

## 3. Pratique de la Gratitude
Comptez régulièrement vos bénédictions et exprimez votre gratitude à Dieu pour Sa bonté.

## 4. Faites Confiance au Plan de Dieu
Rappelez-vous que Dieu a le contrôle, même quand les circonstances semblent chaotiques.

## 5. Servez les Autres
Parfois, la meilleure façon de trouver la paix est de se concentrer sur l'aide aux autres dans le besoin.

## 6. Limitez les Influences Négatives
Réduisez l'exposition aux nouvelles négatives et aux relations toxiques qui perturbent votre paix.

Souvenez-vous, Jésus a dit : "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point." (Jean 14:27)

Partagez ce message de paix avec d'autres qui ont besoin d'encouragement aujourd'hui !`,
    ],
    it: [
      `Pregare è una pratica essenziale per rafforzare la tua connessione con Dio. Gesù ci ha lasciato un chiaro modello di preghiera nel Padre Nostro. Ecco alcuni passi pratici per pregare come Lui ha insegnato:

## 1. Inizia con la Gratitudine
Ringrazia Dio per le benedizioni quotidiane e riconosci la Sua bontà nella tua vita.

## 2. Sii Sincero
Parla con Dio come parleresti con un amico stretto. Sii onesto riguardo alle tue lotte e gioie.

## 3. Chiedi con Fede
Confida che Dio ascolterà e risponderà alle tue preghiere secondo la Sua volontà perfetta.

## 4. Prega per gli Altri
Includi preghiere per la tua famiglia, amici e anche per coloro che ti hanno fatto del male.

## 5. Ascolta
La preghiera non è solo parlare con Dio, ma anche ascoltare la Sua voce e guida.

Ricorda, Gesù disse: "E quando pregate, non siate come gli ipocriti; perché essi amano pregare stando in piedi nelle sinagoghe e agli angoli delle strade per essere visti dagli uomini." (Matteo 6:5)

Condividi questo post con i tuoi amici e familiari per aiutarli a crescere nella loro vita di preghiera!`,

      `La Bibbia è una fonte inesauribile di saggezza e guida per la nostra vita quotidiana. Ecco alcuni consigli per rendere la tua lettura più produttiva e significativa:

## 1. Stabilisci una Routine
Leggi la Bibbia quotidianamente, anche se sono solo pochi versetti. La costanza è più importante della quantità.

## 2. Inizia con la Preghiera
Chiedi a Dio di aprire il tuo cuore e la tua mente per comprendere la Sua parola prima di iniziare a leggere.

## 3. Riflessione e Meditazione
Non affrettarti nel testo. Prenditi tempo per meditare sul significato e su come si applica alla tua vita.

## 4. Applicazione Pratica
Cerca di applicare gli insegnamenti nella tua vita quotidiana. La Bibbia deve trasformarci, non solo informarci.

## 5. Studia con Altri
Unisciti a un gruppo di studio biblico o discuti quello che hai letto con altri credenti.

Come scrisse il salmista: "La tua parola è una lampada al mio piede e una luce sul mio sentiero." (Salmo 119:105)

Condividi questo post con i tuoi amici e familiari per incoraggiarli nel loro percorso di lettura biblica!`,

      `Nel mondo frenetico di oggi, trovare la pace può sembrare un compito impossibile. Tuttavia, Gesù ci ha insegnato che la vera pace viene dall'interno e dalla nostra relazione con Dio. Ecco alcuni modi per coltivare la pace interiore:

## 1. Preghiera e Meditazione Quotidiane
Dedica del tempo ogni giorno alla preghiera silenziosa e alla riflessione. Questo aiuta a centrare la tua mente su Dio.

## 2. Meditazione delle Scritture
Concentrati sui versetti riguardanti la pace e le promesse di Dio. Lascia che la Sua parola calmi i tuoi pensieri ansiosi.

## 3. Pratica della Gratitudine
Conta regolarmente le tue benedizioni ed esprimi gratitudine a Dio per la Sua bontà.

## 4. Confida nel Piano di Dio
Ricorda che Dio ha il controllo, anche quando le circostanze sembrano caotiche.

## 5. Servi gli Altri
A volte il modo migliore per trovare pace è concentrarsi sull'aiutare altri bisognosi.

## 6. Limita le Influenze Negative
Riduci l'esposizione a notizie negative e relazioni tossiche che disturbano la tua pace.

Ricorda, Gesù disse: "Vi lascio la pace, vi do la mia pace. Io non vi do come il mondo dà. Il vostro cuore non sia turbato e non si sgomenti." (Giovanni 14:27)

Condividi questo messaggio di pace con altri che hanno bisogno di incoraggiamento oggi!`,
    ],
    fil: [
      `Ang pananalangin ay isang mahalagang kasanayan upang palakasin ang inyong koneksyon sa Diyos. Iniwan sa atin ni Hesus ang isang malinaw na modelo ng panalangin sa Panalangin ng Panginoon. Narito ang ilang praktikal na hakbang upang manalangin tulad ng Kanyang itinuro:

## 1. Magsimula sa Pasasalamat
Pasalamatan ang Diyos para sa pang-araw-araw na mga pagpapala at kilalanin ang Kanyang kabutihan sa inyong buhay.

## 2. Maging Tapat
Makipag-usap sa Diyos tulad ng pakikipag-usap ninyo sa isang malapit na kaibigan. Maging tapat tungkol sa inyong mga pakikipagbaka at kagalakan.

## 3. Humiling nang may Pananampalataya
Magtiwala na maririnig at sasagutin ng Diyos ang inyong mga panalangin ayon sa Kanyang perpektong kalooban.

## 4. Manalangin para sa Iba
Isama ang mga panalangin para sa inyong pamilya, mga kaibigan, at maging sa mga nakasakit sa inyo.

## 5. Makinig
Ang panalangin ay hindi lamang pakikipag-usap sa Diyos, kundi pakikinig din sa Kanyang tinig at patnubay.

Tandaan, sinabi ni Hesus: "At pagka kayo'y nagsisipanalangin, huwag kayong maging gaya ng mga mapagkunware, sapagka't sila'y nagsisipanalangin na nakatayo sa mga sinagoga at sa mga sulok ng mga lansangan, upang makita ng mga tao." (Mateo 6:5)

Ibahagi ang post na ito sa inyong mga kaibigan at pamilya upang matulungan silang lumago sa kanilang buhay panalangin!`,

      `Ang Bibliya ay isang hindi mauubos na pinagmumulan ng karunungan at patnubay para sa aming pang-araw-araw na buhay. Narito ang ilang tip upang gawing mas produktibo at makabuluhan ang inyong pagbabasa:

## 1. Magtatag ng Rutina
Magbasa ng Bibliya araw-araw, kahit na ilang talata lamang. Ang pagkakapatuloy ay mas mahalaga kaysa sa dami.

## 2. Magsimula sa Panalangin
Hilingin sa Diyos na buksan ang inyong puso at isipan upang maunawaan ang Kanyang salita bago magsimulang magbasa.

## 3. Pagninilay at Pagmumuni-muni
Huwag magmadali sa teksto. Maglaan ng oras upang pagbulay-bulayin ang kahulugan at kung paano ito naaangkop sa inyong buhay.

## 4. Praktikal na Aplikasyon
Subukang ilapat ang mga turo sa inyong pang-araw-araw na buhay. Ang Bibliya ay dapat na magbago sa atin, hindi lamang magbigay ng impormasyon.

## 5. Mag-aral kasama ng Iba
Sumali sa isang grupo ng pag-aaral ng Bibliya o pag-usapan ang nabasa ninyo kasama ng ibang mga mananampalataya.

Tulad ng isinulat ng mang-aawit: "Ang inyong salita ay ilawan sa aking mga paa, at liwanag sa aking landas." (Awit 119:105)

Ibahagi ang post na ito sa inyong mga kaibigan at pamilya upang hikayatin sila sa kanilang paglalakbay sa pagbabasa ng Bibliya!`,

      `Sa mabilis na mundo ngayon, ang paghahanap ng kapayapaan ay tila imposibleng gawain. Gayunpaman, itinuro sa atin ni Hesus na ang tunay na kapayapaan ay nagmumula sa loob at sa aming relasyon sa Diyos. Narito ang ilang paraan upang linangin ang panloob na kapayapaan:

## 1. Pang-araw-araw na Panalangin at Pagmumuni-muni
Maglaan ng oras bawat araw para sa tahimik na panalangin at pagninilay. Nakakatulong ito na isentro ang inyong isipan sa Diyos.

## 2. Pagmumuni-muni sa Kasulatan
Magtuon sa mga talata tungkol sa kapayapaan at mga pangako ng Diyos. Hayaang pakalmahin ng Kanyang salita ang inyong mga nababahalang iniisip.

## 3. Pagsasanay ng Pasasalamat
Regular na bilangin ang inyong mga pagpapala at ipahayag ang pasasalamat sa Diyos para sa Kanyang kabutihan.

## 4. Magtiwala sa Plano ng Diyos
Tandaan na hawak ng Diyos ang kontrol, kahit na tila magulo ang mga pangyayari.

## 5. Maglingkod sa Iba
Minsan ang pinakamahusay na paraan upang makahanap ng kapayapaan ay ang pagtuon sa pagtulong sa mga nangangailangan.

## 6. Limitahan ang mga Negatibong Impluwensya
Bawasan ang pagkakalantad sa mga negatibong balita at mga nakalalasong relasyon na nakakagambala sa inyong kapayapaan.

Tandaan, sinabi ni Hesus: "Ang kapayapaan ay iniiwan ko sa inyo, ang aking kapayapaan ay ibinibigay ko sa inyo. Hindi ko ibinibigay sa inyo gaya ng pagbibigay ng mundo. Huwag mabalisa ang inyong puso, at huwag matakot." (Juan 14:27)

Ibahagi ang mensaheng ito ng kapayapaan sa iba na nangangailangan ng pag-asa ngayon!`,
    ],
  }

  // Return content for the requested language, or English as fallback
  return contentsByLang[lang] || contentsByLang.en
}
