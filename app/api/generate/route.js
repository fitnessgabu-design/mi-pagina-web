import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { category, style, customPrompt } = await request.json()

    const categoryContext = {
      muscle: 'ganar masa muscular, hipertrofia, proteínas, entrenamiento de fuerza, progresión de carga',
      fat_loss: 'perder grasa corporal, déficit calórico, cardio, metabolismo, composición corporal',
      testosterone: 'testosterona natural, niveles hormonales, hábitos masculinos, sueño, nutrición, fuerza',
      discipline: 'disciplina mental, consistencia, hábitos, mentalidad ganadora, no rendirse, esfuerzo diario',
    }

    const stylePrompts = {
      hormozi: 'estilo Alex Hormozi: directo, sin rodeos, con datos o números concretos, frases cortas y contundentes',
      aggressive: 'estilo reel agresivo: alta energía, palabras de impacto, provoca una reacción emocional fuerte',
      stoic: 'estilo estoico y frío: impacto silencioso, filosofía aplicada al fitness, frases que hacen reflexionar',
      challenger: 'estilo challenger que rompe creencias populares: controversial, va contra la corriente',
    }

    const prompt = `Genera exactamente 5 hooks fitness virales en español.
Categoría: ${categoryContext[category] || categoryContext.muscle}
Estilo: ${stylePrompts[style] || stylePrompts.hormozi}
${customPrompt ? `Contexto adicional: ${customPrompt}` : ''}
Reglas: impactantes, máximo 2-3 líneas, sin emojis, habla directo al hombre que entrena.
IMPORTANTE: Responde ÚNICAMENTE con un JSON array de exactamente 5 strings, sin texto adicional, sin markdown, sin explicaciones.
Formato exacto: ["hook1","hook2","hook3","hook4","hook5"]`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Anthropic error:', err)
      return NextResponse.json({ hooks: [], error: 'Anthropic API error: ' + res.status }, { status: 200 })
    }

    const data = await res.json()
    console.log('Anthropic response:', JSON.stringify(data))

    const textBlock = data.content?.find(b => b.type === 'text')
    if (!textBlock) {
      console.error('No text block in response')
      return NextResponse.json({ hooks: [], error: 'No text in response' }, { status: 200 })
    }

    const raw = textBlock.text.trim()
    console.log('Raw text:', raw)

    // Try to extract JSON array from the response
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) {
      console.error('No JSON array found in:', raw)
      return NextResponse.json({ hooks: [], error: 'Could not parse response' }, { status: 200 })
    }

    const hooks = JSON.parse(match[0])
    return NextResponse.json({ hooks })

  } catch (e) {
    console.error('Route error:', e)
    return NextResponse.json({ hooks: [], error: e.message }, { status: 200 })
  }
}
