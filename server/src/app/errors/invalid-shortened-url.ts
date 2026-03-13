export class InvalidShortenedUrl extends Error {
	constructor(shortenedUrl: string) {
		super(`A url encurtada "${shortenedUrl}" é inválida.`);
	}
}
