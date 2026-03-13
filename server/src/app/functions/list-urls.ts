import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeRight } from "@/shared/either";

export type Url = {
	id: string;
	originalUrl: string;
	shortUrl: string;
	accessCount: number;
	createdAt: Date;
};

export type ListUrlsOutput = Either<
	never,
	{
		urls: Url[];
	}
>;

export async function listUrls(): Promise<ListUrlsOutput> {
	const urls = await db
		.select()
		.from(schema.urls)
		.orderBy(schema.urls.createdAt);

	return makeRight({
		urls: urls.map(url => ({
			id: url.id,
			originalUrl: url.originalUrl,
			shortUrl: url.shortUrl,
			accessCount: url.accessCount,
			createdAt: url.createdAt,
		})),
	});
}
