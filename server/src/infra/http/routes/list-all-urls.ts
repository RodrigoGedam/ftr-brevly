import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { listUrls } from "@/app/functions/list-urls";
import { isRight } from "@/shared/either";

export const listAllUrlsRoute: FastifyPluginAsyncZod = async server => {
	server.get(
		"/urls",
		{
			schema: {
				summary: "Listar todas as urls cadastradas",
				tags: ["urls"],
				response: {
					200: z
						.object({
							urls: z.array(
								z.object({
									id: z.string(),
									originalUrl: z.string().check(z.url()),
									shortUrl: z.string(),
									accessCount: z.number(),
									createdAt: z
										.string()
										.check(z.iso.datetime()),
								})
							),
						})
						.describe("Lista de urls cadastradas"),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (_request, reply) => {
			const result = await listUrls();

			if (isRight(result)) {
				return reply.status(200).send({
					urls: result.right.urls.map(url => ({
						id: url.id,
						originalUrl: url.originalUrl,
						shortUrl: url.shortUrl,
						accessCount: url.accessCount,
						createdAt: url.createdAt.toISOString(),
					})),
				});
			}

			return reply.status(500).send({
				message: "Erro interno ao listar os urls.",
			});
		}
	);
};
