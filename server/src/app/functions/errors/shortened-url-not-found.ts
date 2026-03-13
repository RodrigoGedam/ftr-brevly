export class ShortenedUrlNotFound extends Error {
	constructor(shortenedUrl: string) {
		super(`Url encurtada "${shortenedUrl}" não encontrada.`);
	}
}
