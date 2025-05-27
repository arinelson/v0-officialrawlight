import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get title from query params
    const title = searchParams.get("title") || "LUZ CRUA"
    const lang = searchParams.get("lang") || "en"

    // Font
    const interBold = await fetch(
      new URL("https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap", request.url),
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontStyle: "normal",
            color: "black",
            marginTop: 30,
            lineHeight: 1.2,
            whiteSpace: "pre-wrap",
            textAlign: "center",
            padding: "0 120px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "auto",
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 36, fontWeight: "bold" }}>
            LUZ <span style={{ color: "#3b82f6" }}>CRUA</span>
          </span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
