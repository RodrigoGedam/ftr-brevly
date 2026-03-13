import { eq } from "drizzle-orm";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { UrlNotFound } from "./errors/url-not-found";

export type DeleteUrlOutput = Either<UrlNotFound, { success: true }>;

export async function deleteUrl(shortUrl: string): Promise<DeleteUrlOutput> {
	const existingUrl = await db
		.select({ id: schema.urls.id })
		.from(schema.urls)
		.where(eq(schema.urls.shortUrl, shortUrl));

	if (existingUrl.length === 0) {
		return makeLeft(new UrlNotFound(shortUrl));
	}

	await db.delete(schema.urls).where(eq(schema.urls.shortUrl, shortUrl));

	return makeRight({ success: true });
}
