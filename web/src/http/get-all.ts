import { z } from "zod";
import { api } from "./api";

const urlSchema = z
	.object({
		id: z.string().check(z.uuid()),
		originalUrl: z.string().check(z.url()),
		shortUrl: z.string(),
		accessCount: z.number(),
		createdAt: z.string().check(z.iso.datetime()),
	})
	.transform(url => ({
		id: url.id,
		originalUrl: url.originalUrl,
		shortenedUrl: url.shortUrl,
		accessCount: url.accessCount,
		createdAt: new Date(url.createdAt),
	}));

const getUrlsResponseSchema = z.object({
	urls: z.array(urlSchema),
});

export type Url = z.infer<typeof urlSchema>;
export type GetUrlsResponse = z.infer<typeof getUrlsResponseSchema>;

export async function getAll() {
	try {
		const response = await api.get<GetUrlsResponse>("/urls");
		return getUrlsResponseSchema.parse(response.data);
	} catch (error) {
		console.error("Erro ao buscar as urls:", error);
		throw error;
	}
}
