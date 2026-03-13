import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getOriginalUrl } from "@/app/functions/get-original-url";
import { isLeft, unwrapEither } from "@/shared/either";

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async server => {
	server.get(
		"/:shortenedUrl",
		{
			schema: {
				summary: "Obter url original a partir da url encurtada",
				tags: ["urls"],
				params: z.object({
					shortUrl: z
						.string()
						.min(
							3,
							"A url encurtada deve ter pelo menos 3 caracteres"
						)
						.max(
							15,
							"A url encurtada deve ter no máximo 15 caracteres"
						)
						.regex(
							/^[a-zA-Z0-9-_]+$/,
							"A url encurtada deve conter apenas letras, números, hífens e underscores"
						),
				}),
				response: {
					200: z
						.object({
							originalUrl: z.string(),
						})
						.describe("A url original foi obtida com sucesso!"),
					409: z.object({ message: z.string() }),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const { shortUrl } = request.params;

			const result = await getOriginalUrl(shortUrl);

			if (isLeft(result)) {
				const error = unwrapEither(result);

				switch (error.constructor.name) {
					case "ShortenedUrlNotFound":
						return reply.status(409).send({
							message: error.message,
						});
					default:
						return reply.status(500).send({
							message: "Erro interno ao buscar a url.",
						});
				}
			}

			return reply.status(200).send({
				originalUrl: result.right.originalUrl,
			});
		}
	);
};
