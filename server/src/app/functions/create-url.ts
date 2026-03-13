import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { InvalidShortenedUrl } from "../errors/invalid-shortened-url";
import { ShortenedUrlAlreadyExists } from "../errors/shotened-url-already-exists";

const createUrlInput = z.object({
	originalUrl: z
		.string()
		.check(z.url("A url original deve ser uma url válida")),
	shortUrl: z
		.string()
		.min(3, "A url encurtada deve ter pelo menos 3 caracteres")
		.max(15, "A url encurtada deve ter no máximo 15 caracteres")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"A url encurtada deve conter apenas letras, números, hífens e sublinhados"
		),
});

export type CreateUrlInput = z.input<typeof createUrlInput>;
export type CreateUrlOutput = Either<
	ShortenedUrlAlreadyExists | InvalidShortenedUrl,
	{
		id: string;
		originalUrl: string;
		shortUrl: string;
		accessCount: number;
		createdAt: Date;
	}
>;

export async function createUrl(
	input: CreateUrlInput
): Promise<CreateUrlOutput> {
	const parsed = createUrlInput.safeParse(input);

	if (!parsed.success) {
		return makeLeft(new InvalidShortenedUrl(input.shortUrl));
	}

	const existingUrl = await db
		.select()
		.from(schema.links)
		.where(eq(schema.links.shortUrl, parsed.data.shortUrl));

	if (existingUrl.length > 0) {
		return makeLeft(new ShortenedUrlAlreadyExists(parsed.data.shortUrl));
	}

	const [link] = await db
		.insert(schema.links)
		.values({
			originalUrl: parsed.data.originalUrl,
			shortUrl: parsed.data.shortUrl,
		})
		.returning();

	return makeRight({
		id: link.id,
		originalUrl: link.originalUrl,
		shortUrl: link.shortUrl,
		accessCount: link.accessCount,
		createdAt: link.createdAt,
	});
}
