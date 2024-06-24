import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: `https://${process.env.GATEWAY_NAME}.llm.unkey.io`,
	fetch: customFetch,
});

const state = { cache: false };

async function customFetch(url: RequestInfo, options?: RequestInit) {
	const response = await fetch(url, options);

	// Log headers
	const headers = response.headers;
	headers.forEach((value, key) => {
		if (key === "unkey-cache") {
			if (value === "HIT") {
				state.cache = true;
			} else {
				state.cache = false;
			}
		}
	});

	return response;
}

export async function POST(req: Request) {
	const json = await req.json();
	const { messages } = json;

	try {
		const res = await openai.chat.completions.create({
			model: "gpt-4",
			messages,
			stream: true,
		});

		const stream = OpenAIStream(res);

		return new StreamingTextResponse(stream, {
			headers: {
				"X-Unkey-Cache": state.cache ? "HIT" : "MISS",
			},
		});
	} catch (error) {
		console.error(error);
	}
}
