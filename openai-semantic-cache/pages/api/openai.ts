import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.SEMANTIC_CACHE_GATEWAY_URL
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { selectedSubject } = req.body;
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `write a haiku about ${selectedSubject}` }],
      });

      res.status(200).json({ message: response.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Error processing your request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}