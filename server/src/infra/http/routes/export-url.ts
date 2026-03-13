import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { exportUrlsToCSV } from "@/app/functions/export-to-csv";
import { isRight } from "@/shared/either";

export const exportUrlRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		"/urls/export",
		{
			schema: {
				summary: "Exportar urls para CSV",
				tags: ["urls"],
				response: {
					200: z
						.object({
							id: z.string(),
							fileName: z.string(),
							downloadUrl: z.string().check(z.url()),
							createdAt: z.string().check(z.iso.datetime()),
						})
						.describe("Dados da exportação"),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (_request, reply) => {
			const result = await exportUrlsToCSV();

			if (isRight(result)) {
				return reply.status(200).send({
					id: result.right.id,
					fileName: result.right.fileName,
					downloadUrl: result.right.remoteUrl,
					createdAt: result.right.createdAt.toISOString(),
				});
			}

			return reply.status(500).send({
				message: "Erro interno ao exportar as urls.",
			});
		}
	);
};
