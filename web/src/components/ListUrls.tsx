import {
	DownloadSimpleIcon,
	LinkIcon,
	SpinnerIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { createCsv } from "@/http/create-csv";
import type { ShortenedUrl } from "@/types";
import { ShortenedUrlItem } from "./ShortenedUrlItem";

interface ListUrlsProps {
	urls?: ShortenedUrl[];
	isLoading?: boolean;
	onDeleteUrl: (shortenedUrl: string) => void;
}

export const ListUrls = ({
	urls = [],
	isLoading = false,
	onDeleteUrl,
}: ListUrlsProps) => {
	const [isExporting, setIsExporting] = useState(false);

	const hasUrls = urls.length > 0;

	const handleDownloadCSV = async () => {
		if (isExporting || !hasUrls) return;

		try {
			setIsExporting(true);

			const response = await createCsv();

			const downloadLink = document.createElement("a");
			downloadLink.href = response.downloadUrl;
			downloadLink.download = response.fileName;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		} catch (error) {
			console.error("Erro ao exportar CSV:", error);
		} finally {
			setIsExporting(false);
		}
	};
	return (
		<>
			{isLoading ? (
				<div className="bg-gray-100 flex flex-col gap-4 h-fit justify-center lg:justify-start lg:p-8 lg:w-145 p-6 relative rounded-lg w-full">
					<header className="flex justify-between items-center">
						<h2 className="text-lg text-gray-600">Meus Links</h2>
						<button
							className="bg-gray-200 cursor-pointer disabled:cursor-auto disabled:bg-gray-200/50 disabled:text-gray-500/50 font-[620] flex gap-x-1.5 hover:bg-gray-300 items-center justify-between p-2 rounded-sm text-gray-500 text-sm"
							type="button"
							disabled={Boolean(urls.length === 0)}
						>
							<DownloadSimpleIcon weight="bold" size={16} />
							Baixar CSV
						</button>
					</header>
					<hr className="h-px border-gray-200" />
					<div
						className={`flex flex-col gap-y-3 items-center justify-center ${urls.length > 0 ? "divide-y-[1.5px]" : "divide-y-0"} divide-gray-200`}
					>
						<div className="flex flex-col gap-3 justify-center items-center pt-3">
							<SpinnerIcon className="text-gray-400 shrink-0 size-8 animate-spin stroke-3" />
							<p className="text-gray-400 text-sm uppercase">
								Carregando links...
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="bg-gray-100 flex flex-col gap-4 h-fit justify-center lg:justify-start lg:p-8 lg:w-145 lg:max-h-130.75 not-sm:max-h-120 p-6 rounded-lg w-full">
					<header className="flex justify-between items-center">
						<h2 className="text-lg text-gray-600">Meus Links</h2>
						<button
							className="bg-gray-200 cursor-pointer disabled:cursor-auto disabled:bg-gray-200/50 disabled:text-gray-500/50 font-[620] flex gap-x-1.5 hover:bg-gray-300 items-center justify-between p-2 rounded-sm text-gray-500 text-sm"
							type="button"
							disabled={Boolean(urls.length === 0)}
							onClick={() => handleDownloadCSV()}
						>
							<DownloadSimpleIcon weight="bold" size={16} />
							Baixar CSV
						</button>
					</header>
					<hr className="h-px border-gray-200" />
					<div
						className={`flex flex-col gap-y-3 ${urls.length > 0 ? "divide-y-[1.5px]" : "divide-y-0"} divide-gray-200 overflow-y-scroll scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-blue-base scrollbar-track-transparent`}
					>
						{urls.length ? (
							urls.map(url => (
								<ShortenedUrlItem
									key={url.shortenedUrl}
									originalUrl={url.originalUrl}
									shortenedUrl={url.shortenedUrl}
									accessCount={url.accessCount}
									deleteUrl={onDeleteUrl}
								/>
							))
						) : (
							<div className="flex flex-col gap-3 justify-center items-center pt-3">
								<LinkIcon className="text-gray-400" size={32} />
								<p className="text-gray-500 text-xs">
									Ainda não existe links cadastrados
								</p>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};
