/**
 * Script para criar posts de exemplo se eles não existirem
 */

const fs = require("fs")
const path = require("path")

const postsDirectory = path.join(process.cwd(), "content/posts")

// Ensure the posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
  console.log("Created posts directory:", postsDirectory)
}

const languages = ["en", "pt", "es", "de", "fr", "it", "fil"]

// Create posts for each language
languages.forEach((lang) => {
  const langDirectory = path.join(postsDirectory, lang)

  if (!fs.existsSync(langDirectory)) {
    fs.mkdirSync(langDirectory, { recursive: true })
    console.log(`Created directory for language: ${lang}`)
  }

  // Check if posts exist
  const files = fs.readdirSync(langDirectory)
  const markdownFiles = files.filter((file) => file.endsWith(".md"))

  if (markdownFiles.length === 0) {
    console.log(`Creating sample posts for ${lang}`)
    createSamplePosts(lang)
  } else {
    console.log(`${lang} already has ${markdownFiles.length} posts`)
  }
})

function createSamplePosts(lang) {
  const langDirectory = path.join(postsDirectory, lang)
  const titles = getLocalizedTitles(lang)
  const contents = getLocalizedContents(lang)

  for (let i = 0; i < titles.length; i++) {
    const postContent = `---
title: "${titles[i].title}"
date: "${new Date(Date.now() - i * 86400000).toISOString().split("T")[0]}"
tags: [${titles[i].tags.map((tag) => `"${tag}"`).join(", ")}]
excerpt: "${titles[i].excerpt}"
---

${contents[i]}
`
    const filePath = path.join(langDirectory, `${titles[i].slug}.md`)
    fs.writeFileSync(filePath, postContent)
    console.log(`Created: ${filePath}`)
  }
}

function getLocalizedTitles(lang) {
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
        slug: "como-orar-como-jesus",
        tags: ["oração", "jesus", "fé"],
        excerpt: "Aprenda a orar como Jesus ensinou, com simplicidade e poder.",
      },
      {
        title: "A Importância da Leitura Bíblica",
        slug: "importancia-da-leitura-biblica",
        tags: ["bíblia", "espiritualidade", "fé"],
        excerpt: "Descubra como a leitura bíblica pode transformar sua vida espiritual.",
      },
      {
        title: "Encontrando Paz em um Mundo Caótico",
        slug: "encontrando-paz-em-um-mundo-caotico",
        tags: ["paz", "atenção plena", "espiritualidade"],
        excerpt: "Estratégias práticas para encontrar paz interior no mundo agitado de hoje.",
      },
    ],
    es: [
      {
        title: "Cómo Orar Como Jesús",
        slug: "como-orar-como-jesus",
        tags: ["oración", "jesús", "fe"],
        excerpt: "Aprende a orar como Jesús enseñó, con simplicidad y poder.",
      },
      {
        title: "La Importancia de la Lectura Bíblica",
        slug: "importancia-de-la-lectura-biblica",
        tags: ["biblia", "espiritualidad", "fe"],
        excerpt: "Descubre cómo la lectura bíblica puede transformar tu vida espiritual.",
      },
      {
        title: "Encontrando Paz en un Mundo Caótico",
        slug: "encontrando-paz-en-un-mundo-caotico",
        tags: ["paz", "atención plena", "espiritualidad"],
        excerpt: "Estrategias prácticas para encontrar paz interior en el agitado mundo de hoy.",
      },
    ],
    de: [
      {
        title: "Wie man wie Jesus betet",
        slug: "wie-man-wie-jesus-betet",
        tags: ["gebet", "jesus", "glaube"],
        excerpt: "Lernen Sie zu beten, wie Jesus es lehrte, mit Einfachheit und Kraft.",
      },
      {
        title: "Die Bedeutung des Bibellesens",
        slug: "bedeutung-des-bibellesens",
        tags: ["bibel", "spiritualität", "glaube"],
        excerpt: "Entdecken Sie, wie Bibellesen Ihr spirituelles Leben verändern kann.",
      },
      {
        title: "Frieden finden in einer chaotischen Welt",
        slug: "frieden-finden-in-einer-chaotischen-welt",
        tags: ["frieden", "achtsamkeit", "spiritualität"],
        excerpt: "Praktische Strategien, um inneren Frieden in der hektischen Welt von heute zu finden.",
      },
    ],
    fr: [
      {
        title: "Comment prier comme Jésus",
        slug: "comment-prier-comme-jesus",
        tags: ["prière", "jésus", "foi"],
        excerpt: "Apprenez à prier comme Jésus l'a enseigné, avec simplicité et puissance.",
      },
      {
        title: "L'importance de la lecture biblique",
        slug: "importance-de-la-lecture-biblique",
        tags: ["bible", "spiritualité", "foi"],
        excerpt: "Découvrez comment la lecture biblique peut transformer votre vie spirituelle.",
      },
      {
        title: "Trouver la paix dans un monde chaotique",
        slug: "trouver-la-paix-dans-un-monde-chaotique",
        tags: ["paix", "pleine conscience", "spiritualité"],
        excerpt: "Stratégies pratiques pour trouver la paix intérieure dans le monde trépidant d'aujourd'hui.",
      },
    ],
    it: [
      {
        title: "Come pregare come Gesù",
        slug: "come-pregare-come-gesu",
        tags: ["preghiera", "gesù", "fede"],
        excerpt: "Impara a pregare come ha insegnato Gesù, con semplicità e potenza.",
      },
      {
        title: "L'importanza della lettura biblica",
        slug: "importanza-della-lettura-biblica",
        tags: ["bibbia", "spiritualità", "fede"],
        excerpt: "Scopri come la lettura biblica può trasformare la tua vita spirituale.",
      },
      {
        title: "Trovare pace in un mondo caotico",
        slug: "trovare-pace-in-un-mondo-caotico",
        tags: ["pace", "mindfulness", "spiritualità"],
        excerpt: "Strategie pratiche per trovare la pace interiore nel frenetico mondo di oggi.",
      },
    ],
    fil: [
      {
        title: "Paano Manalangin Tulad ni Hesus",
        slug: "paano-manalangin-tulad-ni-hesus",
        tags: ["panalangin", "hesus", "pananampalataya"],
        excerpt: "Matuto kung paano manalangin tulad ng itinuro ni Hesus, nang may kasimplehan at kapangyarihan.",
      },
      {
        title: "Ang Kahalagahan ng Pagbabasa ng Bibliya",
        slug: "kahalagahan-ng-pagbabasa-ng-bibliya",
        tags: ["bibliya", "espiritwalidad", "pananampalataya"],
        excerpt: "Tuklasin kung paano mababago ng pagbabasa ng Bibliya ang iyong espirituwal na buhay.",
      },
      {
        title: "Paghahanap ng Kapayapaan sa isang Magulo na Mundo",
        slug: "paghahanap-ng-kapayapaan-sa-isang-magulo-na-mundo",
        tags: ["kapayapaan", "mindfulness", "espiritwalidad"],
        excerpt: "Mga praktikal na estratehiya upang makahanap ng panloob na kapayapaan sa abalang mundo ngayon.",
      },
    ],
  }

  return titlesByLang[lang] || titlesByLang.en
}

