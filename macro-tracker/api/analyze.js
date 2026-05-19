exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { description } = JSON.parse(event.body);
    if (!description) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Falta descripción' }) };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: `Eres un nutriólogo experto. El usuario describe una comida en español. Calcula los macronutrientes usando valores nutricionales estándar para México. Responde ÚNICAMENTE con JSON válido sin markdown: {"calories":número,"protein":número,"carbs":número,"fat":número,"summary":"descripción breve en español"}. Solo números enteros.`,
        messages: [{ role: 'user', content: description }],
      }),
    });

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return { statusCode: 200, headers, body: JSON.stringify(parsed) };

  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
