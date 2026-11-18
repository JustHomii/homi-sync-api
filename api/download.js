import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { code } = req.query; 
  if (!code) return res.status(400).json({ error: '코드가 필요합니다.' });

  const booths = await kv.get(`sync:${code}`);
  
  if (!booths) {
    return res.status(404).json({ error: '코드가 만료되었거나 존재하지 않습니다.' });
  }

  res.status(200).json({ booths });
}
