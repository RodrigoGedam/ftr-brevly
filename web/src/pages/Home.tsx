import { useEffect, useState } from "react";
import { CreateUrlsForm } from "@/components/CreateUrlsForm";
import { ListUrls } from "@/components/ListUrls";
import type { ShortenedUrl } from "@/types";

export const Home = () => {
	const [urls, setUrls] = useState<ShortenedUrl[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadUrls() {
			try {
				setIsLoading(true);
				/* const response = await getAll();

				setUrls(response.urls); */
			} catch (error) {
				console.error("Erro ao buscar urls:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadUrls();
	}, []);

	const handleUrlCreated = (newUrl: ShortenedUrl) => {
		setUrls(prevUrls => [newUrl, ...prevUrls]);
	};

	const handleUrlDeleted = (shortUrl: string) => {
		setUrls(prevUrls =>
			prevUrls.filter(url => url.shortenedUrl !== shortUrl)
		);
	};

	return (
		<main className="flex min-h-screen items-start justify-center bg-gray-300 px-4 pt-0 pb-8 md:items-center md:px-6 md:py-12">
			<div className="mx-auto flex w-full max-w-350 flex-col items-start justify-center md:items-center">
				<div className="w-full max-w-md lg:max-w-246.5">
					<div className="mb-4 flex justify-center md:mb-8 lg:justify-start">
						<img
							src="/Logo.svg"
							alt="brev.ly"
							className="h-6 w-[96.67px]"
						/>
					</div>
					<section className="flex w-full flex-col items-center justify-center gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-center">
						<CreateUrlsForm onUrlCreated={handleUrlCreated} />
						<ListUrls
							urls={urls}
							isLoading={isLoading}
							onDeleteUrl={handleUrlDeleted}
						/>
					</section>
				</div>
			</div>
		</main>
	);
};
