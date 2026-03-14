import { AxiosError } from "axios";
import type { ShortenedUrl } from "@/types";
import { api } from "./api";

interface CreateShortenedUrlProps {
	originalUrl: string;
	shortenedUrl: string;
}

export const createUrl = async (
	data: CreateShortenedUrlProps
): Promise<ShortenedUrl | undefined> => {
	try {
		const response = await api.post("/urls", {
			originalUrl: data.originalUrl,
			shortUrl: data.shortenedUrl, // ← renomeia para o que o backend espera
		});

		const url = response.data;

		return {
			id: url.urlId, // ← backend retorna urlId, não id
			originalUrl: url.originalUrl,
			shortenedUrl: url.shortUrl, // ← mapeia shortUrl → shortenedUrl
			accessCount: url.accessCount,
			createdAt: new Date(url.createdAt),
		};
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			throw new Error(error.code);
		}
	}
};
