import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSlideImage(prompt: string) {
  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  })

  const imageBase64 = result.data?.[0]?.b64_json

  if (!imageBase64) {
    throw new Error("No image returned")
  }

  return `data:image/png;base64,${imageBase64}`
}