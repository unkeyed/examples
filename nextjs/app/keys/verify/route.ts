import { NextRequestWithUnkeyContext, withUnkey } from "@unkey/nextjs";
import { NextResponse } from "next/server";

async function handler(req: NextRequestWithUnkeyContext) {
	if (!req.unkey.valid) {
		return new Response("unauthorized", { status: 403 });
	}

	return new NextResponse(
		`Your API key is valid!
		
${JSON.stringify(req.unkey, null, 2)}
	`,
	);
}

export const POST = withUnkey(handler);
export const GET = withUnkey(handler, {
	getKey: (req) => new URL(req.url).searchParams.get("key"),
});
