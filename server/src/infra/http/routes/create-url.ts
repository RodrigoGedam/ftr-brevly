import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { createUrl } from "@/app/functions/create-url";
import { isRight, unwrapEither } from "@/shared/either";

export const createUrlRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		"/links",
		{
			schema: {
				summary: "Create a shortened url",
				tags: ["links"],
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
						.describe("Link criado com sucesso"),
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
				const link = unwrapEither(result);

				return reply.status(201).send({
					urlId: link.id,
					originalUrl: link.originalUrl,
					shortUrl: link.shortUrl,
					accessCount: link.accessCount,
					createdAt: link.createdAt.toISOString(),
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
						message: "Erro interno ao criar o link.",
					});
			}
		}
	);
};