function getLocalizedContents(lang) {
  const contentsByLang = {
    en: [
      `Praying is an essential practice to strengthen your connection with God. Jesus left us a clear model of prayer in the Lord's Prayer.

## How to Pray Like Jesus

1. **Start with Gratitude:** Thank God for daily blessings.
2. **Be Sincere:** Talk to God as you would talk to a close friend.
3. **Ask with Faith:** Trust that God will hear and answer your prayers.

Share this post with your friends and family!`,

      `The Bible is an inexhaustible source of wisdom and guidance.

## Tips for Better Bible Reading

1. **Establish a Routine:** Read the Bible daily, even if it's just a few verses.
2. **Reflection:** Meditate on the meaning of the texts.
3. **Practical Application:** Try to apply the teachings in your daily life.

Share this post with your friends and family!`,

      `In today's fast-paced world, finding peace can seem like an impossible task.

## Finding Inner Peace

1. **Daily Prayer:** Set aside time each day for quiet prayer and reflection.
2. **Scripture Meditation:** Focus on verses about peace and God's promises.
3. **Gratitude Practice:** Regularly count your blessings and express thanks to God.

Remember, Jesus said: "Peace I leave with you; my peace I give you." (John 14:27)`,
    ],
    pt: [
      `Orar é uma prática essencial para fortalecer sua conexão com Deus. Jesus nos deixou um modelo claro de oração no Pai Nosso.

## Como Orar Como Jesus

1. **Comece com Gratidão:** Agradeça a Deus pelas bênçãos diárias.
2. **Seja Sincero:** Fale com Deus como falaria com um amigo próximo.
3. **Peça com Fé:** Confie que Deus ouvirá e responderá suas orações.

Compartilhe este post com seus amigos e familiares!`,

      `A Bíblia é uma fonte inesgotável de sabedoria e orientação.

## Dicas para uma Melhor Leitura Bíblica

1. **Estabeleça uma Rotina:** Leia a Bíblia diariamente, mesmo que sejam poucos versículos.
2. **Reflexão:** Medite sobre o significado dos textos.
3. **Aplicação Prática:** Tente aplicar os ensinamentos no seu dia a dia.

Compartilhe este post com seus amigos e familiares!`,

      `No mundo acelerado de hoje, encontrar paz pode parecer uma tarefa impossível.

## Encontrando Paz Interior

1. **Oração Diária:** Reserve um tempo todos os dias para oração silenciosa e reflexão.
2. **Meditação nas Escrituras:** Concentre-se em versículos sobre paz e promessas de Deus.
3. **Prática de Gratidão:** Regularmente conte suas bênçãos e expresse gratidão a Deus.

Lembre-se, Jesus disse: "Deixo-vos a paz, a minha paz vos dou." (João 14:27)`,
    ],
    es: [
      `Orar es una práctica esencial para fortalecer tu conexión con Dios. Jesús nos dejó un modelo claro de oración en el Padre Nuestro.

## Cómo Orar Como Jesús

1. **Comienza con Gratitud:** Agradece a Dios por las bendiciones diarias.
2. **Sé Sincero:** Habla con Dios como hablarías con un amigo cercano.
3. **Pide con Fe:** Confía en que Dios escuchará y responderá tus oraciones.

¡Comparte esta publicación con tus amigos y familiares!`,

      `La Biblia es una fuente inagotable de sabiduría y orientación.

## Consejos para una Mejor Lectura Bíblica

1. **Establece una Rutina:** Lee la Biblia diariamente, aunque sean solo unos pocos versículos.
2. **Reflexión:** Medita sobre el significado de los textos.
3. **Aplicación Práctica:** Intenta aplicar las enseñanzas en tu vida diaria.

¡Comparte esta publicación con tus amigos y familiares!`,

      `En el mundo acelerado de hoy, encontrar paz puede parecer una tarea imposible.

## Encontrando Paz Interior

1. **Oración Diaria:** Reserva tiempo cada día para la oración silenciosa y la reflexión.
2. **Meditación en las Escrituras:** Concéntrate en versículos sobre la paz y las promesas de Dios.
3. **Práctica de Gratitud:** Regularmente cuenta tus bendiciones y expresa gratitud a Dios.

Recuerda, Jesús dijo: "La paz os dejo, mi paz os doy." (Juan 14:27)`,
    ],
    de: [
      `Beten ist eine wesentliche Praxis, um Ihre Verbindung mit Gott zu stärken. Jesus hat uns im Vaterunser ein klares Gebetsmodell hinterlassen.

## Wie man wie Jesus betet

1. **Beginnen Sie mit Dankbarkeit:** Danken Sie Gott für tägliche Segnungen.
2. **Seien Sie aufrichtig:** Sprechen Sie mit Gott, wie Sie mit einem engen Freund sprechen würden.
3. **Bitten Sie mit Glauben:** Vertrauen Sie darauf, dass Gott Ihre Gebete hört und beantwortet.

Teilen Sie diesen Beitrag mit Ihren Freunden und Ihrer Familie!`,

      `Die Bibel ist eine unerschöpfliche Quelle der Weisheit und Führung.

## Tipps für besseres Bibellesen

1. **Etablieren Sie eine Routine:** Lesen Sie täglich in der Bibel, auch wenn es nur wenige Verse sind.
2. **Reflexion:** Meditieren Sie über die Bedeutung der Texte.
3. **Praktische Anwendung:** Versuchen Sie, die Lehren in Ihrem täglichen Leben anzuwenden.

Teilen Sie diesen Beitrag mit Ihren Freunden und Ihrer Familie!`,

      `In der heutigen schnelllebigen Welt kann es wie eine unmögliche Aufgabe erscheinen, Frieden zu finden.

## Inneren Frieden finden

1. **Tägliches Gebet:** Nehmen Sie sich jeden Tag Zeit für stilles Gebet und Reflexion.
2. **Schriftmeditation:** Konzentrieren Sie sich auf Verse über Frieden und Gottes Verheißungen.
3. **Dankbarkeitspraxis:** Zählen Sie regelmäßig Ihre Segnungen und danken Sie Gott.

Denken Sie daran, Jesus sagte: "Frieden lasse ich euch, meinen Frieden gebe ich euch." (Johannes 14:27)`,
    ],
    fr: [
      `Prier est une pratique essentielle pour renforcer votre connexion avec Dieu. Jésus nous a laissé un modèle clair de prière dans le Notre Père.

## Comment prier comme Jésus

1. **Commencez par la Gratitude:** Remerciez Dieu pour les bénédictions quotidiennes.
2. **Soyez Sincère:** Parlez à Dieu comme vous parleriez à un ami proche.
3. **Demandez avec Foi:** Ayez confiance que Dieu entendra et répondra à vos prières.

Partagez ce post avec vos amis et votre famille!`,

      `La Bible est une source inépuisable de sagesse et de guidance.

## Conseils pour une meilleure lecture biblique

1. **Établissez une Routine:** Lisez la Bible quotidiennement, même si ce n'est que quelques versets.
2. **Réflexion:** Méditez sur la signification des textes.
3. **Application Pratique:** Essayez d'appliquer les enseignements dans votre vie quotidienne.

Partagez ce post avec vos amis et votre famille!`,

      `Dans le monde trépidant d'aujourd'hui, trouver la paix peut sembler une tâche impossible.

## Trouver la paix intérieure

1. **Prière Quotidienne:** Réservez du temps chaque jour pour la prière silencieuse et la réflexion.
2. **Méditation des Écritures:** Concentrez-vous sur les versets concernant la paix et les promesses de Dieu.
3. **Pratique de la Gratitude:** Comptez régulièrement vos bénédictions et exprimez votre gratitude à Dieu.

Souvenez-vous, Jésus a dit: "Je vous laisse la paix, je vous donne ma paix." (Jean 14:27)`,
    ],
    it: [
      `Pregare è una pratica essenziale per rafforzare la tua connessione con Dio. Gesù ci ha lasciato un chiaro modello di preghiera nel Padre Nostro.

## Come pregare come Gesù

1. **Inizia con Gratitudine:** Ringrazia Dio per le benedizioni quotidiane.
2. **Sii Sincero:** Parla con Dio come parleresti con un amico stretto.
3. **Chiedi con Fede:** Confida che Dio ascolterà e risponderà alle tue preghiere.

Condividi questo post con i tuoi amici e familiari!`,

      `La Bibbia è una fonte inesauribile di saggezza e guida.

## Consigli per una migliore lettura biblica

1. **Stabilisci una Routine:** Leggi la Bibbia quotidianamente, anche se sono solo pochi versetti.
2. **Riflessione:** Medita sul significato dei testi.
3. **Applicazione Pratica:** Cerca di applicare gli insegnamenti nella tua vita quotidiana.

Condividi questo post con i tuoi amici e familiari!`,

      `Nel mondo frenetico di oggi, trovare la pace può sembrare un compito impossibile.

## Trovare la pace interiore

1. **Preghiera Quotidiana:** Dedica del tempo ogni giorno alla preghiera silenziosa e alla riflessione.
2. **Meditazione delle Scritture:** Concentrati sui versetti riguardanti la pace e le promesse di Dio.
3. **Pratica della Gratitudine:** Conta regolarmente le tue benedizioni ed esprimi gratitudine a Dio.

Ricorda, Gesù ha detto: "Vi lascio la pace, vi do la mia pace." (Giovanni 14:27)`,
    ],
    fil: [
      `Ang pananalangin ay isang mahalagang kasanayan upang palakasin ang inyong koneksyon sa Diyos. Iniwan sa atin ni Hesus ang isang malinaw na modelo ng panalangin sa Panalangin ng Panginoon.

## Paano Manalangin Tulad ni Hesus

1. **Magsimula sa Pasasalamat:** Pasalamatan ang Diyos para sa pang-araw-araw na mga pagpapala.
2. **Maging Tapat:** Makipag-usap sa Diyos tulad ng pakikipag-usap mo sa isang malapit na kaibigan.
3. **Humiling nang may Pananampalataya:** Magtiwala na maririnig at sasagutin ng Diyos ang inyong mga panalangin.

Ibahagi ang post na ito sa inyong mga kaibigan at pamilya!`,

      `Ang Bibliya ay isang hindi mauubos na pinagmumulan ng karunungan at patnubay.

## Mga Tip para sa Mas Mahusay na Pagbabasa ng Bibliya

1. **Magtatag ng Rutina:** Magbasa ng Bibliya araw-araw, kahit na ilang talata lamang.
2. **Pagninilay:** Pagbulay-bulayin ang kahulugan ng mga teksto.
3. **Praktikal na Aplikasyon:** Subukang ilapat ang mga turo sa inyong pang-araw-araw na buhay.

Ibahagi ang post na ito sa inyong mga kaibigan at pamilya!`,

      `Sa mabilis na mundo ngayon, ang paghahanap ng kapayapaan ay tila imposibleng gawain.

## Paghahanap ng Panloob na Kapayapaan

1. **Pang-araw-araw na Panalangin:** Maglaan ng oras bawat araw para sa tahimik na panalangin at pagninilay.
2. **Pagninilay sa Kasulatan:** Magtuon sa mga talata tungkol sa kapayapaan at mga pangako ng Diyos.
3. **Pagsasanay ng Pasasalamat:** Regular na bilangin ang inyong mga pagpapala at ipahayag ang pasasalamat sa Diyos.

Tandaan, sinabi ni Hesus: "Ang kapayapaan ay iniiwan ko sa inyo, ang aking kapayapaan ay ibinibigay ko sa inyo." (Juan 14:27)`,
    ],
  }

  return contentsByLang[lang] || contentsByLang.en
}

console.log("Posts creation completed!")
