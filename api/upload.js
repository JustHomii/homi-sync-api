import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { booths } = req.body;
  if (!booths || !Array.isArray(booths)) {
    return res.status(400).json({ error: '부스 배열이 없습니다.' });
  }

  const syncCode = Math.floor(100000 + Math.random() * 900000).toString();
  await kv.set(`sync:${syncCode}`, booths, { ex: 86400 });

  res.status(200).json({ code: syncCode });
}
