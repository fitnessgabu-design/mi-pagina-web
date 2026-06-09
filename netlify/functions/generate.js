exports.handler = async function(event) {
  const body = JSON.parse(event.body);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1200, messages: body.messages })
  });
  const data = await res.json();
  return { statusCode: 200, headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) };
};
