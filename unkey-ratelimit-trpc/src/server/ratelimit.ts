import { env } from "~/env";

import { Ratelimit } from "@unkey/ratelimit";
 type RatelimitType = {
	namespace: string;
	limit: number;
	duration: number;
	userId: string;
}
export const UnkeyRatelimit = async ({namespace, limit, duration, userId} :RatelimitType) => {
	const unkey = new Ratelimit({
		rootKey: env.UNKEY_ROOT_KEY,
		namespace: namespace,
		limit: limit ?? 3,
		duration: duration ? `${duration}s` : `${5}s`,
	});

	const { success } = await unkey.limit(userId);
	return success;
};
