import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { createUrl } from "@/app/functions/create-url";
import { isRight, unwrapEither } from "@/shared/either";

export const createUrlRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		"/urls",
		{
			schema: {
				summary: "Create a shortened url",
				tags: ["urls"],
				body: z.object({
					originalUrl: z
						.string()
						.check(z.url("A url original deve ser uma url válida")),
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
					201: z
						.object({
							urlId: z.string(),
							originalUrl: z.string().check(z.url()),
							shortUrl: z.string(),
							accessCount: z.number(),
							createdAt: z.string().check(z.iso.datetime()),
						})
						.describe("Url criada com sucesso"),
					409: z.object({
						message: z
							.string()
							.describe("A url encurtada já existe."),
					}),
				},
			},
		},
		async (request, reply) => {
			const { originalUrl, shortUrl } = request.body;

			const result = await createUrl({
				originalUrl,
				shortUrl,
			});

			if (isRight(result)) {
				const url = unwrapEither(result);

				return reply.status(201).send({
					urlId: url.id,
					originalUrl: url.originalUrl,
					shortUrl: url.shortUrl,
					accessCount: url.accessCount,
					createdAt: url.createdAt.toISOString(),
				});
			}

			const error = unwrapEither(result);

			switch (error.constructor.name) {
				case "InvalidShortenedUrl":
					return reply.status(409).send({
						message: error.message,
					});
				case "ShortenedUrlAlreadyExists":
					return reply.status(409).send({
						message: error.message,
					});
				default:
					return reply.status(409).send({
						message: "Erro ao criar a url.",
					});
			}
		}
	);
};
