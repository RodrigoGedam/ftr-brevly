import { Readable } from "node:stream";
import { stringify } from "csv-stringify";
import { uuidv7 } from "uuidv7";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { type Either, makeRight } from "@/shared/either";

export type Export = {
	id: string;
	fileName: string;
	remoteKey: string;
	remoteUrl: string;
	createdAt: Date;
};

export type ExportUrlsToCSVOutput = Either<never, Export>;

export async function exportUrlsToCSV(): Promise<ExportUrlsToCSVOutput> {
	const urls = await db
		.select()
		.from(schema.urls)
		.orderBy(schema.urls.createdAt);

	const csvData = urls.map(url => ({
		id: url.id,
		originalUrl: url.originalUrl,
		shortUrl: url.shortUrl,
		accessCount: url.accessCount,
		createdAt: url.createdAt.toISOString(),
	}));

	const dataStream = Readable.from(csvData);

	const exportId = uuidv7();
	const fileName = `urls-export-${exportId}.csv`;

	const stringifier = stringify({
		header: true,
		columns: {
			id: "Id",
			originalUrl: "Url Original",
			shortUrl: "Url Encurtada",
			accessCount: "Contagem de Acessos",
			createdAt: "Data de Criação",
		},
	});

	const contentStream = dataStream.pipe(stringifier);

	const { key, url } = await uploadFileToStorage({
		folder: "downloads",
		fileName,
		contentType: "text/csv",
		contentStream,
	});

	const [urlExport] = await db
		.insert(schema.urlExport)
		.values({
			id: exportId,
			fileName,
			remoteKey: key,
			remoteUrl: url,
		})
		.returning();

	return makeRight({
		id: urlExport.id,
		fileName: urlExport.fileName,
		remoteKey: urlExport.remoteKey,
		remoteUrl: urlExport.remoteUrl,
		createdAt: urlExport.createdAt,
	});
}
