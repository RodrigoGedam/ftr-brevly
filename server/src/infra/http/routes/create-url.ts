import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

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
							/* originalUrl: z.string().check(z.url()),
							shortUrl: z.string(),
							accessCount: z.number(),
							createdAt: z.string().check(z.iso.datetime()), */
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
		async (_request, reply) => {
			return reply.status(201).send({ urlId: "teste" });
		}
	);
};
