import { AxiosError } from "axios";
import { api } from "./api";

export async function deleteShortenedUrl(shortenedUrl: string) {
	try {
		await api.delete(`/urls/${shortenedUrl}`);
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			throw new Error(error.code);
		}
	}
}
