import z from "zod";
import { api } from "./api";

const exportResponseSchema = z.object({
	id: z.string(),
	fileName: z.string(),
	downloadUrl: z.string().check(z.url()),
	createdAt: z.string().check(z.iso.datetime()),
});

export type ExportResponse = z.infer<typeof exportResponseSchema>;

export async function createCsv(): Promise<ExportResponse> {
	try {
		const response = await api.post<ExportResponse>("/urls/export");
		return exportResponseSchema.parse(response.data);
	} catch (error) {
		console.error("Erro ao exportar urls:", error);
		throw error;
	}
}
