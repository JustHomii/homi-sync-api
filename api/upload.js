import Redis from 'ioredis';

// Vercel이 새로 발급해준 REDIS_URL 열쇠를 사용해 금고를 엽니다.
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  // ✅ CORS 허용 헤더 추가 (PC 웹에서 API 호출 허용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ 브라우저 사전 검사(Preflight) 즉시 통과
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { booths } = req.body;
  if (!booths || !Array.isArray(booths)) {
    return res.status(400).json({ error: '부스 배열이 없습니다.' });
  }

  const syncCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 오리지널 Redis는 배열을 문자열(JSON.stringify)로 변환해서 저장해야 합니다. ('EX', 86400 = 24시간 뒤 폭파)
  await redis.set(`sync:${syncCode}`, JSON.stringify(booths), 'EX', 86400);

  return res.status(200).json({ code: syncCode });
}
