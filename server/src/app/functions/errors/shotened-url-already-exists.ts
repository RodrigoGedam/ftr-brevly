export class ShortenedUrlAlreadyExists extends Error {
	constructor(shortenedUrl: string) {
		super(`A url encurtada "${shortenedUrl}" já existe.`);
	}
}
