import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.SEMANTIC_CACHE_GATEWAY_URL
});

export async function POST(req: Request) {
    try {
        const { selectedSubject } = await req.json();
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: `write a haiku about ${selectedSubject}` }],
      });

      return Response.json({ message: response.choices[0].message.content }, {status: 200});
    }
    catch(error) {
      return Response.json({ error: `Error processing your request: ${error}`}, {status: 500});
    }
}