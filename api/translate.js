module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY belum diatur di Environment Variables Vercel.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || 'gpt-4o-mini',
        temperature: 0.25,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: body.systemPrompt || 'Balas JSON valid.' },
          { role: 'user', content: body.userPrompt || '' }
        ]
      }),
    });

    const data = await response.json();
    if (response.ok) data.providerLabel = 'ChatGPT (gpt-4o-mini)';
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
