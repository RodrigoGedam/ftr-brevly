export class UrlNotFound extends Error {
	constructor(id: string) {
		super(`Url com ID "${id}" não encontrado.`);
	}
}
