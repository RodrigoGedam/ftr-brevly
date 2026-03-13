import { eq } from "drizzle-orm";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { ShortenedUrlNotFound } from "./errors/shortened-url-not-found";

export type GetOriginalUrlOutput = Either<
	ShortenedUrlNotFound,
	{
		originalUrl: string;
		accessCount: number;
	}
>;

export async function getOriginalUrl(
	shortUrl: string
): Promise<GetOriginalUrlOutput> {
	const link = await db
		.select({
			originalUrl: schema.urls.originalUrl,
			accessCount: schema.urls.accessCount,
		})
		.from(schema.urls)
		.where(eq(schema.urls.shortUrl, shortUrl));

	if (link.length === 0) {
		return makeLeft(new ShortenedUrlNotFound(shortUrl));
	}

	await db
		.update(schema.urls)
		.set({ accessCount: link[0].accessCount + 1 })
		.where(eq(schema.urls.shortUrl, shortUrl));

	return makeRight({
		originalUrl: link[0].originalUrl,
		accessCount: link[0].accessCount + 1,
	});
}
