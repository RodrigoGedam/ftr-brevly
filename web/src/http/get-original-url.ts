import { AxiosError } from "axios";
import { api } from "./api";

export async function getOriginalUrl(
	shortenedUrl: string
): Promise<{ originalUrl: string }> {
	try {
		const response = await api.get(`/urls/${shortenedUrl}`);
		return response.data;
	} catch (error) {
		console.error(error);
		if (error instanceof AxiosError) {
			throw new Error(error.code);
		}
		throw new Error("Server Internal Error");
	}
}
