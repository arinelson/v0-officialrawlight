import type { Post } from "./posts"

export interface WebStorySlide {
  id: string
  type: "cover" | "content" | "end"
  title?: string
  subtitle?: string
  text?: string
  image: string
  backgroundColor?: string
}

export function generateWebStoryFromPost(post: Post): WebStorySlide[] {
  // Split content into meaningful chunks
  const contentSections = post.content
    .split(/\n#{1,3}\s+/) // Split by headers
    .filter((section) => section.trim().length > 0)
    .map((section) => section.trim())

  const slides: WebStorySlide[] = []

  // Cover slide
  slides.push({
    id: `${post.slug}-cover`,
    type: "cover",
    title: post.title,
    subtitle: post.excerpt,
    image: `/placeholder.svg?height=640&width=360&text=${encodeURIComponent(post.title)}`,
  })

  // Content slides
  contentSections.slice(0, 8).forEach((section, index) => {
    // Check if section starts with a header
    const lines = section.split("\n").filter((line) => line.trim())
    const firstLine = lines[0]
    const isHeader = firstLine && (firstLine.startsWith("#") || firstLine.length < 50)

    const title = isHeader ? firstLine.replace(/^#+\s*/, "") : undefined
    const text = isHeader ? lines.slice(1).join("\n") : section

    // Clean up text
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
      .replace(/`(.*?)`/g, "$1") // Remove code markdown
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Remove links, keep text
      .trim()

    if (cleanText.length > 20) {
      // Only add if there's substantial content
      slides.push({
        id: `${post.slug}-content-${index}`,
        type: "content",
        title: title,
        text: cleanText,
        image: `/placeholder.svg?height=640&width=360&text=Slide ${index + 2}`,
      })
    }
  })

  // End slide
  slides.push({
    id: `${post.slug}-end`,
    type: "end",
    title: "Obrigado por ler!",
    subtitle: "Explore mais histórias",
    image: `/placeholder.svg?height=640&width=360&text=Obrigado`,
  })

  return slides
}

// Generate AMP-compatible Web Story HTML
export function generateAMPWebStory(post: Post, slides: WebStorySlide[], lang: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"

  return `<!DOCTYPE html>
<html ⚡ lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${post.title}</title>
  <link rel="canonical" href="${baseUrl}/${lang}/webstories/${post.slug}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  
  <!-- Metadata -->
  <meta name="description" content="${post.excerpt}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt}">
  <meta property="og:url" content="${baseUrl}/${lang}/webstories/${post.slug}">
  <meta property="og:image" content="${baseUrl}/placeholder.svg?height=640&width=360&text=${encodeURIComponent(post.title)}">
  
  <!-- Web Story specific metadata -->
  <meta name="web-stories-replace-head-start">
  <meta name="web-stories-replace-head-end">
</head>
<body>
  <amp-story standalone
    title="${post.title}"
    publisher="LUZ CRUA"
    publisher-logo-src="${baseUrl}/favicon.ico"
    poster-portrait-src="${baseUrl}/placeholder.svg?height=640&width=360&text=${encodeURIComponent(post.title)}">
    
    ${slides
      .map(
        (slide, index) => `
    <amp-story-page id="page-${index}">
      <amp-story-grid-layer template="fill">
        <amp-img src="${slide.image}"
          width="360" height="640"
          layout="responsive"
          alt="${slide.title || `Slide ${index + 1}`}">
        </amp-img>
      </amp-story-grid-layer>
      
      <amp-story-grid-layer template="vertical">
        ${
          slide.type === "cover"
            ? `
          <h1 animate-in="fade-in" animate-in-delay="0.5s">${slide.title}</h1>
          <p animate-in="fade-in" animate-in-delay="1s">${slide.subtitle}</p>
        `
            : slide.type === "content"
              ? `
          ${slide.title ? `<h2 animate-in="fade-in" animate-in-delay="0.5s">${slide.title}</h2>` : ""}
          <p animate-in="fade-in" animate-in-delay="1s">${slide.text}</p>
        `
              : `
          <h2 animate-in="fade-in" animate-in-delay="0.5s">${slide.title}</h2>
          <p animate-in="fade-in" animate-in-delay="1s">${slide.subtitle}</p>
        `
        }
      </amp-story-grid-layer>
    </amp-story-page>
    `,
      )
      .join("")}
    
  </amp-story>
</body>
</html>`
}
