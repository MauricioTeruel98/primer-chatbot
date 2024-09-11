import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { role, messages } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a ${role}. Respond accordingly.` },
        ...messages
      ],
    })

    return new Response(JSON.stringify({ result: completion.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch(error) {
    console.error('OpenAI API error:', error)
    return new Response(JSON.stringify({ error: 'An error occurred during your request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}