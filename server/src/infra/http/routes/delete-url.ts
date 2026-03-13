import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { deleteUrl } from "@/app/functions/delete-url";
import { isRight, unwrapEither } from "@/shared/either";

export const deleteUrlRoute: FastifyPluginAsyncZod = async server => {
	server.delete(
		"/urls/:shortenedUrl",
		{
			schema: {
				summary: "Deletar o url encurtado",
				tags: ["urls"],
				params: z.object({
					shortenedUrl: z
						.string()
						.min(1, "O shortenedUrl não pode estar vazio"),
				}),
				response: {
					200: z
						.object({
							success: z.boolean(),
						})
						.describe("A url foi deletada com sucesso!"),
					409: z
						.object({
							message: z.string(),
						})
						.describe("A url não foi encontrada"),
				},
			},
		},
		async (request, reply) => {
			const { shortenedUrl } = request.params;

			const result = await deleteUrl(shortenedUrl);

			if (isRight(result)) {
				return reply.status(200).send({
					success: true,
				});
			}

			const error = unwrapEither(result);

			switch (error.constructor.name) {
				case "UrlNotFound":
					return reply.status(409).send({
						message: error.message,
					});
			}
		}
	);
};
