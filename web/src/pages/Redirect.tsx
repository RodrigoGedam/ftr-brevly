import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getOriginalUrl } from "@/http/get-original-url";

export const Redirect = () => {
	const { shortenedUrl } = useParams<{ shortenedUrl: string }>();
	const [error, setError] = useState<string | null>(null);
	const [originalUrl, setOriginalUrl] = useState<string | null>(null);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (!shortenedUrl || hasFetched.current) return;

		async function redirectToOriginalUrl() {
			hasFetched.current = true;

			try {
				const response = await getOriginalUrl(shortenedUrl as string);
				setOriginalUrl(response.originalUrl);
				window.location.href = response.originalUrl;
			} catch (err) {
				console.error("Erro ao buscar a url original:", err);
				setError("Url não encontrada ou inválida");
			}
		}

		redirectToOriginalUrl();
	}, [shortenedUrl]);

	return (
		<>
			{error ? (
				<div className="min-h-dvh flex flex-col items-center justify-center bg-gray-100 p-4">
					<div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 text-center">
						<div className="flex justify-center mb-3">
							<img
								src="/404.svg"
								alt="404 - Url não encontrada"
								className="h-20"
							/>
						</div>
						<h1 className="text-xl font-bold text-gray-800 mb-5">
							Url não encontrada
						</h1>
						<p className="text-gray-500 text-sm">
							A url que você está tentando acessar não existe, foi
							removida ou é uma url inválida. Saiba mais em{" "}
							<a
								href="/"
								className="text-blue-base hover:underline"
							>
								brev.ly
							</a>
							.
						</p>
					</div>
				</div>
			) : (
				<div className="min-h-dvh flex flex-col items-center justify-center p-4">
					<div className="w-full max-w-md bg-gray-100 rounded-lg shadow-sm p-8 text-center">
						<div className="flex justify-center mb-6">
							<img
								src="/Logo_Icon.svg"
								alt="Brevly Logo"
								width="43"
								height="43"
							/>
						</div>
						<h1 className="text-xl font-bold text-gray-800 mb-5">
							Redirecionando...
						</h1>

						<p className="text-gray-600 text-sm mb-3">
							O link será aberto automaticamente em alguns
							instantes.
						</p>

						<p className="text-gray-600 text-sm">
							Não foi redirecionado?{" "}
							<button
								type="button"
								onClick={() => {
									if (originalUrl) {
										window.location.href = originalUrl;
									}
								}}
								className="text-blue-base hover:underline bg-transparent border-none p-0 cursor-pointer"
								style={{ background: "none", border: "none" }}
							>
								Acesse aqui
							</button>
						</p>
					</div>
				</div>
			)}
		</>
	);
};
