export default async function handler(req, res) {
     if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
     const apiKey = (process.env.GEMINI_API_KEY || '').trim();
     if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY belum diatur di Vercel.' });

     try {
       const { model = 'gemini-3-flash-preview', payload } = req.body || {};
       const response = await fetch(
         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'x-goog-api-key': apiKey,
           },
           body: JSON.stringify(payload),
         }
       );
       const data = await response.json();
       if (!response.ok) return res.status(response.status).json(data);
       return res.status(200).json(data);
     } catch (err) {
       return res.status(500).json({ error: err.message });
     }
   }
