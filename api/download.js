import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  const { code } = req.query; 
  if (!code) return res.status(400).json({ error: '코드가 필요합니다.' });

  // 금고에서 코드 번호로 데이터 꺼내오기
  const data = await redis.get(`sync:${code}`);
  
  if (!data) {
    return res.status(404).json({ error: '코드가 만료되었거나 존재하지 않습니다.' });
  }

  // 문자열을 다시 모바일용 배열(JSON.parse)로 풀어서 전송
  res.status(200).json({ booths: JSON.parse(data) });
}
