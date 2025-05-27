/**
 * Este script verifica a plataforma de hospedagem e executa configurações específicas
 * para garantir compatibilidade com Vercel e Netlify
 */

const fs = require("fs")
const path = require("path")

// Detecta se estamos no Netlify
const isNetlify = process.env.NETLIFY === "true"

console.log(`Ambiente de hospedagem detectado: ${isNetlify ? "Netlify" : "Vercel/Outro"}`)

if (isNetlify) {
  console.log("Configurando para Netlify...")

  // Verifica se o plugin do Netlify para Next.js está instalado
  try {
    require("@netlify/plugin-nextjs")
    console.log("Plugin do Netlify para Next.js encontrado.")
  } catch (error) {
    console.error("Plugin do Netlify para Next.js não encontrado. Instale com: npm install -D @netlify/plugin-nextjs")
    process.exit(1)
  }

  // Verifica se o arquivo next.config.js está configurado corretamente para Netlify
  const nextConfigPath = path.join(process.cwd(), "next.config.mjs")
  if (fs.existsSync(nextConfigPath)) {
    let nextConfig = fs.readFileSync(nextConfigPath, "utf8")

    // Verifica se já temos configurações para o Netlify
    if (!nextConfig.includes("netlify")) {
      console.log("Atualizando next.config.mjs para compatibilidade com Netlify...")

      // Adiciona configurações para o Netlify
      nextConfig = nextConfig.replace(
        "const nextConfig = {",
        'const nextConfig = {\n  // Configurações para Netlify\n  output: "standalone",\n',
      )

      fs.writeFileSync(nextConfigPath, nextConfig)
      console.log("next.config.mjs atualizado com sucesso.")
    } else {
      console.log("next.config.mjs já está configurado para Netlify.")
    }
  } else {
    console.error("Arquivo next.config.mjs não encontrado.")
  }
}

console.log("Verificação de plataforma concluída.")
