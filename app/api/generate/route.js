import { NextResponse } from 'next/server'

export async function POST(request) {
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
Categoría: ${categoryContext[category]}
Estilo: ${stylePrompts[style]}
${customPrompt ? `Contexto adicional: ${customPrompt}` : ''}
Reglas: impactantes, máximo 2-3 líneas, sin emojis, habla directo al hombre que entrena.
Responde SOLO con JSON array de 5 strings: ["hook1","hook2","hook3","hook4","hook5"]`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const text = data.content?.find(b => b.type === 'text')?.text || '[]'
  const clean = text.replace(/```json|```/g, '').trim()
  const hooks = JSON.parse(clean)
  return NextResponse.json({ hooks })
}
